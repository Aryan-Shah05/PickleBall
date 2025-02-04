import { Router } from 'express';
import { courtController } from '../controllers/court.controller';
import { protect } from '../middleware/auth';

const router = Router();

// Get all courts
router.get('/', protect, courtController.getAllCourts);

// Get available courts
router.get('/available', protect, courtController.getAvailableCourts);

// Get single court
router.get('/:id', protect, courtController.getCourtById);

// Protected routes
router.post('/', protect, courtController.createCourt);

// Update court (Admin only)
router.put('/:id', protect, courtController.updateCourt);

// Delete court (Admin only)
router.delete('/:id', protect, courtController.deleteCourt);

export default router; 