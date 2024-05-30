const { findAllArticles } = require("../models/articles.models");

exports.getAllArticles = (req, res, next) => {
  const { topic } = req.query;
  return findAllArticles(topic)
    .then((allArticles) => {
      res.status(200).send({ allArticles });
    })
    .catch((err) => {
      next(err);
    });
};
