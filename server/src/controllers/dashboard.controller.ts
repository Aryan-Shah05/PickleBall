import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { BookingStatus } from '@prisma/client';
import { startOfDay, endOfDay } from 'date-fns';
import { AppError } from '../middleware/errorHandler';

export const dashboardController = {
  getDashboardData: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(401, 'Unauthorized', 'UNAUTHORIZED');
      }

      // Get all courts
      const courts = await prisma.court.findMany();

      // Get current bookings
      const now = new Date();
      const currentBookings = await prisma.booking.findMany({
        where: {
          status: BookingStatus.CONFIRMED,
          startTime: {
            gte: startOfDay(now),
            lte: endOfDay(now),
          },
        },
        include: {
          court: true,
        },
      });

      // Calculate available courts
      const bookedCourtIds = new Set(currentBookings.map(booking => booking.courtId));
      const availableCourts = courts.filter(court => !bookedCourtIds.has(court.id));

      // Get user's upcoming bookings
      const upcomingBookings = await prisma.booking.findMany({
        where: {
          userId,
          status: BookingStatus.CONFIRMED,
          startTime: {
            gte: now,
          },
        },
        include: {
          court: true,
        },
        orderBy: {
          startTime: 'asc',
        },
        take: 5,
      });

      // Get statistics
      const totalBookings = await prisma.booking.count({
        where: {
          userId,
          status: BookingStatus.CONFIRMED,
        },
      });

      const cancelledBookings = await prisma.booking.count({
        where: {
          userId,
          status: BookingStatus.CANCELLED,
        },
      });

      const totalSpent = await prisma.booking.aggregate({
        where: {
          userId,
          status: BookingStatus.CONFIRMED,
        },
        _sum: {
          totalAmount: true,
        },
      });

      res.json({
        success: true,
        data: {
          statistics: {
            totalBookings,
            cancelledBookings,
            totalSpent: totalSpent._sum.totalAmount || 0,
            availableCourts: availableCourts.length,
            totalCourts: courts.length,
          },
          upcomingBookings,
          courts: {
            all: courts,
            available: availableCourts,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },
}; 