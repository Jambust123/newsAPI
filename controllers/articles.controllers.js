const { findArticle } = require("../models/articles.models")


exports.getArticles = (req, res, next) => {
    const{articles_id} = req.params
    return findArticle(articles_id)
    .then((article) => {
        res.status(200).send(article)
    })
    .catch((err) => {
      next(err)
    })
}