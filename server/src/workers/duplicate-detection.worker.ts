import { PrismaClient } from '@prisma/client';
import { emailService } from '../services/email.service.js';

const prisma = new PrismaClient();

export async function scanForDuplicates(
  videoId: string,
  sha256: string
): Promise<void> {
  try {
    console.log(`[Worker] Scanning for duplicates for video ${videoId}`);
    const existingVideo = await prisma.video.findFirst({
      where: {
        sha256,
        id: { not: videoId },
      },
    });

    if (existingVideo) {
      console.warn(
        `[Worker] Duplicate detected! Video ${videoId} matches ${existingVideo.id}`
      );
      await flagVideoForModeration(videoId, `Duplicate of ${existingVideo.id}`);
    } else {
      console.log(`[Worker] No duplicates found for video ${videoId}`);
    }
  } catch (error) {
    console.error(
      `[Worker] Error scanning duplicates for video ${videoId}:`,
      error
    );
    throw error;
  }
}

export async function flagVideoForModeration(
  videoId: string,
  reason: string
): Promise<void> {
  try {
    console.log(`[Worker] Flagging video ${videoId} for moderation: ${reason}`);

    await prisma.video.update({
      where: { id: videoId },
      data: { flagged: true },
    });

    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: { uploader: { select: { email: true } } },
    });

    if (video?.uploader.email) {
      await emailService.sendNotification(
        video.uploader.email,
        'Video Flagged for Moderation',
        `Your video ${video.originalName} has been flagged: ${reason}. Please review.`
      );
    }

    console.log(`[Worker] Video ${videoId} flagged for review`);
  } catch (error) {
    console.error(`[Worker] Error flagging video ${videoId}:`, error);
    throw error;
  }
}