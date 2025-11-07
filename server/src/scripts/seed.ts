import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const user = await prisma.user.create({
    data: {
      wallet: '0x1234567890123456789012345678901234567890',
      username: 'testuser',
      email: 'test@example.com',
      bio: 'Test user for VeriVid',
    },
  });

  console.log('Created test user:', user);

  const video = await prisma.video.create({
    data: {
      uploaderId: user.id,
      originalName: 'test-video.mp4',
      storageUrl: 'https://example.com/test-video.mp4',
      sha256: 'a'.repeat(64),
      durationSec: 300,
      width: 1920,
      height: 1080,
    },
  });

  console.log('Created test video:', video);
  console.log('Seeding completed!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
