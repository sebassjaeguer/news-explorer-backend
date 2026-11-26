const isProduction = process.env.NODE_ENV === 'production';

const PORT = Number(process.env.PORT || 3000);

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error('PORT debe ser un número entero entre 1 y 65535');
}

if (isProduction && !process.env.JWT_SECRET) {
  throw new Error('Debes configurar JWT_SECRET en producción');
}

if (isProduction && !process.env.MONGO_URI) {
  throw new Error('Debes configurar MONGO_URI en producción');
}

const JWT_SECRET = process.env.JWT_SECRET || 'news-explorer-development-secret';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/newsexplorer';

module.exports = {
  isProduction,
  PORT,
  JWT_SECRET,
  MONGO_URI,
};
