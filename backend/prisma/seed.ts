import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding local dev user...');

  const devUser = await prisma.user.upsert({
    where: { clerkId: 'dev_user_clerk_id' },
    update: {},
    create: {
      id: 'dev_user_1',
      clerkId: 'dev_user_clerk_id',
      email: 'dev@yourpilot.local',
      name: 'Dev User',
      identityStage: 'EXPLORER',
      xp: 0,
      streakDays: 0,
    },
  });

  console.log('Dev user seeded:', devUser);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
