const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const {
  messageNotUser, messageEmail, messageDataError, messageErrorEmailOrPassword, CREATED,
} = require('../utils/responses');

const { generateToken } = require('../utils/jwtAuth');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizationError = require('../errors/UnauthorizationError');

const getUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id).orFail(new NotFoundError(messageNotUser));
    res.send({ email: user.email, name: user.name });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new ValidationError(messageDataError));
    }
    next(error);
  }
  return null;
};

const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true }).orFail(new Error('NotValidData'));
    res.send({ email: updatedUser.email, name: updatedUser.name });
  } catch (error) {
    if (error.message === 'NotValidData') {
      return next(new NotFoundError(messageDataError));
    } if (error.name === 'ValidationError') {
      return next(new ValidationError(messageDataError));
    }
    next(error);
  }
  return null;
};

const createUser = async (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  const hashPassword = await bcrypt.hash(password, 12);
  try {
    const user = await userModel.create({
      password: hashPassword,
      name,
      email,
    });
    const updUser = user.toObject();
    delete updUser.password;
    res.status(CREATED).send({ data: updUser });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new ValidationError(messageDataError));
    } if (error.code === 11000) {
      return next(new ConflictError(messageEmail));
    }
    next(error);
  }
  return null;
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email }).select('+password').orFail(new Error('UnauthorizedError'));
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return next(new UnauthorizationError(messageErrorEmailOrPassword));
    }
    const token = generateToken({ _id: user._id }, '7d');
    res.send({ token });
  } catch (error) {
    if (error.message === 'UnauthorizedError') return next(new UnauthorizationError(messageErrorEmailOrPassword));
    next(error);
  }
  return null;
};

module.exports = {
  getUser,
  updateUser,
  createUser,
  loginUser,
};
