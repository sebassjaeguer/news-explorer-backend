require('dotenv').config();

const express = require('express');

const connectDB = require('./config/db');
const Article = require('./models/article');
const routes = require('./routes');

const requestLogger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(requestLogger);
app.use(express.json());

app.use(routes);

app.use(errorHandler);

const startServer = async () => {
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error('PORT debe ser un número entero entre 1 y 65535');
  }

  await connectDB();
  await Article.createIndexes();

  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('No se pudo iniciar el servidor:', error.message);
  process.exit(1);
});
