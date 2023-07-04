const { messageAuthorizationError } = require('../utils/responses');
const { checkToken } = require('../utils/jwtAuth');
const UnauthorizationError = require('../errors/UnauthorizationError');

const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    next(new UnauthorizationError(messageAuthorizationError));
  }
  const token = req.headers.authorization.replace('Bearer ', '');
  try {
    const payload = checkToken(token);
    req.user = payload;
  } catch (error) {
    next(new UnauthorizationError(messageAuthorizationError));
  }
  next();
};

module.exports = {
  auth,
};
