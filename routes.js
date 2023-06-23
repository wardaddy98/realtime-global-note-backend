import express from 'express';
import noteRouter from './src/routes/note/routes.js';
import userRouter from './src/routes/user/routes.js';
const router = express.Router();

router.use('/user', userRouter);
router.use('/note', noteRouter);

export default router;
