import { verifyMessage } from "ethers"

export function verifySigMessage(message: string, signature: string, wallet: string): boolean {
  try {
    const recovered = verifyMessage(message, signature)
    return recovered.toLowerCase() === wallet.toLowerCase()
  } catch {
    return false
  }
}

export function createNonceMessage(nonce: string): string {
  return `VeriVid sign-in nonce: ${nonce}`
}
