/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create sample users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      membershipLevel: 'PREMIUM'
    }
  });

  const memberUser = await prisma.user.create({
    data: {
      email: 'member@example.com',
      password: await bcrypt.hash('member123', 10),
      firstName: 'John',
      lastName: 'Doe',
      role: 'MEMBER',
      membershipLevel: 'BASIC'
    }
  });

  // Create sample courts
  const indoorCourt = await prisma.court.create({
    data: {
      name: 'Court A',
      type: 'INDOOR',
      isIndoor: true,
      status: 'AVAILABLE',
      hourlyRate: 25.00,
      peakHourRate: 35.00
    }
  });

  const outdoorCourt = await prisma.court.create({
    data: {
      name: 'Court B',
      type: 'OUTDOOR',
      isIndoor: false,
      status: 'AVAILABLE',
      hourlyRate: 20.00,
      peakHourRate: 30.00
    }
  });

  // Create sample booking
  const booking = await prisma.booking.create({
    data: {
      courtId: indoorCourt.id,
      userId: memberUser.id,
      startTime: new Date('2025-02-02T10:00:00Z'),
      endTime: new Date('2025-02-02T11:00:00Z'),
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      totalAmount: 25.00,
      payment: {
        create: {
          userId: memberUser.id,
          amount: 25.00,
          status: 'COMPLETED',
          paymentMethod: 'CREDIT_CARD',
          transactionId: 'test_transaction_123'
        }
      }
    }
  });

  console.log('Sample data created:');
  console.log('Users:', { adminUser, memberUser });
  console.log('Courts:', { indoorCourt, outdoorCourt });
  console.log('Booking:', booking);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 