import { PrismaClient } from '@prisma/client';
import { IPFSService } from '../services/ipfs.service.js';

const prisma = new PrismaClient();
const ipfsService = new IPFSService();

export async function pinVideoToIPFS(
  videoId: string,
  storageUrl: string
): Promise<void> {
  try {
    console.log(`[Worker] Starting IPFS pin for video ${videoId}`);

    const ipfsHash = await ipfsService.pinFile(storageUrl, `video-${videoId}`);

    await prisma.video.update({
      where: { id: videoId },
      data: { ipfsCid: ipfsHash },
    });

    console.log(
      `[Worker] Successfully pinned video ${videoId} to IPFS: ${ipfsHash}`
    );
  } catch (error) {
    console.error(`[Worker] Error pinning video ${videoId}:`, error);
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

    await prisma.video.update({
      where: { id: videoId },
      data: {
        // Store metadata hash separately if needed
      },
    });

    console.log(
      `[Worker] Successfully pinned metadata for video ${videoId}: ${metadataHash}`
    );
  } catch (error) {
    console.error(
      `[Worker] Error pinning metadata for video ${videoId}:`,
      error
    );
  }
}
