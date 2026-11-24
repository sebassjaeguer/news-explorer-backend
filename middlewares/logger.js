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
  const entry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
  };

  writeLog('request.log', entry);

  res.once('finish', () => {
    if (res.statusCode >= 400) {
      writeLog('error.log', {
        ...entry,
        statusCode: res.statusCode,
        message: STATUS_CODES[res.statusCode] || 'HTTP error',
      });
    }
  });

  next();
}

module.exports = requestLogger;
