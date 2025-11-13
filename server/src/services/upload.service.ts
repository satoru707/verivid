import { PrismaClient } from '@prisma/client';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import crypto from 'crypto';
import { Readable } from 'stream';
import { QueueService } from './queue.service.js';

interface UploadMetadata {
  videoId: string;
  filename: string;
  sha256: string;
  size: number;
}

export class UploadService {
  private prisma: PrismaClient;
  private s3: S3Client;
  private bucket: string;
  private queueService: QueueService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;
    this.bucket = process.env.S3_BUCKET!;
    if (!accessKeyId || !secretAccessKey || !this.bucket) {
      throw new Error(
        'AWS credentials or S3_BUCKET not defined in environment variables'
      );
    }
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: { accessKeyId, secretAccessKey },
    });
    this.queueService = new QueueService();
  }

  async generatePresignedPost(
    videoId: string,
    filename: string
  ): Promise<{ url: string; fields: Record<string, string> }> {
    try {
      const key = `videos/${videoId}/${filename}`;
      const { url, fields } = await createPresignedPost(this.s3, {
        Bucket: this.bucket,
        Key: key,
        Conditions: [['content-length-range', 0, 104857600]],
        Fields: {
          success_action_status: '201',
        },
        Expires: 3600,
      });
      return { url, fields };
    } catch (error) {
      console.error(
        '[Upload Service] Failed to generate presigned post:',
        error
      );
      throw error;
    }
  }

  async verifyFileHash(
    videoId: string,
    expectedSha256: string
  ): Promise<boolean> {
    try {
      const video = await this.prisma.video.findUnique({
        where: { id: videoId },
      });

      if (!video) {
        console.warn(
          `[Upload Service] Video ${videoId} not found for hash verification`
        );
        return false;
      }

      const key = `videos/${videoId}/${video.originalName}`;
      const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
      const { Body } = await this.s3.send(command);

      if (!Body) {
        throw new Error('No body in S3 object');
      }

      const hash = crypto.createHash('sha256');
      const stream = Body as Readable;
      for await (const chunk of stream) {
        hash.update(chunk);
      }
      const computedHash = hash.digest('hex');

      const isValid = computedHash === expectedSha256;
      if (!isValid) {
        console.warn(
          `[Upload Service] Hash mismatch for video ${videoId}: expected ${expectedSha256}, got ${computedHash}`
        );
      }
      return isValid;
    } catch (error) {
      console.error('[Upload Service] Hash verification failed:', error);
      return false;
    }
  }

  async processVideo(videoId: string): Promise<void> {
    try {
      const video = await this.prisma.video.findUnique({
        where: { id: videoId },
      });

      if (!video) {
        throw new Error(`Video ${videoId} not found`);
      }

      const storageUrl = video.storageUrl;
      const sha256 = video.sha256;

      await this.queueService.addJob('scan-duplicate', videoId, { sha256 });
      await this.queueService.addJob('process-metadata', videoId, {
        storageUrl,
      });
      await this.queueService.addJob('generate-thumbnail', videoId, {
        storageUrl,
      });
      await this.queueService.addJob('transcode-video', videoId, {
        storageUrl,
      });
      await this.queueService.addJob('pin-ipfs', videoId, { storageUrl });

      console.log(
        `[Upload Service] Queued processing jobs for video ${videoId}`
      );
    } catch (error) {
      console.error('[Upload Service] Failed to process video:', error);
      throw error;
    }
  }
}
