import { PrismaClient } from '@prisma/client';
import { Dropbox, files } from 'dropbox';
import crypto from 'crypto';
import { QueueService } from './queue.service.js';

export class UploadService {
  private prisma: PrismaClient;
  private dbx: Dropbox;
  private folder: string;
  private queueService: QueueService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    const accessToken = process.env.DROPBOX_ACCESS_TOKEN;
    this.folder = process.env.DROPBOX_FOLDER ?? '/VeriVidVideos';
    if (!accessToken) {
      throw new Error(
        'DROPBOX_ACCESS_TOKEN not defined in environment variables'
      );
    }
    this.dbx = new Dropbox({ accessToken });
    this.queueService = new QueueService();
  }

  async generatePresignedUrl(
    videoId: string,
    filename: string
  ): Promise<string> {
    return `${process.env.API_URL ?? 'http://localhost:3001'}/api/videos/${videoId}/upload?filename=${encodeURIComponent(
      filename
    )}`;
  }

  async uploadToDropbox(
    videoId: string,
    fileBuffer: Buffer,
    filename: string
  ): Promise<string> {
    const path = `${this.folder}/videos/${videoId}/${filename}`;

    const uploadResp = await this.dbx.filesUpload({
      path,
      contents: fileBuffer,
      mode: { '.tag': 'add' } as files.WriteModeAdd,
      autorename: true,
    });

    const linkResp = await this.dbx.sharingCreateSharedLinkWithSettings({
      path: uploadResp.result.path_lower ?? '',
    });

    return linkResp.result.url.replace(/\?dl=0$/, '?dl=1');
  }

  async getSharedLink(path: string): Promise<string> {
    const linkResp = await this.dbx.sharingCreateSharedLinkWithSettings({
      path,
    });
    return linkResp.result.url.replace(/\?dl=0$/, '?dl=1');
  }

  async verifyFileHash(
    videoId: string,
    expectedSha256: string
  ): Promise<boolean> {
    const video = await this.prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video?.originalName) return false;

    const path = `${this.folder}/videos/${videoId}/${video.originalName}`;

    try {
      const response = (await this.dbx.filesDownload({ path })) as any;
      const fileBuffer = Buffer.from(response.fileBlob as ArrayBuffer);

      const hash = crypto.createHash('sha256');
      hash.update(fileBuffer);
      const computed = hash.digest('hex');

      return computed === expectedSha256;
    } catch (err) {
      console.error('[Upload Service] Hash verification failed:', err);
      return false;
    }
  }

  async processVideo(videoId: string): Promise<void> {
    const video = await this.prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) throw new Error(`Video ${videoId} not found`);

    const { storageUrl, sha256 } = video;

    await this.queueService.addJob('scan-duplicate', videoId, { sha256 });
    await this.queueService.addJob('process-metadata', videoId, { storageUrl });
    await this.queueService.addJob('generate-thumbnail', videoId, {
      storageUrl,
    });
    await this.queueService.addJob('transcode-video', videoId, { storageUrl });
    await this.queueService.addJob('pin-ipfs', videoId, { storageUrl });

    console.log(`[Upload Service] Queued jobs for video ${videoId}`);
  }
}
