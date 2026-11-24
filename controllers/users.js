const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const HttpError = require('../errors/HttpError');
const { JWT_SECRET } = require('../config/env');

const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: passwordHash,
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(
        new HttpError(409, 'Este correo ya está registrado')
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
        new HttpError(401, 'Correo o contraseña incorrectos')
      );
    }

    const token = jwt.sign(
      { _id: user._id.toString() },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
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
        new HttpError(404, 'Usuario no encontrado')
      );
    }

    return res.json(user);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
};
