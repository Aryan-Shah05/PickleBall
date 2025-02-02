import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { validateRequest } from '../middleware/validateRequest';
import { protect, authorize } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Public routes

// Protected routes
router.use(protect);

// Current user routes
router.get('/me', userController.getProfile);
router.patch('/me', userController.updateProfile);
router.patch('/me/membership', userController.updateMembership);

// Admin only routes
router.use(authorize('ADMIN'));

// Get all users
router.get('/', userController.getProfile);

// Get user by ID
router.get('/:id', userController.getProfile);

// Update user
router.patch('/:id', userController.updateProfile);

// Delete user
router.delete('/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

export default router; 