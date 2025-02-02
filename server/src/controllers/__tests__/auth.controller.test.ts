/// <reference types="jest" />

import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../../index';
import { prisma } from '../../lib/prisma';
import { createTestUser, clearDatabase } from '../../test/helpers';

// Initialize prisma client
beforeAll(async () => {
  await prisma.$connect();
});

// Disconnect prisma after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

describe('Auth Controller', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should not register a user with existing email', async () => {
      const existingUser = await createTestUser();
      const userData = {
        email: existingUser.email,
        password: 'Password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

      expect(response.status).toBe(409);
      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('USER_EXISTS');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const password = 'Password123';
      const user = await createTestUser();
      
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: user.email,
          password,
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe(user.email);
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should not login with incorrect password', async () => {
      const user = await createTestUser();
      
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: user.email,
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('INVALID_CREDENTIALS');
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('POST /api/v1/auth/refresh-token', () => {
    it('should refresh token successfully', async () => {
      const user = await createTestUser();
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ token });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user).toBeDefined();
    });

    it('should not refresh invalid token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ token: 'invalid-token' });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('INVALID_TOKEN');
    });
  });
}); 