import { Router } from 'express';

const router = Router();

router.get('/', (_, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router; 