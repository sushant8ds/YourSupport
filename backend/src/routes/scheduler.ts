import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  generatePlan,
  replanDay,
  getNext,
  runDecisionMode,
  getPlan,
} from '../controllers/schedulerController';

const router = Router();

// All scheduler routes require authentication
router.use(requireAuth);

// GET /api/scheduler/plan — fetch the full daily plan
router.get('/plan', getPlan);

// POST /api/scheduler/generate — generate today's plan
router.post('/generate', generatePlan);

// POST /api/scheduler/replan — ⚡ Life Happened
router.post('/replan', replanDay);

// GET /api/scheduler/next — what should I do right now?
router.get('/next', getNext);

// POST /api/scheduler/decision-mode — I have X minutes
router.post('/decision-mode', runDecisionMode);

export default router;
