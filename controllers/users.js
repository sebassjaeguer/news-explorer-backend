const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const HttpError = require('../errors/HttpError');
const { JWT_SECRET } = require('../config/env');
const { HTTP_STATUS } = require('../config/constants');
const { ERROR_MESSAGES } = require('../config/messages');

const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: passwordHash,
    });

    return res.status(HTTP_STATUS.CREATED).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(
        new HttpError(
          HTTP_STATUS.CONFLICT,
          ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
        ),
      );
    }

    return next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(
        new HttpError(
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGES.INVALID_CREDENTIALS,
        ),
      );
    }

    const token = jwt.sign(
      { _id: user._id.toString() },
      JWT_SECRET,
      { expiresIn: '7d' },
    );

    return res.status(HTTP_STATUS.OK).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('_id name email');

    if (!user) {
      return next(
        new HttpError(
          HTTP_STATUS.NOT_FOUND,
          ERROR_MESSAGES.USER_NOT_FOUND,
        ),
      );
    }

    return res.status(HTTP_STATUS.OK).json(user);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
};
