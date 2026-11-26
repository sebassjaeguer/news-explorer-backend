const router = require('express').Router();

const auth = require('../middlewares/auth');
const HttpError = require('../errors/HttpError');
const { HTTP_STATUS } = require('../config/constants');
const {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} = require('../config/messages');

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
  res.status(HTTP_STATUS.OK).json({
    message: SUCCESS_MESSAGES.SERVER_RUNNING,
  });
});

router.use('/users', userRoutes);
router.use('/articles', articleRoutes);

router.use((req, res, next) => {
  next(
    new HttpError(
      HTTP_STATUS.NOT_FOUND,
      ERROR_MESSAGES.ROUTE_NOT_FOUND,
    ),
  );
});

module.exports = router;
