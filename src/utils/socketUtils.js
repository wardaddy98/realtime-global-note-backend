import _ from 'lodash';
import { User } from '../models/user.model.js';

export const subscribeUser = async (userId, socketId) => {
  try {
    const user = await User.findById(userId).lean();

    if (!_.isEmpty(user)) {
      await User.updateOne({ _id: userId }, { $set: { isOnline: true, socketId } });
      global.socketIo.emit('user-online', userId);
    }
  } catch (err) {
    console.log(err);
  }
};

export const unsubscribeUser = async userId => {
  try {
    const user = await User.findById(userId).lean();

    if (!_.isEmpty(user)) {
      await User.updateOne({ _id: userId }, { $set: { isOnline: false, socketId: '' } });
      global.socketIo.emit('user-offline', userId);
    }
  } catch (err) {
    console.log(err);
  }
};

export const unSubscribeUserOnDisconnection = async socketId => {
  try {
    const user = await User.findOne({ socketId }).lean();
    if (!_.isEmpty(user)) {
      await User.updateOne({ _id: user._id }, { $set: { isOnline: false, socketId: '' } });
      global.socketIo.emit('user-offline', user._id);
    }
  } catch (err) {
    console.log(err);
  }
};
