import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { AppError } from './errorHandler';
import { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'Not authorized', 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError(500, 'JWT secret not configured', 'SERVER_ERROR');
    }

    const decoded = jwt.verify(token, secret) as { userId: string };

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      throw new AppError(401, 'Not authorized', 'UNAUTHORIZED');
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    next(new AppError(401, 'Not authorized', 'UNAUTHORIZED'));
  }
};

export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(403, 'Not authorized to access this route', 'FORBIDDEN')
      );
    }
    next();
  };
};

export const isAdmin = (req: Request): boolean => {
  return req.user?.role === 'ADMIN';
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'Not authorized to access this route', 'UNAUTHORIZED');
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        403,
        'Not authorized to access this route',
        'FORBIDDEN'
      );
    }

    next();
  };
}; 