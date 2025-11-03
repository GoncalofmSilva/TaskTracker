import express from 'express';
const router = express.Router();
import { addTask, updateTask, removeTask, listTasks, listTasksByState, changeStates } from '../controllers/tasksController.js';

router.post('/add', addTask);
router.put('/update/:id', updateTask);
router.delete('/delete/:id', removeTask);
router.get('/list', listTasks);
router.get('/list/:state', listTasksByState);
router.put('/changeState/:id', changeStates);

export default router;