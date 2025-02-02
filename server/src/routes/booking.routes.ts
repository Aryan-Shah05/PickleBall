import { Router } from 'express';
import { bookingController } from '../controllers/booking.controller';
import { validateRequest } from '../middleware/validateRequest';
import { protect } from '../middleware/auth';

const router = Router();

// Protected routes
router.use(protect);

// Get user's bookings
router.get('/my-bookings', bookingController.getMyBookings);

// Get all bookings (Admin only)
router.get('/', bookingController.getAllBookings);

// Get single booking
router.get('/:id', bookingController.getBookingById);

// Create booking
router.post('/', bookingController.createBooking);

// Update booking
router.patch('/:id', bookingController.updateBooking);

// Cancel booking
router.delete('/:id', bookingController.cancelBooking);

export default router; 