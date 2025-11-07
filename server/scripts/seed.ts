import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.verification.deleteMany();
  await prisma.video.deleteMany();
  await prisma.user.deleteMany();
  await prisma.nonce.deleteMany();

  // Create test users
  const user1 = await prisma.user.create({
    data: {
      wallet: '0x742d35cc6634c0532925a3b844bc9e7595f42e1e',
      username: 'Test User 1',
      email: 'test1@verivid.com',
      bio: 'First test user',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      wallet: '0x8ba1f109551bd432803012645ac136ddd64dba72',
      username: 'Test User 2',
      email: 'test2@verivid.com',
      bio: 'Second test user',
    },
  });

  console.log('✅ Users created:', { user1, user2 });

  // Create test videos
  const video1 = await prisma.video.create({
    data: {
      uploaderId: user1.id,
      originalName: 'Sample Video 1',
      sha256: 'abc123def456',
      storageUrl: 's3://bucket/video1.mp4',
      ipfsCid: 'QmSampleCID1',
      durationSec: 120,
      width: 1920,
      height: 1080,
    },
  });

  const video2 = await prisma.video.create({
    data: {
      uploaderId: user2.id,
      originalName: 'Sample Video 2',
      sha256: 'xyz789uvw456',
      storageUrl: 's3://bucket/video2.mp4',
      ipfsCid: 'QmSampleCID2',
      verified: true,
      verifiedAt: new Date(),
      verifiedBy: '0x8ba1f109551bd432803012645ac136ddd64dba72',
      durationSec: 240,
      width: 1920,
      height: 1080,
    },
  });

  console.log('✅ Videos created:', { video1, video2 });

  // Create test verification
  const verification = await prisma.verification.create({
    data: {
      videoId: video2.id,
      txHash:
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      proofHash: 'xyz789uvw456',
      signer: '0x8ba1f109551bd432803012645ac136ddd64dba72',
      metadataUri: 'ipfs://QmMetadata123',
      chain: 'ethereum:11155111',
    },
  });

  console.log('✅ Verification created:', verification);
  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
