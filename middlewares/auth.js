const jwt = require('jsonwebtoken');

const HttpError = require('../errors/HttpError');
const { JWT_SECRET } = require('../config/env');
const { HTTP_STATUS } = require('../config/constants');
const { ERROR_MESSAGES } = require('../config/messages');

function auth(req, res, next) {
  const authorization = req.get('Authorization') || '';
  const [type, token] = authorization.split(' ');

  if (type !== 'Bearer' || !token) {
    return next(
      new HttpError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.AUTH_REQUIRED,
      ),
    );
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (
      !payload
      || typeof payload._id !== 'string'
      || !/^[a-f\d]{24}$/i.test(payload._id)
    ) {
      return next(
        new HttpError(
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGES.INVALID_TOKEN_USER,
        ),
      );
    }

    req.user = payload;
    return next();
  } catch {
    return next(
      new HttpError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.INVALID_TOKEN,
      ),
    );
  }
}

module.exports = auth;
