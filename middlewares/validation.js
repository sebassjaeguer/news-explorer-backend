const { celebrate, Joi, Segments } = require('celebrate');

const validateSignup = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(30)
      .required(),

    email: Joi.string()
      .trim()
      .lowercase()
      .email({ tlds: { allow: false } })
      .required(),

    password: Joi.string()
      .min(8)
      .required(),
  }).required(),
});

const validateSignin = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string()
      .trim()
      .lowercase()
      .email({ tlds: { allow: false } })
      .required(),

    password: Joi.string()
      .required(),
  }).required(),
});

const validateArticle = celebrate({
  [Segments.BODY]: Joi.object({
    keyword: Joi.string()
      .trim()
      .required(),

    title: Joi.string()
      .trim()
      .required(),

    description: Joi.string()
      .trim()
      .required(),

    date: Joi.string()
      .trim()
      .required(),

    source: Joi.string()
      .trim()
      .required(),

    url: Joi.string()
      .trim()
      .uri({ scheme: ['http', 'https'] })
      .required(),

    image: Joi.string()
      .trim()
      .uri({ scheme: ['http', 'https'] })
      .required(),
  }).required(),
});

const validateArticleId = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string()
      .hex()
      .length(24)
      .required(),
  }).required(),
});

module.exports = {
  validateSignup,
  validateSignin,
  validateArticle,
  validateArticleId,
};
