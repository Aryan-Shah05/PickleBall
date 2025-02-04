import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export const dashboardController = {
  getDashboardStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(401, 'Unauthorized', 'UNAUTHORIZED');
      }

      // Get total number of courts
      const totalCourts = await prisma.court.count();

      // Get available courts (not in maintenance and not reserved)
      const availableCourts = await prisma.court.count({
        where: {
          status: 'AVAILABLE'
        }
      });

      // Get user's total bookings
      const userBookings = await prisma.booking.count({
        where: {
          userId
        }
      });

      // Get upcoming bookings for the user
      const upcomingBookings = await prisma.booking.findMany({
        where: {
          userId,
          startTime: {
            gte: new Date()
          }
        },
        include: {
          court: true
        },
        orderBy: {
          startTime: 'asc'
        },
        take: 5
      });

      // Get available courts with details
      const availableCourtsDetails = await prisma.court.findMany({
        where: {
          status: 'AVAILABLE'
        },
        take: 5
      });

      res.json({
        stats: {
          totalCourts,
          availableCourts,
          userBookings
        },
        upcomingBookings,
        availableCourtsDetails
      });
    } catch (error) {
      next(error);
    }
  }
}; 