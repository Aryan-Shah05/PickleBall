import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validateRequest';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

const router = Router();

// Add test route
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Auth routes are working',
    availableEndpoints: [
      'POST /register',
      'POST /login',
      'POST /logout',
      'POST /refresh-token',
      'POST /forgot-password',
      'POST /reset-password'
    ]
  });
});

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export { router as authRoutes }; 