import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController';

const router = Router();

// All task routes require authentication
router.use(requireAuth);

// GET /api/tasks — list today's tasks (or by date query parameter)
router.get('/', getTasks);

// POST /api/tasks — create a task
router.post('/', createTask);

// PATCH /api/tasks/:id — update a task
router.patch('/:id', updateTask);

// DELETE /api/tasks/:id — delete a task
router.delete('/:id', deleteTask);

export default router;
