import request from 'supertest';
import { app } from '../../index';
import { prisma } from '../../lib/prisma';
import {
  createTestUser,
  createTestCourt,
  createTestBooking,
  generateTestToken,
  clearDatabase,
} from '../../test/helpers';
import { Booking } from '@prisma/client';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';

// Define UserRole enum since it's not exported from @prisma/client
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

// Initialize prisma client
beforeAll(async () => {
  await prisma.$connect();
});

// Disconnect prisma after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

describe('Booking Controller', () => {
  let existingBooking: Booking;
  let booking1: Booking;
  let booking2: Booking;

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /api/v1/bookings', () => {
    it('should create a new booking for authenticated user', async () => {
      const user = await createTestUser();
      const court = await createTestCourt();
      const token = generateTestToken(user.id);

      const bookingData = {
        courtId: court.id,
        startTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        endTime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
      };

      const response = await request(app)
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.courtId).toBe(court.id);
      expect(response.body.data.userId).toBe(user.id);
      expect(response.body.data.status).toBe('PENDING');
      expect(response.body.data.paymentStatus).toBe('PENDING');
    });

    it('should not create booking for unavailable time slot', async () => {
      const user = await createTestUser();
      const court = await createTestCourt();
      const token = generateTestToken(user.id);

      // Create an existing booking
      existingBooking = await createTestBooking(user.id, court.id, {
        startTime: new Date(Date.now() + 3600000),
        endTime: new Date(Date.now() + 7200000),
      });

      // Try to book the same time slot
      const bookingData = {
        courtId: court.id,
        startTime: new Date(Date.now() + 3600000).toISOString(),
        endTime: new Date(Date.now() + 7200000).toISOString(),
      };

      const response = await request(app)
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('TIME_SLOT_UNAVAILABLE');
    });
  });

  describe('GET /api/v1/bookings', () => {
    it('should return user bookings for authenticated user', async () => {
      const user = await createTestUser();
      const court = await createTestCourt();
      const token = generateTestToken(user.id);

      booking1 = await createTestBooking(user.id, court.id);
      booking2 = await createTestBooking(user.id, court.id);

      const response = await request(app)
        .get('/api/v1/bookings')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].id).toBeDefined();
      expect(response.body.data[1].id).toBeDefined();
    });

    it('should return all bookings for admin', async () => {
      const admin = await createTestUser({ role: UserRole.ADMIN });
      const user = await createTestUser();
      const court = await createTestCourt();
      const token = generateTestToken(admin.id);

      booking1 = await createTestBooking(user.id, court.id);
      booking2 = await createTestBooking(admin.id, court.id);

      const response = await request(app)
        .get('/api/v1/bookings')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('POST /api/v1/bookings/:id/cancel', () => {
    it('should cancel user booking', async () => {
      const user = await createTestUser();
      const court = await createTestCourt();
      const token = generateTestToken(user.id);
      const booking = await createTestBooking(user.id, court.id);

      const response = await request(app)
        .post(`/api/v1/bookings/${booking.id}/cancel`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.status).toBe('CANCELLED');
    });

    it('should not allow canceling other user booking', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const court = await createTestCourt();
      const token = generateTestToken(user2.id);
      const booking = await createTestBooking(user1.id, court.id);

      const response = await request(app)
        .post(`/api/v1/bookings/${booking.id}/cancel`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('FORBIDDEN');
    });
  });
}); 