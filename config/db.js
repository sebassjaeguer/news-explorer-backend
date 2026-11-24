const mongoose = require('mongoose');

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const configuredUri = process.env.MONGO_URI;

  if (isProduction && !configuredUri) {
    throw new Error('Debes configurar MONGO_URI en producción');
  }

  const mongoUri =
    configuredUri || 'mongodb://127.0.0.1:27017/newsexplorer';

  await mongoose.connect(mongoUri);

  console.log('MongoDB conectado correctamente');
};

module.exports = connectDB;
