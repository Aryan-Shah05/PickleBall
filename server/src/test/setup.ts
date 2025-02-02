import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

export const prisma = new PrismaClient();
export type Context = {
  prisma: PrismaClient;
};

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>;
};

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  };
};

export const mockContext = createMockContext();

beforeEach(() => {
  mockReset(mockContext.prisma);
});

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