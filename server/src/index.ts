import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/errorHandler';
import { setupRoutes } from './routes';

// Load environment variables
config();

export const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 4000;
const apiPrefix = process.env.API_PREFIX || '/api/v1';

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

app.use(express.json());

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Setup API routes
setupRoutes(app, apiPrefix);

// Error handling middleware
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

export default app; 