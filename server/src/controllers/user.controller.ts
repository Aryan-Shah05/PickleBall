import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export const userController = {
  getProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          membershipLevel: true,
          createdAt: true,
          lastLogin: true
        }
      });

      if (!user) {
        throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
      }

      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName } = req.body;

      const user = await prisma.user.update({
        where: { id: req.user?.id },
        data: { firstName, lastName },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          membershipLevel: true,
          createdAt: true,
          lastLogin: true
        }
      });

      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  },

  updateMembership: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { membershipLevel } = req.body;

      const user = await prisma.user.update({
        where: { id: req.user?.id },
        data: { membershipLevel },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          membershipLevel: true,
          createdAt: true,
          lastLogin: true
        }
      });

      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }
}; 