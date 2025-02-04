import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import {
  RegisterInput,
  LoginInput,
  ResetPasswordInput,
  ForgotPasswordInput,
} from '../schemas/auth.schema';
import { PrismaClient, UserRole, MembershipLevel } from '@prisma/client';

const prismaClient = new PrismaClient();

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError(500, 'JWT secret not configured', 'SERVER_ERROR');
  }
  const options: SignOptions = {
    expiresIn: 24 * 60 * 60 // 1 day in seconds
  };
  return jwt.sign({ userId }, secret, options);
};

// Default users for development
const DEFAULT_USERS = {
  admin: {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
  },
  member: {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    firstName: 'Regular',
    lastName: 'User',
    role: 'MEMBER',
  },
};

export const authController = {
  register: async (req: Request<unknown, unknown, RegisterInput>, res: Response, next: NextFunction) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new AppError(409, 'User already exists', 'USER_EXISTS');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: UserRole.MEMBER,
          membershipLevel: MembershipLevel.BASIC,
          isActive: true
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          membershipLevel: true,
          createdAt: true,
        },
      });

      // Generate token
      const token = generateToken(user.id);

      res.status(201).json({
        status: 'success',
        data: { user, token },
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req: Request<unknown, unknown, LoginInput>, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          firstName: true,
          lastName: true,
          role: true,
          membershipLevel: true,
          isActive: true
        },
      });

      if (!user || !user.isActive) {
        throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      // Generate token
      const token = generateToken(user.id);

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      res.status(200).json({
        status: 'success',
        data: { user: userWithoutPassword, token },
      });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req: Request, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  },

  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;

      if (!token) {
        throw new AppError(401, 'No token provided', 'INVALID_TOKEN');
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new AppError(500, 'JWT secret not configured', 'SERVER_ERROR');
      }

      try {
        const decoded = jwt.verify(token, secret) as { userId: string };
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            membershipLevel: true,
            isActive: true
          },
        });

        if (!user || !user.isActive) {
          throw new AppError(401, 'Invalid token', 'INVALID_TOKEN');
        }

        const newToken = generateToken(user.id);

        res.status(200).json({
          status: 'success',
          data: { user, token: newToken },
        });
      } catch (error) {
        throw new AppError(401, 'Invalid token', 'INVALID_TOKEN');
      }
    } catch (error) {
      next(error);
    }
  },

  forgotPassword: async (req: Request<unknown, unknown, ForgotPasswordInput>, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        throw new AppError(404, 'User not found', 'NOT_FOUND');
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '1h' }
      );

      // Store reset token in database
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken }
      });

      // In a real application, you would send an email here with the reset link
      // For now, we'll just return the token in the response
      res.json({
        message: 'Password reset instructions sent',
        resetToken // In production, remove this and send via email instead
      });
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (req: Request<unknown, unknown, ResetPasswordInput>, res: Response, next: NextFunction) => {
    try {
      const { token, password } = req.body;

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string };
      
      // Find user with matching reset token
      const user = await prisma.user.findFirst({
        where: {
          id: decoded.userId,
          resetToken: token
        }
      });

      if (!user) {
        throw new AppError(400, 'Invalid or expired reset token', 'INVALID_TOKEN');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update password and clear reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null
        }
      });

      res.json({ message: 'Password reset successful' });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        next(new AppError(400, 'Invalid or expired reset token', 'INVALID_TOKEN'));
      } else {
        next(error);
      }
    }
  },
}; 