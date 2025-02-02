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

const prismaClient = new PrismaClient();

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
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
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

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
        },
      });

      // Generate token
      const token = generateToken(user.id);

      res.status(201).json({
        status: 'success',
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // For development, check against default users
      const adminUser = DEFAULT_USERS.admin;
      const memberUser = DEFAULT_USERS.member;

      let user;
      if (email === adminUser.email && password === adminUser.password) {
        user = adminUser;
      } else if (email === memberUser.email && password === memberUser.password) {
        user = memberUser;
      }

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '1d' }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
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
        throw new AppError(400, 'Token is required', 'TOKEN_REQUIRED');
      }

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { userId: string };

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          membershipLevel: true,
          isActive: true,
        },
      });

      if (!user || !user.isActive) {
        throw new AppError(401, 'Invalid token', 'INVALID_TOKEN');
      }

      // Generate new token
      const newToken = generateToken(user.id);

      res.json({
        status: 'success',
        data: {
          user,
          token: newToken,
        },
      });
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