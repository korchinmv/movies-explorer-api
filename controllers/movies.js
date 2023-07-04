const movieModel = require('../models/movie');

const {
  messageNotMovie, messageNoRights, messageDataError, messageNotFound, CREATED,
} = require('../utils/responses');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovies = async (req, res, next) => {
  try {
    const movies = await movieModel.find({ owner: req.user._id });
    res.send(movies);
  } catch (error) {
    next(error);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const movie = await movieModel.create({ ...req.body, owner: req.user._id });
    res.status(CREATED).send({ data: movie });
  } catch (error) {
    if (error.name === 'ValidationError') return next(new ValidationError(`${messageDataError} при создании фильма`));
    next(error);
  }
  return null;
};

const deleteMovie = async (req, res, next) => {
  try {
    const ownMovie = await movieModel.findById(req.params.movieId);
    if (ownMovie === null) {
      return next(new NotFoundError(messageNotFound));
    } if (ownMovie.owner.toString() !== req.user._id) {
      return next(new ForbiddenError(messageNoRights));
    }
    await movieModel.deleteOne(ownMovie._id);
    res.send({ data: ownMovie });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new ValidationError(messageNotMovie));
    }
    next(error);
  }
  return null;
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
