import express from 'express';
import { body } from 'express-validator';
import { getGoals, createGoal, markGoalComplete, deleteGoal } from '../controllers/goalController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getGoals)
    .post(
        protect,
        [
            body('title').notEmpty().withMessage('Title is required'),
            body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
            body('targetDays').isInt({ min: 1 }).withMessage('Target days must be at least 1')
        ],
        validate,
        createGoal
    );

router.route('/:id').delete(protect, deleteGoal);
router.route('/:id/complete').put(protect, markGoalComplete);

export default router;
