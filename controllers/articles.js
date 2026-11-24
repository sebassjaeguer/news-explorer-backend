const Article = require('../models/article');
const HttpError = require('../errors/HttpError');

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

    return res.status(201).json(savedArticle);
  } catch (error) {
    if (error.code === 11000) {
      return next(new HttpError(
        409,
        'Ya guardaste esta noticia. Recarga la página para actualizar tus guardados.'
      ));
    }

    return next(error);
  }
};

const getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({
      owner: req.user._id,
    });

    return res.json(articles);
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
        new HttpError(404, 'Artículo no encontrado')
      );
    }

    if (!article.owner.equals(req.user._id)) {
      return next(
        new HttpError(403, 'No puedes eliminar artículos de otra cuenta')
      );
    }

    const deletedArticle = await Article.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!deletedArticle) {
      return next(
        new HttpError(404, 'Artículo no encontrado')
      );
    }

    return res.json({
      message: 'Artículo eliminado',
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
