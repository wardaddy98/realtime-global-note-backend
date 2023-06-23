import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const userSchema = mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(),
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
    default: () => nanoid(),
    immutable: true,
  },
});

export const User = mongoose.model('users', userSchema);
