import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { prisma } from './lib/prisma';
import { logger } from './utils/logger';
import { Court, Booking } from '@prisma/client';

export enum NotificationType {
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  COURT_MAINTENANCE = 'COURT_MAINTENANCE',
  COURT_AVAILABLE = 'COURT_AVAILABLE',
  SYSTEM = 'SYSTEM'
}

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

interface SocketService {
  emitCourtUpdate: (courtId: string, data: Partial<Court>) => void;
  emitBookingUpdate: (bookingId: string, data: Partial<Booking>) => void;
  emitUserNotification: (userId: string, type: NotificationType, data: Record<string, unknown>) => void;
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
    emitCourtUpdate: (courtId: string, data: Partial<Court>) => {
      io.to(`court:${courtId}`).emit('court:update', data);
    },

    emitBookingUpdate: (bookingId: string, data: Partial<Booking>) => {
      io.to(`booking:${bookingId}`).emit('booking:update', data);
    },

    emitUserNotification: (userId: string, type: NotificationType, data: Record<string, unknown>) => {
      io.to(`user:${userId}`).emit('notification', { type, data });
    },
  };
}; 