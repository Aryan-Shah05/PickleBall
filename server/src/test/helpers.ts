import { prisma } from '../lib/prisma';
import { User, Court, Booking } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

export const createTestUser = async (
  overrides: Partial<User> = {}
): Promise<User> => {
  const password = await bcrypt.hash('Password123', 10);
  return prisma.user.create({
    data: {
      email: `test-${Date.now()}@example.com`,
      password,
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.MEMBER,
      isActive: true,
      ...overrides,
    },
  });
};

export const createTestCourt = async (
  overrides: Partial<Court> = {}
): Promise<Court> => {
  return prisma.court.create({
    data: {
      name: `Court ${Date.now()}`,
      type: 'Standard',
      isIndoor: false,
      hourlyRate: 25,
      peakHourRate: 35,
      ...overrides,
    },
  });
};

export const createTestBooking = async (
  userId: string,
  courtId: string,
  overrides: Partial<Booking> = {}
): Promise<Booking> => {
  return prisma.booking.create({
    data: {
      userId,
      courtId,
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000), // 1 hour later
      totalAmount: 25,
      ...overrides,
    },
  });
};

export const generateTestToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '1h',
  });
};

export const clearDatabase = async (): Promise<void> => {
  const tables = ['Payment', 'Booking', 'Court', 'User'];
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${table}";`);
  }
}; 