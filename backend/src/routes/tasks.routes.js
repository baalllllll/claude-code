import { Router } from 'express';
import { getTasks, getTask, createTask, updateTask, deleteTask } from '../controllers/tasks.controller.js';
import { validateTask } from '../middleware/validateTask.js';

const router = Router();

router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', validateTask, createTask);
router.patch('/:id', validateTask, updateTask);
router.delete('/:id', deleteTask);

export default router;
