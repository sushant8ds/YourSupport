import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getProfile } from '../controllers/userController';

const router = Router();

router.use(requireAuth);
router.get('/profile', getProfile);

export default router;
