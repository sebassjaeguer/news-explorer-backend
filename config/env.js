const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && !process.env.JWT_SECRET) {
  throw new Error('Debes configurar JWT_SECRET en producción');
}

const JWT_SECRET =
  process.env.JWT_SECRET || 'news-explorer-development-secret';

module.exports = {
  JWT_SECRET,
};
