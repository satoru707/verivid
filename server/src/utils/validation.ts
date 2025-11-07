import { z } from "zod"

export const walletSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address")

export const emailSchema = z.string().email("Invalid email")

export const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/, "Invalid SHA256 hash")

export const signatureSchema = z.string().startsWith("0x", "Invalid signature format")

export const uploadInitSchema = z.object({
  filename: z.string().min(1),
  size: z.number().positive(),
  sha256: sha256Schema,
})

export const userUpdateSchema = z.object({
  username: z.string().min(1).optional(),
  email: emailSchema.optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional(),
})
