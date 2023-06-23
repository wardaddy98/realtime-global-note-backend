import _ from 'lodash';
import { User } from '../models/user.model.js';
import { handleResponse } from './handleResponse.js';

export const isLoggedIn = async (req, res, next) => {
  try {
    const userId = req.headers.userid;

    if (!userId) {
      return handleResponse(res, {
        type: 'FORBIDDEN',
        message: 'Missing User Id',
      });
    }

    // to check if the user making the request is a valid user within the list of predefined users
    const user = await User.findById(userId).lean();

    if (_.isEmpty(user)) {
      return handleResponse(res, {
        type: 'FORBIDDEN',
        message: 'Invalid User Id',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

export default isLoggedIn;
