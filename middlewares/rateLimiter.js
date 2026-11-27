const { rateLimit } = require('express-rate-limit');

const { HTTP_STATUS } = require('../config/constants');
const { ERROR_MESSAGES } = require('../config/messages');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  message: {
    message: ERROR_MESSAGES.TOO_MANY_REQUESTS,
  },
});

module.exports = rateLimiter;
