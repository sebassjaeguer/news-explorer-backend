const { isCelebrateError } = require('celebrate');

const HttpError = require('../errors/HttpError');
const { HTTP_STATUS } = require('../config/constants');
const { ERROR_MESSAGES } = require('../config/messages');

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (isCelebrateError(error)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: ERROR_MESSAGES.INVALID_DATA,
    });
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: ERROR_MESSAGES.INVALID_JSON,
    });
  }

  if (error.type === 'entity.too.large') {
    return res.status(HTTP_STATUS.PAYLOAD_TOO_LARGE).json({
      message: ERROR_MESSAGES.PAYLOAD_TOO_LARGE,
    });
  }

  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: ERROR_MESSAGES.INVALID_DATA,
    });
  }

  if (
    error instanceof HttpError
    && error.statusCode >= HTTP_STATUS.BAD_REQUEST
    && error.statusCode < HTTP_STATUS.INTERNAL_SERVER_ERROR
  ) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  });
}

module.exports = errorHandler;
