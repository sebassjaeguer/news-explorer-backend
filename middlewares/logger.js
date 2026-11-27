const { appendFile } = require('node:fs');
const path = require('node:path');
const { STATUS_CODES } = require('node:http');

const { HTTP_STATUS } = require('../config/constants');
const { ERROR_MESSAGES } = require('../config/messages');

function writeLog(filename, entry) {
  const filePath = path.join(__dirname, '..', filename);

  appendFile(filePath, `${JSON.stringify(entry)}\n`, (error) => {
    if (error) {
      console.error(`No se pudo escribir ${filename}:`, error.message);
    }
  });
}

function requestLogger(req, res, next) {
  const startedAt = Date.now();

  const requestEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
  };

  writeLog('request.log', {
    ...requestEntry,
    event: 'request',
  });

  res.once('finish', () => {
    const responseEntry = {
      ...requestEntry,
      timestamp: new Date().toISOString(),
      event: 'response',
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    };

    writeLog('request.log', responseEntry);

    if (res.statusCode >= HTTP_STATUS.BAD_REQUEST) {
      const defaultReason = res.statusCode === HTTP_STATUS.TOO_MANY_REQUESTS
        ? ERROR_MESSAGES.TOO_MANY_REQUESTS
        : 'Respuesta de error sin una causa específica registrada';

      writeLog('error.log', {
        ...responseEntry,
        message: STATUS_CODES[res.statusCode] || 'HTTP error',
        reason: res.locals.errorReason || defaultReason,
      });
    }
  });

  next();
}

module.exports = requestLogger;
