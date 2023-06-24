import _ from 'lodash';
import { User } from '../models/user.model.js';

export const subscribeUser = async (userId, socket, socketId) => {
  try {
    const user = await User.findById(userId).lean();

    if (!_.isEmpty(user)) {
      await User.updateOne({ _id: userId }, { $set: { isOnline: true, socketId } });
      //emit to sockets other than sender socket
      socket.broadcast.emit('user-online', userId);
    }
  } catch (err) {
    console.log(err);
  }
};

export const unsubscribeUser = async (userId, socket) => {
  try {
    const user = await User.findById(userId).lean();

    if (!_.isEmpty(user)) {
      await User.updateOne({ _id: userId }, { $set: { isOnline: false, socketId: '' } });
      //emit to sockets other than sender socket
      socket.broadcast.emit('user-offline', userId);
    }
  } catch (err) {
    console.log(err);
  }
};

export const unSubscribeUserOnDisconnection = async (socketId, socket) => {
  try {
    const user = await User.findOne({ socketId }).lean();
    if (!_.isEmpty(user)) {
      await User.updateOne({ _id: user._id }, { $set: { isOnline: false, socketId: '' } });
      socket.broadcast.emit('user-offline', user._id);
    }
  } catch (err) {
    console.log(err);
  }
};
