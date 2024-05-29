const { findAllArticles } = require("../models/articles.models")



exports.getAllArticles = (req, res, next) => {
    return findAllArticles()
    .then((allArticles) => {
      res.status(200).send({allArticles})
    })
    .catch((err) => {
      next(err)
    })
}