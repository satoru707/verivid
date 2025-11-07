-- CreateUser
CREATE TABLE "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "wallet" TEXT NOT NULL UNIQUE,
  "username" TEXT,
  "email" TEXT UNIQUE,
  "bio" TEXT,
  "avatarUrl" TEXT,
  "recoveryToken" TEXT UNIQUE,
  "recoveryTokenExpiry" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- CreateVideo
CREATE TABLE "Video" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "uploaderId" TEXT NOT NULL,
  "originalName" TEXT NOT NULL,
  "sha256" TEXT NOT NULL UNIQUE,
  "storageUrl" TEXT NOT NULL,
  "ipfsCid" TEXT,
  "verified" BOOLEAN NOT NULL DEFAULT false,
  "verifiedAt" TIMESTAMP,
  "verifiedBy" TEXT,
  "durationSec" INTEGER,
  "width" INTEGER,
  "height" INTEGER,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- CreateVerification
CREATE TABLE "Verification" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "videoId" TEXT NOT NULL,
  "txHash" TEXT NOT NULL,
  "proofHash" TEXT NOT NULL,
  "signer" TEXT NOT NULL,
  "metadataUri" TEXT,
  "chain" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE
);

-- CreateNonce
CREATE TABLE "Nonce" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "wallet" TEXT NOT NULL UNIQUE,
  "nonce" TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndexes
CREATE INDEX "Video_uploaderId_idx" ON "Video"("uploaderId");
CREATE INDEX "Video_verified_idx" ON "Video"("verified");
CREATE INDEX "Verification_videoId_idx" ON "Verification"("videoId");
CREATE INDEX "Verification_proofHash_idx" ON "Verification"("proofHash");
