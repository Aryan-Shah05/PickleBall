import { Router } from 'express';
import { bookingController } from '../controllers/booking.controller';
import { validateRequest } from '../middleware/validateRequest';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Protected routes
router.use(protect);

// Get user's bookings
router.get('/my-bookings', bookingController.getMyBookings);

// Get all bookings (Admin only)
router.get('/', authorize('ADMIN'), bookingController.getAllBookings);

// Add route to clear all bookings (admin only)
router.delete('/clear-all', authorize('ADMIN'), bookingController.clearAllBookings);

// Check court availability
router.get('/availability', bookingController.checkAvailability);

// Create booking
router.post('/', bookingController.createBooking);

// Get single booking (must come after other specific routes)
router.get('/:id', bookingController.getBookingById);

// Update booking
router.patch('/:id', bookingController.updateBooking);

// Cancel booking
router.delete('/:id', bookingController.cancelBooking);

export default router; 