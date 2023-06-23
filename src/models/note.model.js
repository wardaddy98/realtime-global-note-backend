import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const editSchema = mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  content: {
    type: String,
  },
  editedBy: {
    type: String,
    ref: 'users',
  },
  editedAt: {
    type: Number,
  },
});

const noteSchema = mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },

  title: {
    type: String,
  },

  content: {
    type: String,
  },

  contributedBy: [
    {
      type: String,
      ref: 'users',
    },
  ],

  edits: [editSchema],

  createdBy: {
    type: String,
    ref: 'users',
    immutable: true,
  },

  createdAt: {
    type: Number,
    default: () => Date.now(),
    immutable: true,
  },
  lastUpdated: {
    type: Number,
    default: () => Date.now(),
  },
});

export const Note = mongoose.model('notes', noteSchema);
