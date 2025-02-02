import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { BookingStatus, PaymentStatus } from '@prisma/client';

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

      // Check for existing bookings in the time slot
      const existingBooking = await prisma.booking.findFirst({
        where: {
          courtId,
          status: BookingStatus.CONFIRMED,
          OR: [
            {
              AND: [
                { startTime: { lte: new Date(startTime) } },
                { endTime: { gt: new Date(startTime) } },
              ],
            },
            {
              AND: [
                { startTime: { lt: new Date(endTime) } },
                { endTime: { gte: new Date(endTime) } },
              ],
            },
          ],
        },
      });

      if (existingBooking) {
        throw new AppError(400, 'Time slot is already booked', 'SLOT_UNAVAILABLE');
      }

      // Calculate total amount
      const court = await prisma.court.findUnique({
        where: { id: courtId },
      });

      if (!court) {
        throw new AppError(404, 'Court not found', 'COURT_NOT_FOUND');
      }

      const hours = Math.ceil(
        (new Date(endTime).getTime() - new Date(startTime).getTime()) /
          (1000 * 60 * 60)
      );
      const totalAmount = hours * court.hourlyRate;

      // Create booking
      const booking = await prisma.booking.create({
        data: {
          courtId,
          userId: userId!,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          status: BookingStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          totalAmount,
        },
        include: {
          court: true,
        },
      });

      res.status(201).json({
        status: 'success',
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
}; 