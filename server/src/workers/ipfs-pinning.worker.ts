import { PrismaClient } from '@prisma/client';
import { IPFSService } from '../services/ipfs.service.js';
import { Dropbox } from 'dropbox';
import fs from 'fs';
import os from 'os';
import path from 'path';

const prisma = new PrismaClient();
const ipfsService = new IPFSService();

const accessToken = process.env.DROPBOX_ACCESS_TOKEN;
if (!accessToken) {
  throw new Error('DROPBOX_ACCESS_TOKEN not defined');
}
const dbx = new Dropbox({ accessToken });
const folder = process.env.DROPBOX_FOLDER || '/VeriVidVideos';

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

export async function pinVideoToIPFS(
  videoId: string,
  storageUrl: string
): Promise<void> {
  const tempDir = os.tmpdir();
  const tempPath = path.join(tempDir, `video-${videoId}.mp4`);
  const dbxPath = storageUrl;

  try {
    console.log(`[Worker] Starting IPFS pin for video ${videoId}`);

    await downloadFromDropbox(dbxPath, tempPath);

    const ipfsHash = await ipfsService.pinFile(tempPath, `video-${videoId}`);

    await prisma.video.update({
      where: { id: videoId },
      data: { ipfsCid: ipfsHash },
    });

    console.log(
      `[Worker] Successfully pinned video ${videoId} to IPFS: ${ipfsHash}`
    );
  } catch (error) {
    console.error(`[Worker] Error pinning video ${videoId}:`, error);
    throw error;
  } finally {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
}

export async function pinMetadataToIPFS(
  videoId: string,
  metadata: object
): Promise<void> {
  try {
    console.log(`[Worker] Starting metadata pin for video ${videoId}`);

    const metadataHash = await ipfsService.pinJSON(
      metadata,
      `metadata-${videoId}`
    );

    const metadataUri = ipfsService.getGatewayUrl(metadataHash);

    const verification = await prisma.verification.findFirst({
      where: { videoId },
      orderBy: { createdAt: 'desc' },
    });

    if (verification) {
      await prisma.verification.update({
        where: { id: verification.id },
        data: { metadataUri },
      });
    } else {
      await prisma.verification.create({
        data: {
          videoId,
          proofHash: '',
          signer: '',
          chain: 'ipfs',
          metadataUri,
        },
      });
    }

    console.log(
      `[Worker] Successfully pinned metadata for video ${videoId}: ${metadataHash} → ${metadataUri}`
    );
  } catch (error) {
    console.error(
      `[Worker] Error pinning metadata for video ${videoId}:`,
      error
    );
    throw error;
  }
}