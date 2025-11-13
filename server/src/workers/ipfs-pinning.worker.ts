import { PrismaClient } from '@prisma/client';
import { IPFSService } from '../services/ipfs.service.js';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { Readable } from 'stream';

const prisma = new PrismaClient();
const ipfsService = new IPFSService();

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

export async function pinVideoToIPFS(
  videoId: string,
  storageUrl: string
): Promise<void> {
  const tempDir = os.tmpdir();
  const tempPath = path.join(tempDir, `video-${videoId}`);
  const key = storageUrl.replace(`s3://${bucket}/`, '');

  try {
    console.log(`[Worker] Starting IPFS pin for video ${videoId}`);
    await downloadFromS3(key, tempPath);
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