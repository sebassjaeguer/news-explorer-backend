const mongoose = require('mongoose');

function isHttpUrl(value) {
  try {
    const parsedUrl = new URL(value);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}

const articleSchema = new mongoose.Schema({
  keyword: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  source: { type: String, required: true },
  url: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: isHttpUrl,
      message: 'La noticia debe tener una dirección HTTP o HTTPS válida',
    },
  },
  image: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: isHttpUrl,
      message: 'La imagen debe tener una dirección HTTP o HTTPS válida',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    select: false,
    required: true,
  },
});

articleSchema.index({ owner: 1, url: 1 }, { unique: true });

module.exports = mongoose.model('Article', articleSchema);



