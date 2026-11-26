const router = require('express').Router();

const auth = require('../middlewares/auth');
const HttpError = require('../errors/HttpError');

const { createUser, login } = require('../controllers/users');

const {
  validateSignup,
  validateSignin,
} = require('../middlewares/validation');

const userRoutes = require('./users');
const articleRoutes = require('./articles');

router.post('/signup', validateSignup, createUser);
router.post('/signin', validateSignin, login);

router.use(auth);

router.get('/', (req, res) => {
  res.json({
    message: 'Servidor de News Explorer funcionando correctamente',
  });
});

router.use('/users', userRoutes);
router.use('/articles', articleRoutes);

router.use((req, res, next) => {
  next(new HttpError(404, 'Ruta no encontrada'));
});

module.exports = router;
