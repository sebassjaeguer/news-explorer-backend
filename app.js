require('dotenv').config();

const express = require('express');
const helmet = require('helmet');

const { PORT, isProduction } = require('./config/env');
const connectDB = require('./config/db');
const Article = require('./models/article');
const routes = require('./routes');

const requestLogger = require('./middlewares/logger');
const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

if (isProduction) {
  app.set('trust proxy', 'loopback');
}

app.use(requestLogger);
app.use(helmet());
app.use(rateLimiter);
app.use(express.json());

app.use(routes);

app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  await Article.createIndexes();

  app.listen(PORT, '127.0.0.1', () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('No se pudo iniciar el servidor:', error.message);
  process.exit(1);
});
