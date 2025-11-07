# VeriVid Backend Setup Guide

## Prerequisites

- Node.js 18+ and npm/pnpm
- PostgreSQL 12+
- Redis (optional, for job queue)
- Git

## Installation

### 1. Install Dependencies

\`\`\`bash
cd server
pnpm install
\`\`\`

### 2. Configure Environment Variables

\`\`\`bash
cp .env.local .env
# Edit .env with your configuration
\`\`\`

### 3. Setup Database

Create a PostgreSQL database:

\`\`\`bash
createdb verivid_dev
\`\`\`

Run Prisma migrations:

\`\`\`bash
pnpm run prisma:migrate
\`\`\`

Generate Prisma client:

\`\`\`bash
pnpm run prisma:generate
\`\`\`

(Optional) Seed with test data:

\`\`\`bash
pnpm run seed
\`\`\`

### 4. Deploy Smart Contract

Before running the backend, deploy the VideoProofRegistry contract to your target network:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VideoProofRegistry {
    struct Proof {
        address signer;
        uint256 timestamp;
        string metadataUri;
    }

    mapping(bytes32 => Proof) public proofs;

    event ProofRegistered(
        bytes32 indexed proofHash,
        address indexed signer,
        string metadataUri,
        uint256 timestamp
    );

    function registerProof(bytes32 proofHash, string calldata metadataUri)
        external
    {
        require(proofs[proofHash].timestamp == 0, "Proof already exists");
        proofs[proofHash] = Proof({
            signer: msg.sender,
            timestamp: block.timestamp,
            metadataUri: metadataUri
        });
        emit ProofRegistered(proofHash, msg.sender, metadataUri, block.timestamp);
    }

    function isRegistered(bytes32 proofHash) external view returns (bool) {
        return proofs[proofHash].timestamp != 0;
    }

    function getProof(bytes32 proofHash)
        external
        view
        returns (Proof memory)
    {
        return proofs[proofHash];
    }
}
