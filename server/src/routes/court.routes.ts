import { Router } from 'express';
import { courtController } from '../controllers/court.controller';
import { validateRequest } from '../middleware/validateRequest';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

// Get all courts
router.get('/', courtController.getAllCourts);

// Get single court
router.get('/:id', courtController.getCourtById);

// Protected routes
router.use(isAuthenticated);

// Create court (Admin only)
router.post('/', courtController.createCourt);

// Update court (Admin only)
router.patch('/:id', courtController.updateCourt);

// Delete court (Admin only)
router.delete('/:id', courtController.deleteCourt);

export default router; 