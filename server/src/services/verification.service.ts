import { PrismaClient } from '@prisma/client';
import { BlockchainService } from './blockchain.service.js';
import { ethers } from 'ethers';

export class VerificationService {
  private prisma: PrismaClient;
  private blockchainService: BlockchainService;

  constructor() {
    this.prisma = new PrismaClient();
    this.blockchainService = new BlockchainService();
  }

  generateProofHash(sha256: string): string {
    return ethers.keccak256(ethers.toUtf8Bytes(sha256));
  }

  async verifyVideoAuthenticity(videoId: string): Promise<boolean> {
    try {
      const video = await this.prisma.video.findUnique({
        where: { id: videoId },
      });

      if (!video) return false;

      const proofHash = this.generateProofHash(video.sha256);
      const isRegistered =
        await this.blockchainService.isProofRegistered(proofHash);

      return isRegistered;
    } catch (error) {
      console.error('Error verifying video authenticity:', error);
      return false;
    }
  }

  async logVerification(
    videoId: string,
    wallet: string,
    txHash: string,
    metadataUri: string
  ): Promise<void> {
    const video = await this.prisma.video.findUnique({
      where: { id: videoId },
    });
    if (!video) {
      throw new Error(`Video ${videoId} not found`);
    }
    const proofHash = this.generateProofHash(video.sha256);
    await this.prisma.verification.create({
      data: {
        videoId,
        txHash,
        signer: wallet,
        proofHash,
        chain: 'ethereum:1',
        metadataUri,
      },
    });
  }

  async checkDuplicate(
    sha256: string
  ): Promise<{ exists: boolean; videoId?: string }> {
    const video = await this.prisma.video.findUnique({
      where: { sha256 },
    });

    return {
      exists: !!video,
      videoId: video?.id,
    };
  }

  async batchVerify(videoIds: string[]): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    for (const videoId of videoIds) {
      results[videoId] = await this.verifyVideoAuthenticity(videoId);
    }

    return results;
  }
}