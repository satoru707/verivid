# VeriVid - Video Proof & Authenticity Platform

A decentralized video verification platform built on blockchain. VeriVid allows users to upload videos, prove ownership via on-chain verification, and create immutable proof-of-authenticity records.

## Architecture

### Tech Stack

**Frontend:**
- React 19 + Vite
- TypeScript
- Tailwind CSS
- TanStack Router
- ethers.js / wagmi (Web3)

**Backend:**
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication

**Blockchain:**
- Solidity Smart Contracts
- Ethereum (mainnet or testnet)
- ethers.js for contract interaction

**Storage:**
- IPFS (Pinata/NFT.storage)
- AWS S3 (optional)

## Features

### Core Features

1. **Wallet Authentication**
   - Sign-in with Web3 wallet (MetaMask, etc.)
   - Non-custodial authentication via wallet signature
   - HTTP-only JWT cookies for session management

2. **Video Upload**
   - Direct-to-storage uploads (S3/IPFS)
   - SHA-256 hash verification
   - Duplicate detection
   - Metadata extraction

3. **On-Chain Verification**
   - Register video proof on blockchain
   - Immutable proof-of-ownership records
   - Transaction receipt verification
   - Multi-chain support ready

4. **User Profiles**
   - Editable profile information
   - Video library management
   - Verification history

5. **Moderation & Quality**
   - Duplicate detection
   - Flagging system
   - Background job processing

## Project Structure

\`\`\`
verivid/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── routes/         # Route definitions
│   │   ├── context/        # React context (wallet, auth)
│   │   └── services/       # API services
│   └── vite.config.ts
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── workers/        # Background jobs
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Utilities
│   │   └── main.ts         # Entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
│
└── README.md
\`\`\`

## Getting Started

### Quick Start

#### 1. Backend Setup

\`\`\`bash
cd server
pnpm install
cp .env.local .env  # Configure environment variables
pnpm run prisma:migrate
pnpm run dev
\`\`\`

#### 2. Frontend Setup

\`\`\`bash
cd client
pnpm install
pnpm run dev
\`\`\`

Visit `http://localhost:5173` to see the app.

### Full Setup Guide

See [server/SETUP.md](./server/SETUP.md) for detailed backend setup and deployment instructions.

## API Endpoints

### Authentication
\`\`\`
POST   /auth/nonce              Get signing nonce
POST   /auth/verify             Verify signature & get JWT
POST   /auth/logout             Clear session
POST   /auth/recover/request    Request account recovery
\`\`\`

### Videos
\`\`\`
GET    /api/videos              List user's videos
GET    /api/videos/:id          Get video details
POST   /api/videos/upload-init  Initialize upload
POST   /api/videos/:id/upload-complete  Complete upload
DELETE /api/videos/:id          Delete video
\`\`\`

### Verification
\`\`\`
POST   /api/verify/prepare-tx   Prepare verification transaction
POST   /api/verify/confirm-tx   Confirm verification
GET    /api/verify/:proofHash   Get verification details
GET    /api/videos/:id/verifications  Get video verifications
\`\`\`

### User Profile
\`\`\`
GET    /api/user/me             Get current user
POST   /api/user                Update profile
GET    /api/user/:wallet        Get public profile
\`\`\`

## Environment Variables

### Backend (.env)

\`\`\`
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=3001

CONTRACT_ADDRESS=0x...
CONTRACT_CHAIN_ID=1
RPC_URL=https://...

IPFS_GATEWAY=https://ipfs.io
IPFS_API_KEY=...

FRONTEND_URL=http://localhost:5173
\`\`\`

See [server/.env.local](./server/.env.local) for full list.

## Smart Contract

The `VideoProofRegistry` contract provides on-chain proof storage:

```solidity
// Register a video proof
function registerProof(bytes32 proofHash, string metadataUri)

// Check if proof exists
function isRegistered(bytes32 proofHash) returns (bool)

// Get proof details
function getProof(bytes32 proofHash) returns (Proof)
