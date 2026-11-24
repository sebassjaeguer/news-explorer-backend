const router = require('express').Router();

const {
  createArticle,
  getArticles,
  deleteArticle,
} = require('../controllers/articles');

const {
  validateArticle,
  validateArticleId,
} = require('../middlewares/validation');

router.get('/', getArticles);

router.post('/', validateArticle, createArticle);

router.delete('/:id', validateArticleId, deleteArticle);

module.exports = router;
