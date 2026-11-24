const { isCelebrateError } = require('celebrate');
const HttpError = require('../errors/HttpError');

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (isCelebrateError(error)) {
    return res.status(400).json({ message: 'Revisa los datos enviados' });
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'El cuerpo debe ser un JSON válido' });
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({ message: 'La petición es demasiado grande' });
  }

  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: 'Revisa los datos enviados' });
  }

  if (error instanceof HttpError && error.statusCode >= 400 && error.statusCode < 500) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  return res.status(500).json({ message: 'Ocurrió un error en el servidor' });
}

module.exports = errorHandler;
