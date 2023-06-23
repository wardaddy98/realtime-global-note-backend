import express from 'express';
import isLoggedIn from '../../utils/authMiddlewares.js';
import { createNote, deleteNote, editNote, getPaginatedNotes } from './controller.js';
const router = express.Router();

router.get('/', isLoggedIn, getPaginatedNotes);
router.post('/', isLoggedIn, createNote);
router.patch('/:noteId', isLoggedIn, editNote);
router.delete('/:noteId', isLoggedIn, deleteNote);

export default router;
