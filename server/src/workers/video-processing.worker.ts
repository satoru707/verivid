import { PrismaClient } from '@prisma/client';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { Readable } from 'stream';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});
const bucket = process.env.S3_BUCKET || '';

async function downloadFromS3(key: string, tempPath: string): Promise<void> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const { Body } = await s3.send(command);
  if (!Body) throw new Error('No body in S3 object');
  const stream = Body as Readable;
  const writeStream = fs.createWriteStream(tempPath);
  await new Promise((resolve, reject) => {
    stream
      .pipe(writeStream)
      .on('finish', () => resolve)
      .on('error', reject);
  });
}

async function uploadToS3(key: string, filePath: string): Promise<string> {
  const body = fs.createReadStream(filePath);
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
  });
  await s3.send(command);
  return `s3://${bucket}/${key}`;
}

export async function processVideoMetadata(
  videoId: string,
  storageUrl: string
): Promise<void> {
  const tempDir = os.tmpdir();
  const tempVideoPath = path.join(tempDir, `video-${videoId}.mp4`);
  const key = storageUrl.replace(`s3://${bucket}/`, '');

  try {
    console.log(`[Worker] Processing metadata for video ${videoId}`);

    await downloadFromS3(key, tempVideoPath);

    const { stdout } = await execAsync(
      `ffprobe -v error -show_format -show_streams -print_format json ${tempVideoPath}`
    );
    const probeData = JSON.parse(stdout);
    const videoStream = probeData.streams.find(
      (s: any) => s.codec_type === 'video'
    );

    const metadata = {
      durationSec: Math.floor(parseFloat(probeData.format.duration)),
      width: videoStream.width,
      height: videoStream.height,
    };

    await prisma.video.update({
      where: { id: videoId },
      data: metadata,
    });

    console.log(`[Worker] Completed metadata processing for video ${videoId}`);
  } catch (error) {
    console.error(
      `[Worker] Error processing video metadata ${videoId}:`,
      error
    );
    throw error;
  } finally {
    if (fs.existsSync(tempVideoPath)) fs.unlinkSync(tempVideoPath);
  }
}

export async function generateThumbnail(
  videoId: string,
  storageUrl: string
): Promise<void> {
  const tempDir = os.tmpdir();
  const tempVideoPath = path.join(tempDir, `video-${videoId}.mp4`);
  const tempThumbnailPath = path.join(tempDir, `thumbnail-${videoId}.jpg`);
  const key = storageUrl.replace(`s3://${bucket}/`, '');
  const thumbnailKey = `thumbnails/${videoId}.jpg`;

  try {
    console.log(`[Worker] Generating thumbnail for video ${videoId}`);

    await downloadFromS3(key, tempVideoPath);

    await execAsync(
      `ffmpeg -i ${tempVideoPath} -ss 00:00:01.000 -vframes 1 ${tempThumbnailPath}`
    );

    const thumbnailUrl = await uploadToS3(thumbnailKey, tempThumbnailPath);

    await prisma.video.update({
      where: { id: videoId },
      data: { thumbnailUrl },
    });

    console.log(`[Worker] Completed thumbnail generation for video ${videoId}`);
  } catch (error) {
    console.error(`[Worker] Error generating thumbnail ${videoId}:`, error);
    throw error;
  } finally {
    if (fs.existsSync(tempVideoPath)) fs.unlinkSync(tempVideoPath);
    if (fs.existsSync(tempThumbnailPath)) fs.unlinkSync(tempThumbnailPath);
  }
}

export async function transcodeVideo(
  videoId: string,
  storageUrl: string
): Promise<void> {
  const tempDir = os.tmpdir();
  const tempVideoPath = path.join(tempDir, `video-${videoId}.mp4`);
  const tempTranscodedPath = path.join(tempDir, `transcoded-${videoId}.mp4`);
  const key = storageUrl.replace(`s3://${bucket}/`, '');
  const transcodedKey = `transcoded/${videoId}.mp4`;

  try {
    console.log(`[Worker] Starting transcoding for video ${videoId}`);

    await downloadFromS3(key, tempVideoPath);

    await execAsync(
      `ffmpeg -i ${tempVideoPath} -vf scale=1280:720 -c:v libx264 -preset slow -crf 23 ${tempTranscodedPath}`
    );

    const transcodedUrl = await uploadToS3(transcodedKey, tempTranscodedPath);

    await prisma.video.update({
      where: { id: videoId },
      data: { transcodedUrl },
    });

    console.log(`[Worker] Completed transcoding for video ${videoId}`);
  } catch (error) {
    console.error(`[Worker] Error transcoding video ${videoId}:`, error);
    throw error;
  } finally {
    if (fs.existsSync(tempVideoPath)) fs.unlinkSync(tempVideoPath);
    if (fs.existsSync(tempTranscodedPath)) fs.unlinkSync(tempTranscodedPath);
  }
}
