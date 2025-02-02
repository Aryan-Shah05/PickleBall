import { PrismaClient } from '@prisma/client';
import { prisma } from '../lib/prisma';

beforeAll(async () => {
  // Clean up database before tests
  const tables = ['Payment', 'Booking', 'Court', 'User'];
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${table}";`);
  }
});

afterAll(async () => {
  // Clean up and disconnect Prisma after tests
  await prisma.$disconnect();
}); 