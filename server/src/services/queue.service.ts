import { Queue, Worker } from 'bullmq';
import { createClient } from 'redis';
import { pinVideoToIPFS } from '../workers/ipfs-pinning.worker.js';
import { scanForDuplicates } from '../workers/duplicate-detection.worker.js';
import {
  transcodeVideo,
  generateThumbnail,
  processVideoMetadata,
} from '../workers/video-processing.worker.js';

export interface Job {
  id: string;
  type:
    | 'pin-ipfs'
    | 'transcode-video'
    | 'generate-thumbnail'
    | 'scan-duplicate'
    | 'process-metadata';
  videoId: string;
  data: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}

export class QueueService {
  private queue: Queue;
  private connection;

  constructor() {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error('REDIS_URL is not defined in environment variables');
    }
    this.connection = createClient({ url: redisUrl });
    this.queue = new Queue('verivid-queue', {
      connection: this.connection as any,
    });

    // Start scheduler
    new Queue('verivid-queue', { connection: this.connection as any });

    // Worker
    new Worker(
      'verivid-queue',
      async (job) => {
        console.log(
          `Processing job: ${job.name} for video ${job.data.videoId}`
        );
        try {
          switch (job.name) {
            case 'pin-ipfs':
              await pinVideoToIPFS(job.data.videoId, job.data.storageUrl);
              break;
            case 'transcode-video':
              await transcodeVideo(job.data.videoId, job.data.storageUrl);
              break;
            case 'generate-thumbnail':
              await generateThumbnail(job.data.videoId, job.data.storageUrl);
              break;
            case 'scan-duplicate':
              await scanForDuplicates(job.data.videoId, job.data.sha256);
              break;
            case 'process-metadata':
              await processVideoMetadata(job.data.videoId, job.data.storageUrl);
              break;
            default:
              throw new Error('Unknown job type');
          }
        } catch (error) {
          console.error(`Job ${job.id} failed:`, error);
          throw error;
        }
      },
      { connection: this.connection as any }
    );
  }

  async addJob(
    type: Job['type'],
    videoId: string,
    data: Record<string, any>
  ): Promise<string> {
    const job = await this.queue.add(type, { videoId, ...data });
    console.log(`[Queue] Added job: ${type} for video ${videoId}`);
    return job.id as string;
  }

  async getJob(jobId: string): Promise<Job | undefined> {
    const job = await this.queue.getJob(jobId);
    if (!job) return undefined;
    return {
      id: job.id as string,
      type: job.name as Job['type'],
      videoId: job.data.videoId,
      data: job.data,
      status: job.failedReason
        ? 'failed'
        : job.finishedOn
          ? 'completed'
          : job.processedOn
            ? 'processing'
            : 'pending',
      createdAt: new Date(job.timestamp),
      completedAt: job.finishedOn ? new Date(job.finishedOn) : undefined,
    };
  }

  async getAllJobs(videoId?: string): Promise<Job[]> {
    const jobs = await this.queue.getJobs([
      'waiting',
      'active',
      'completed',
      'failed',
    ]);
    const mappedJobs: Job[] = jobs.map((job) => ({
      id: job.id as string,
      type: job.name as Job['type'],
      videoId: job.data.videoId,
      data: job.data,
      status: job.failedReason
        ? 'failed'
        : job.finishedOn
          ? 'completed'
          : job.processedOn
            ? 'processing'
            : 'pending',
      createdAt: new Date(job.timestamp),
      completedAt: job.finishedOn ? new Date(job.finishedOn) : undefined,
    }));
    return videoId
      ? mappedJobs.filter((j: Job) => j.videoId === videoId)
      : mappedJobs;
  }
}
