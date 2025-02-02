import request from 'supertest';
import { app } from '../../index';
import { createTestUser, createTestCourt, generateTestToken, clearDatabase, UserRole } from '../../test/helpers';

describe('Court Controller', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('GET /api/v1/courts', () => {
    it('should return all courts', async () => {
      await createTestCourt();
      await createTestCourt();

      const response = await request(app).get('/api/v1/courts');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].id).toBeDefined();
      expect(response.body.data[1].id).toBeDefined();
    });

    it('should filter courts by availability', async () => {
      const availableCourt = await createTestCourt();
      await createTestCourt({
        status: 'MAINTENANCE',
      });

      const response = await request(app)
        .get('/api/v1/courts')
        .query({ status: 'AVAILABLE' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].id).toBe(availableCourt.id);
    });
  });

  describe('POST /api/v1/courts', () => {
    it('should create a new court when admin', async () => {
      const admin = await createTestUser({ role: UserRole.ADMIN });
      const token = generateTestToken(admin.id);

      const courtData = {
        name: 'New Court',
        type: 'Premium',
        isIndoor: true,
        hourlyRate: 30,
        peakHourRate: 45,
      };

      const response = await request(app)
        .post('/api/v1/courts')
        .set('Authorization', `Bearer ${token}`)
        .send(courtData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.name).toBe(courtData.name);
      expect(response.body.data.type).toBe(courtData.type);
      expect(response.body.data.isIndoor).toBe(courtData.isIndoor);
      expect(response.body.data.hourlyRate).toBe(courtData.hourlyRate);
      expect(response.body.data.peakHourRate).toBe(courtData.peakHourRate);
    });

    it('should not allow non-admin to create court', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user.id);

      const courtData = {
        name: 'New Court',
        type: 'Premium',
        isIndoor: true,
        hourlyRate: 30,
        peakHourRate: 45,
      };

      const response = await request(app)
        .post('/api/v1/courts')
        .set('Authorization', `Bearer ${token}`)
        .send(courtData);

      expect(response.status).toBe(403);
      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('FORBIDDEN');
    });
  });

  describe('GET /api/v1/courts/:id', () => {
    it('should return court by id', async () => {
      const court = await createTestCourt();

      const response = await request(app).get(`/api/v1/courts/${court.id}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.id).toBe(court.id);
      expect(response.body.data.name).toBe(court.name);
    });

    it('should return 404 for non-existent court', async () => {
      const response = await request(app).get('/api/v1/courts/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('NOT_FOUND');
    });
  });

  describe('PUT /api/v1/courts/:id', () => {
    it('should update court when admin', async () => {
      const admin = await createTestUser({ role: UserRole.ADMIN });
      const token = generateTestToken(admin.id);
      const court = await createTestCourt();

      const updateData = {
        name: 'Updated Court',
        hourlyRate: 40,
      };

      const response = await request(app)
        .put(`/api/v1/courts/${court.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.hourlyRate).toBe(updateData.hourlyRate);
    });

    it('should not allow non-admin to update court', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user.id);
      const court = await createTestCourt();

      const updateData = {
        name: 'Updated Court',
        hourlyRate: 40,
      };

      const response = await request(app)
        .put(`/api/v1/courts/${court.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(403);
      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('FORBIDDEN');
    });
  });
}); 