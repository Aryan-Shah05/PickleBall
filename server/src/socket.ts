import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { prisma } from './lib/prisma';
import { logger } from './utils/logger';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const setupSocketHandlers = (io: Server) => {
  // Middleware for authentication
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        throw new Error('Authentication error');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, isActive: true },
      });

      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      socket.userId = user.id;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`User connected: ${socket.userId}`);

    // Join user's room for private updates
    socket.join(`user:${socket.userId}`);

    // Handle court subscriptions
    socket.on('court:subscribe', (courtId: string) => {
      socket.join(`court:${courtId}`);
      logger.debug(`User ${socket.userId} subscribed to court ${courtId}`);
    });

    socket.on('court:unsubscribe', (courtId: string) => {
      socket.leave(`court:${courtId}`);
      logger.debug(`User ${socket.userId} unsubscribed from court ${courtId}`);
    });

    // Handle booking subscriptions
    socket.on('booking:subscribe', (bookingId: string) => {
      socket.join(`booking:${bookingId}`);
      logger.debug(`User ${socket.userId} subscribed to booking ${bookingId}`);
    });

    socket.on('booking:unsubscribe', (bookingId: string) => {
      socket.leave(`booking:${bookingId}`);
      logger.debug(`User ${socket.userId} unsubscribed from booking ${bookingId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.userId}`);
    });
  });

  // Utility functions for emitting events
  return {
    emitCourtUpdate: (courtId: string, data: unknown) => {
      io.to(`court:${courtId}`).emit('court:update', data);
    },

    emitBookingUpdate: (bookingId: string, data: unknown) => {
      io.to(`booking:${bookingId}`).emit('booking:update', data);
    },

    emitUserNotification: (userId: string, type: string, data: unknown) => {
      io.to(`user:${userId}`).emit('notification', { type, data });
    },
  };
}; 