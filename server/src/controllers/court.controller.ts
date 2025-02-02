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

  getCourtById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const court = await prisma.court.findUnique({
        where: { id },
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
      const { name, type, isIndoor, hourlyRate, peakHourRate } = req.body;

      const court = await prisma.court.create({
        data: {
          name,
          type,
          isIndoor,
          status: CourtStatus.AVAILABLE,
          hourlyRate,
          peakHourRate,
        },
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
      const { name, type, isIndoor, status, hourlyRate, peakHourRate } = req.body;

      const court = await prisma.court.update({
        where: { id },
        data: {
          name,
          type,
          isIndoor,
          status,
          hourlyRate,
          peakHourRate,
        },
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
      await prisma.court.delete({
        where: { id },
      });

      res.json({
        status: 'success',
        message: 'Court deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
}; 