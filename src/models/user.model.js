import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const userSchema = mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  socketId: {
    type: String,
  },
  name: {
    type: String,
  },

  isOnline: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
    immutable: true,
  },
});

export const User = mongoose.model('users', userSchema);
