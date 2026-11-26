const { appendFile } = require('node:fs');
const path = require('node:path');
const { STATUS_CODES } = require('node:http');

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

    if (res.statusCode >= 400) {
      writeLog('error.log', {
        ...responseEntry,
        message: STATUS_CODES[res.statusCode] || 'HTTP error',
      });
    }
  });

  next();
}

module.exports = requestLogger;
