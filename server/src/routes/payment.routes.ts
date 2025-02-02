import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { validateRequest } from '../middleware/validateRequest';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

// Protected routes
router.use(isAuthenticated);

// Create payment intent
router.post('/create-intent', paymentController.createPaymentIntent);

// Process payment
router.post('/process', paymentController.processPayment);

// Get payment by ID
router.get('/:id', paymentController.getPaymentById);

// Get user's payments
router.get('/my-payments', paymentController.getMyPayments);

export default router; 