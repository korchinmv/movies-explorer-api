const { messageError } = require('../utils/responses');

const centralError = (err, req, res, next) => {
  if (!err.statusCode) {
    res.status(500).send({ message: messageError });
  }
  res.status(err.statusCode).send({ message: err.message });
  next();
};

module.exports = centralError;
