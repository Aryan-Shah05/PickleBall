import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { protect } from '../middleware/auth';

const router = Router();

// Protected routes
router.use(protect);

// Get dashboard stats
router.get('/stats', dashboardController.getDashboardStats);

export default router; 