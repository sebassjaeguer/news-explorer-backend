require('dotenv').config();

const express = require('express');
const HttpError = require('./errors/HttpError');
const errorHandler = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/logger');

const connectDB = require('./config/db');
const Article = require('./models/article');
const auth = require('./middlewares/auth');

const { createUser, login } = require('./controllers/users');
const {
  validateSignup,
  validateSignin,
} = require('./middlewares/validation');

const userRoutes = require('./routes/users');
const articleRoutes = require('./routes/articles');

const app = express();
const PORT = 3001;

app.use(requestLogger);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Servidor de News Explorer funcionando correctamente',
  });
});

app.post('/signup', validateSignup, createUser);
app.post('/signin', validateSignin, login);

app.use('/users', auth, userRoutes);
app.use('/articles', auth, articleRoutes);

app.use((req, res, next) => {
  next(new HttpError(404, 'Ruta no encontrada'));
});

app.use(errorHandler);

const startServer = async () => {
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
