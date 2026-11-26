const Article = require('../models/article');
const HttpError = require('../errors/HttpError');
const { HTTP_STATUS } = require('../config/constants');
const {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} = require('../config/messages');

const createArticle = async (req, res, next) => {
  const {
    keyword,
    title,
    description,
    date,
    source,
    url,
    image,
  } = req.body;

  try {
    const article = await Article.create({
      keyword,
      title,
      description,
      date,
      source,
      url,
      image,
      owner: req.user._id,
    });

    const savedArticle = article.toObject();
    delete savedArticle.owner;

    return res.status(HTTP_STATUS.CREATED).json(savedArticle);
  } catch (error) {
    if (error.code === 11000) {
      return next(
        new HttpError(
          HTTP_STATUS.CONFLICT,
          ERROR_MESSAGES.ARTICLE_ALREADY_EXISTS,
        ),
      );
    }

    return next(error);
  }
};

const getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({
      owner: req.user._id,
    });

    return res.status(HTTP_STATUS.OK).json(articles);
  } catch (error) {
    return next(error);
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id)
      .select('+owner');

    if (!article) {
      return next(
        new HttpError(
          HTTP_STATUS.NOT_FOUND,
          ERROR_MESSAGES.ARTICLE_NOT_FOUND,
        ),
      );
    }

    if (!article.owner.equals(req.user._id)) {
      return next(
        new HttpError(
          HTTP_STATUS.FORBIDDEN,
          ERROR_MESSAGES.ARTICLE_DELETE_FORBIDDEN,
        ),
      );
    }

    const deletedArticle = await Article.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!deletedArticle) {
      return next(
        new HttpError(
          HTTP_STATUS.NOT_FOUND,
          ERROR_MESSAGES.ARTICLE_NOT_FOUND,
        ),
      );
    }

    return res.status(HTTP_STATUS.OK).json({
      message: SUCCESS_MESSAGES.ARTICLE_DELETED,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createArticle,
  getArticles,
  deleteArticle,
};
