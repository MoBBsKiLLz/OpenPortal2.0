import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roles = [
    'System Admin',
    'Account Manager',
    'Regional Manager',
    'Facility Manager',
  ];

  for (const roleName of roles) {
    await prisma.roles.upsert({
      where: { role_name: roleName },
      update: {},
      create: { role_name: roleName },
    });
  }

  console.log('✅ Roles seeded!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
