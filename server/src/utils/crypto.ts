import crypto from "crypto"

export function generateRandomNonce(length = 32): string {
  return crypto.randomBytes(length).toString("hex")
}

export function sha256Hash(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex")
}

export function generateToken(length = 32): string {
  return crypto.randomBytes(length).toString("base64url")
}
