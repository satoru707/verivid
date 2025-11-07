import { PrismaClient } from "@prisma/client"
import { BlockchainService } from "./blockchain.service"

export class VerificationService {
  private prisma: PrismaClient
  private blockchainService: BlockchainService

  constructor() {
    this.prisma = new PrismaClient()
    this.blockchainService = new BlockchainService()
  }

  // Generate proof hash from video SHA256
  generateProofHash(sha256: string): string {
    // In production: use keccak256 for Solidity compatibility
    // For now: return formatted SHA256
    return `0x${sha256}`
  }

  // Verify video authenticity against blockchain
  async verifyVideoAuthenticity(videoId: string): Promise<boolean> {
    try {
      const video = await this.prisma.video.findUnique({
        where: { id: videoId },
      })

      if (!video) return false

      const proofHash = this.generateProofHash(video.sha256)
      const isRegistered = await this.blockchainService.isProofRegistered(proofHash)

      return isRegistered
    } catch {
      return false
    }
  }

  // Create verification audit log
  async logVerification(videoId: string, wallet: string, txHash: string): Promise<void> {
    await this.prisma.verification.create({
      data: {
        videoId,
        txHash,
        signer: wallet,
        proofHash: "", // Update with actual hash
        chain: "ethereum:1",
      },
    })
  }

  // Check for duplicate videos by hash
  async checkDuplicate(sha256: string): Promise<{ exists: boolean; videoId?: string }> {
    const video = await this.prisma.video.findUnique({
      where: { sha256 },
    })

    return {
      exists: !!video,
      videoId: video?.id,
    }
  }

  // Batch verify videos
  async batchVerify(videoIds: string[]): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {}

    for (const videoId of videoIds) {
      results[videoId] = await this.verifyVideoAuthenticity(videoId)
    }

    return results
  }
}
