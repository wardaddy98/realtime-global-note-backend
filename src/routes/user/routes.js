import express from 'express';
import { createUser, getAllUsers, getSingleUser } from './controller.js';
const router = express.Router();

router.get('/', getAllUsers);
router.get('/:userId', getSingleUser);
router.post('/', createUser);

export default router;
