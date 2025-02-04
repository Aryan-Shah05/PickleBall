import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { protect } from '../middleware/auth';

const router = Router();

// Protect all dashboard routes
router.use(protect);

// Get dashboard data
router.get('/', dashboardController.getDashboardData);

export default router; 