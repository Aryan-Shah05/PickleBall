import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { CourtStatus } from '@prisma/client';

export const courtController = {
  getAllCourts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courts = await prisma.court.findMany();
      res.json({
        status: 'success',
        data: courts,
      });
    } catch (error) {
      next(error);
    }
  },

  getAvailableCourts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courts = await prisma.court.findMany({
        where: {
          status: CourtStatus.AVAILABLE
        },
        orderBy: {
          name: 'asc'
        }
      });

      res.json(courts);
    } catch (error) {
      next(error);
    }
  },

  getCourtById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError(400, 'Court ID is required', 'INVALID_INPUT');
      }

      const court = await prisma.court.findUnique({
        where: { id }
      });

      if (!court) {
        throw new AppError(404, 'Court not found', 'COURT_NOT_FOUND');
      }

      res.json({
        status: 'success',
        data: court,
      });
    } catch (error) {
      next(error);
    }
  },

  createCourt: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, type, isIndoor, hourlyRate, peakHourRate, maintenanceSchedule } = req.body;

      // Validate required fields
      if (!name || !type || typeof isIndoor !== 'boolean' || !hourlyRate) {
        throw new AppError(400, 'Missing required fields', 'INVALID_INPUT');
      }

      const existingCourt = await prisma.court.findFirst({
        where: { name }
      });

      if (existingCourt) {
        throw new AppError(409, 'Court with this name already exists', 'DUPLICATE_COURT');
      }

      const court = await prisma.court.create({
        data: {
          name,
          type,
          isIndoor,
          status: CourtStatus.AVAILABLE,
          hourlyRate: Number(hourlyRate),
          peakHourRate: peakHourRate ? Number(peakHourRate) : Number(hourlyRate) * 1.5,
          maintenanceSchedule: maintenanceSchedule || null
        }
      });

      res.status(201).json({
        status: 'success',
        data: court,
      });
    } catch (error) {
      next(error);
    }
  },

  updateCourt: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, type, isIndoor, status, hourlyRate, peakHourRate, maintenanceSchedule } = req.body;

      if (!id) {
        throw new AppError(400, 'Court ID is required', 'INVALID_INPUT');
      }

      const existingCourt = await prisma.court.findUnique({
        where: { id }
      });

      if (!existingCourt) {
        throw new AppError(404, 'Court not found', 'COURT_NOT_FOUND');
      }

      const court = await prisma.court.update({
        where: { id },
        data: {
          name,
          type,
          isIndoor,
          status: status ? CourtStatus[status as keyof typeof CourtStatus] : undefined,
          hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
          peakHourRate: peakHourRate ? Number(peakHourRate) : undefined,
          maintenanceSchedule
        }
      });

      res.json({
        status: 'success',
        data: court,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteCourt: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError(400, 'Court ID is required', 'INVALID_INPUT');
      }

      const existingCourt = await prisma.court.findUnique({
        where: { id }
      });

      if (!existingCourt) {
        throw new AppError(404, 'Court not found', 'COURT_NOT_FOUND');
      }

      await prisma.court.delete({
        where: { id }
      });

      res.json({
        status: 'success',
        message: 'Court deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}; 