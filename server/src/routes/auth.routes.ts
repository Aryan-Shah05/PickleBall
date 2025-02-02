import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema, resetPasswordSchema, forgotPasswordSchema } from '../schemas/auth.schema';

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

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

export default router; 