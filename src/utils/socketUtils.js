import _ from 'lodash';
import { User } from '../models/user.model.js';

export const subscribeUser = async userId => {
  try {
    const user = await User.findById(userId).lean();

    if (!_.isEmpty(user)) {
      await User.updateOne({ _id: userId }, { $set: { isOnline: true } });
      global.socketIo.emit('user-online', userId);
    }
  } catch (err) {
    console.log(err);
  }
};
export const unSubscribeUser = async userId => {
  try {
    const user = await User.findById(userId).lean();

    if (!_.isEmpty(user)) {
      await User.updateOne({ _id: userId }, { $set: { isOnline: false } });
      global.socketIo.emit('user-offline', userId);
    }
  } catch (err) {
    console.log(err);
  }
};
