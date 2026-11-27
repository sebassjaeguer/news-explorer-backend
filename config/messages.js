const ERROR_MESSAGES = {
  INVALID_DATA: 'Revisa los datos enviados',
  INVALID_JSON: 'El cuerpo debe ser un JSON válido',
  PAYLOAD_TOO_LARGE: 'La petición es demasiado grande',
  INTERNAL_SERVER_ERROR: 'Ocurrió un error en el servidor',
  TOO_MANY_REQUESTS: 'Demasiadas solicitudes. Inténtalo de nuevo más tarde.',
  EMAIL_ALREADY_EXISTS: 'Este correo ya está registrado',
  INVALID_CREDENTIALS: 'Correo o contraseña incorrectos',
  USER_NOT_FOUND: 'Usuario no encontrado',
  ARTICLE_ALREADY_EXISTS: 'Ya guardaste esta noticia. Recarga la página para actualizar tus guardados.',
  ARTICLE_NOT_FOUND: 'Artículo no encontrado',
  ARTICLE_DELETE_FORBIDDEN: 'No puedes eliminar artículos de otra cuenta',
  AUTH_REQUIRED: 'Necesitas iniciar sesión',
  INVALID_TOKEN_USER: 'El token no identifica a un usuario válido',
  INVALID_TOKEN: 'El token es inválido o ha expirado',
  ROUTE_NOT_FOUND: 'Ruta no encontrada',
};

const SUCCESS_MESSAGES = {
  ARTICLE_DELETED: 'Artículo eliminado',
  SERVER_RUNNING: 'Servidor de News Explorer funcionando correctamente',
};

module.exports = {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
