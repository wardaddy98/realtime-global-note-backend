import _ from 'lodash';
import { User } from '../../models/user.model.js';
import { handleResponse } from '../../utils/handleResponse.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { __v: 0 }).lean();

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'Users loaded successfully',
      body: {
        users,
      },
    });
  } catch (err) {
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).select('-__v').lean();

    if (_.isEmpty(user)) {
      return handleResponse(res, {
        type: 'BAD_REQUEST',
        message: 'User not found!',
      });
    }

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'User Found',
      body: {
        user,
      },
    });
  } catch (err) {
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const payload = req.body;

    await User.create(payload);

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'User created Successfully',
    });
  } catch (err) {
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};
