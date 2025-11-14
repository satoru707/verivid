import { PrismaClient } from '@prisma/client';
import { Dropbox } from 'dropbox';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import os from 'os';
import path from 'path';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

const accessToken = process.env.DROPBOX_ACCESS_TOKEN;
if (!accessToken) {
  throw new Error('DROPBOX_ACCESS_TOKEN not defined');
}
const dbx = new Dropbox({ accessToken });
export const folder = process.env.DROPBOX_FOLDER || '/VeriVidVideos';

async function downloadFromDropbox(
  dbxPath: string,
  tempPath: string
): Promise<void> {
  try {
    const response = (await dbx.filesDownload({ path: dbxPath })) as any;
    fs.writeFileSync(tempPath, response.result.fileBlob as Buffer);
  } catch (error) {
    console.error('Error downloading from Dropbox:', error);
    throw error;
  }
}

async function uploadToDropbox(
  dbxPath: string,
  filePath: string
): Promise<string> {
  try {
    const contents = fs.readFileSync(filePath);
    const response = await dbx.filesUpload({
      path: dbxPath,
      contents,
      mode: { '.tag': 'add' },
      autorename: true,
    });
    const sharedLink = await dbx.sharingCreateSharedLinkWithSettings({
      path: response.result.path_lower as string,
    });
    return sharedLink.result.url.replace('?dl=0', '?raw=1');
  } catch (error) {
    console.error('Error uploading to Dropbox:', error);
    throw error;
  }
}

export async function processVideoMetadata(
  videoId: string,
  storageUrl: string
): Promise<void> {
  const tempDir = os.tmpdir();
  const tempVideoPath = path.join(tempDir, `video-${videoId}.mp4`);
  const dbxPath = storageUrl;

  try {
    console.log(`[Worker] Processing metadata for video ${videoId}`);

    await downloadFromDropbox(dbxPath, tempVideoPath);

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
  const dbxPath = storageUrl;
  const thumbnailDbxPath = `${folder}/thumbnails/${videoId}.jpg`;

  try {
    console.log(`[Worker] Generating thumbnail for video ${videoId}`);

    await downloadFromDropbox(dbxPath, tempVideoPath);

    await execAsync(
      `ffmpeg -i ${tempVideoPath} -ss 00:00:01.000 -vframes 1 ${tempThumbnailPath}`
    );

    const thumbnailUrl = await uploadToDropbox(
      thumbnailDbxPath,
      tempThumbnailPath
    );

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
  const dbxPath = storageUrl;
  const transcodedDbxPath = `${folder}/transcoded/${videoId}.mp4`;

  try {
    console.log(`[Worker] Starting transcoding for video ${videoId}`);

    await downloadFromDropbox(dbxPath, tempVideoPath);

    await execAsync(
      `ffmpeg -i ${tempVideoPath} -vf scale=1280:720 -c:v libx264 -preset slow -crf 23 ${tempTranscodedPath}`
    );

    const transcodedUrl = await uploadToDropbox(
      transcodedDbxPath,
      tempTranscodedPath
    );

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