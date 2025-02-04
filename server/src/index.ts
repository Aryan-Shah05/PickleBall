import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/errorHandler';
import { setupRoutes } from './routes';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
    }
  }
}

// Load environment variables
config();

export const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 4000;
const apiPrefix = process.env.API_PREFIX || '/api/v1';

// CORS configuration
const corsOrigin = process.env.CORS_ORIGIN || 'https://visionary-daffodil-37862c.netlify.app';

const corsOptions = {
  origin: corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache preflight requests for 10 minutes
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Test route at API prefix level
app.get(apiPrefix, (req, res) => {
  res.json({
    status: 'success',
    message: 'API is accessible',
    prefix: apiPrefix,
    timestamp: new Date().toISOString()
  });
});

// Setup API routes
setupRoutes(app, apiPrefix);

// Error handling middleware
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`API prefix: ${apiPrefix}`);
    console.log(`CORS origin: ${corsOrigin}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });

  // Handle server errors
  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    switch (error.code) {
      case 'EACCES':
        console.error(`Port ${port} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`Port ${port} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

export default app; 