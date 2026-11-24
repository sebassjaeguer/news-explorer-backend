const jwt = require('jsonwebtoken');
const HttpError = require('../errors/HttpError');
const { JWT_SECRET } = require('../config/env');

function auth(req, res, next) {
  const authorization = req.get('Authorization') || '';
  const [type, token] = authorization.split(' ');

  if (type !== 'Bearer' || !token) {
    return next(new HttpError(401, 'Necesitas iniciar sesión'));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (
      !payload ||
      typeof payload._id !== 'string' ||
      !/^[a-f\d]{24}$/i.test(payload._id)
    ) {
      return next(
        new HttpError(401, 'El token no identifica a un usuario válido')
      );
    }

    req.user = payload;
    return next();
  } catch {
    return next(
      new HttpError(401, 'El token es inválido o ha expirado')
    );
  }
}

module.exports = auth;
