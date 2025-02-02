import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { validateRequest } from '../middleware/validateRequest';
import { isAuthenticated, isAdmin } from '../middleware/auth';

const router = Router();

// Protected routes
router.use(isAuthenticated);

// Get current user
router.get('/me', userController.getCurrentUser);

// Update current user
router.patch('/me', userController.updateCurrentUser);

// Admin routes
router.use(isAdmin);

// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user
router.patch('/:id', userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

export default router; 