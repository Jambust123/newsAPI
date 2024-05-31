const {
  findArticle,
  updateArticle,
  findCommentTotal,
} = require("../models/articlesById.models");

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  return findArticle(article_id)
    .then((article) => {
      res.status(200).send({article});
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  return updateArticle(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
