import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { BookingStatus, PaymentStatus } from '@prisma/client';
import { isAdmin } from '../middleware/auth';

export const bookingController = {
  getMyBookings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const bookings = await prisma.booking.findMany({
        where: { userId },
        include: {
          court: true,
          payment: true,
        },
      });

      res.json({
        status: 'success',
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllBookings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookings = await prisma.booking.findMany({
        include: {
          court: true,
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          payment: true,
        },
      });

      res.json({
        status: 'success',
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  },

  getBookingById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
          court: true,
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          payment: true,
        },
      });

      if (!booking) {
        throw new AppError(404, 'Booking not found', 'BOOKING_NOT_FOUND');
      }

      // Check if user is authorized to view this booking
      if (req.user?.role !== 'ADMIN' && booking.userId !== req.user?.id) {
        throw new AppError(403, 'Not authorized to view this booking', 'FORBIDDEN');
      }

      res.json({
        status: 'success',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  },

  createBooking: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courtId, startTime, endTime } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError(401, 'User not authenticated', 'UNAUTHORIZED');
      }

      // Validate input
      if (!courtId || !startTime || !endTime) {
        throw new AppError(400, 'Missing required fields', 'INVALID_INPUT');
      }

      // Check if the booking time is valid
      const bookingStart = new Date(startTime);
      const bookingEnd = new Date(endTime);

      if (bookingStart >= bookingEnd) {
        throw new AppError(400, 'Invalid booking time range', 'INVALID_TIME_RANGE');
      }

      if (bookingStart < new Date()) {
        throw new AppError(400, 'Cannot book in the past', 'INVALID_TIME');
      }

      // Check for existing bookings in the time slot
      const existingBooking = await prisma.booking.findFirst({
        where: {
          courtId,
          status: BookingStatus.CONFIRMED,
          OR: [
            {
              AND: [
                { startTime: { lte: bookingStart } },
                { endTime: { gt: bookingStart } },
              ],
            },
            {
              AND: [
                { startTime: { lt: bookingEnd } },
                { endTime: { gte: bookingEnd } },
              ],
            },
          ],
        },
      });

      if (existingBooking) {
        throw new AppError(409, 'Time slot is already booked', 'SLOT_UNAVAILABLE');
      }

      // Get court details
      const court = await prisma.court.findUnique({
        where: { id: courtId },
      });

      if (!court) {
        throw new AppError(404, 'Court not found', 'COURT_NOT_FOUND');
      }

      // Calculate booking duration and amount
      const hours = Math.ceil(
        (bookingEnd.getTime() - bookingStart.getTime()) / (1000 * 60 * 60)
      );
      const totalAmount = hours * court.hourlyRate;

      // Create booking
      const booking = await prisma.booking.create({
        data: {
          courtId,
          userId,
          startTime: bookingStart,
          endTime: bookingEnd,
          status: BookingStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PENDING,
          totalAmount,
        },
        include: {
          court: true,
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  },

  updateBooking: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.id;

      const booking = await prisma.booking.findUnique({
        where: { id },
      });

      if (!booking) {
        throw new AppError(404, 'Booking not found', 'BOOKING_NOT_FOUND');
      }

      // Check if user is authorized to update this booking
      if (req.user?.role !== 'ADMIN' && booking.userId !== userId) {
        throw new AppError(
          403,
          'Not authorized to update this booking',
          'FORBIDDEN'
        );
      }

      const updatedBooking = await prisma.booking.update({
        where: { id },
        data: { status },
        include: {
          court: true,
        },
      });

      res.json({
        status: 'success',
        data: updatedBooking,
      });
    } catch (error) {
      next(error);
    }
  },

  cancelBooking: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const booking = await prisma.booking.findUnique({
        where: { id },
      });

      if (!booking) {
        throw new AppError(404, 'Booking not found', 'BOOKING_NOT_FOUND');
      }

      // Check if user is authorized to cancel this booking
      if (req.user?.role !== 'ADMIN' && booking.userId !== userId) {
        throw new AppError(
          403,
          'Not authorized to cancel this booking',
          'FORBIDDEN'
        );
      }

      const cancelledBooking = await prisma.booking.update({
        where: { id },
        data: {
          status: BookingStatus.CANCELLED,
        },
        include: {
          court: true,
        },
      });

      res.json({
        status: 'success',
        data: cancelledBooking,
      });
    } catch (error) {
      next(error);
    }
  },

  clearAllBookings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isAdmin(req)) {
        throw new AppError(403, 'Admin access required', 'FORBIDDEN');
      }

      await prisma.booking.deleteMany({});

      res.status(200).json({
        success: true,
        message: 'All bookings have been cleared successfully'
      });
    } catch (error) {
      next(error);
    }
  },
}; 