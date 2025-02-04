import { Express } from 'express';
import authRoutes from './auth.routes';
import courtRoutes from './court.routes';
import bookingRoutes from './booking.routes';
import paymentRoutes from './payment.routes';
import userRoutes from './user.routes';
import dashboardRoutes from './dashboard.routes';

export const setupRoutes = (app: Express, apiPrefix: string) => {
  app.use(`${apiPrefix}/auth`, authRoutes);
  app.use(`${apiPrefix}/courts`, courtRoutes);
  app.use(`${apiPrefix}/bookings`, bookingRoutes);
  app.use(`${apiPrefix}/payments`, paymentRoutes);
  app.use(`${apiPrefix}/users`, userRoutes);
  app.use(`${apiPrefix}/dashboard`, dashboardRoutes);
}; 