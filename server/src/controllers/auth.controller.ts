import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import type {
  RegisterInput,
  LoginInput,
  ResetPasswordInput,
  ForgotPasswordInput,
} from '../schemas/auth.schema';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prismaClient = new PrismaClient();

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ userId }, secret, {
    expiresIn: Number(process.env.JWT_EXPIRES_IN?.replace('d', '')) * 24 * 60 * 60 // Convert days to seconds
  });
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

const LoginInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authController = {
  register: async (
    req: Request<unknown, unknown, RegisterInput>,
    res: Response,
    next: NextFunction
  ) => {
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

      // Create token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );

      res.status(201).json({
        status: 'success',
        data: { user, token },
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = LoginInput.parse(req.body);

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
        },
      });

      if (!user) {
        throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      // Create token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );

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
    res.json({
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

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            membershipLevel: true,
          },
        });

        if (!user) {
          throw new AppError(401, 'Invalid token', 'INVALID_TOKEN');
        }

        const newToken = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '1d' }
        );

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

  forgotPassword: async (
    req: Request<unknown, unknown, ForgotPasswordInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Don't reveal whether a user exists
        res.json({
          status: 'success',
          message: 'If an account exists, a password reset email will be sent',
        });
        return;
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      // TODO: Send reset email
      logger.info(`Reset token for ${email}: ${resetToken}`);

      res.json({
        status: 'success',
        message: 'If an account exists, a password reset email will be sent',
      });
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (
    req: Request<unknown, unknown, ResetPasswordInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { token, password } = req.body;

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { userId: string };

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update password
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { password: hashedPassword },
      });

      res.json({
        status: 'success',
        message: 'Password reset successful',
      });
    } catch (error) {
      next(error);
    }
  },
}; 