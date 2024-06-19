const { findAllArticles } = require("../models/articles.models");

exports.getAllArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;

  findAllArticles(topic, sort_by, order)
    .then((allArticles) => {
      res.status(200).send({ allArticles });
    })
    .catch((err) => {
      next(err);
    });
};
