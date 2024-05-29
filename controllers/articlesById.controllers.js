const { findArticle } = require("../models/articlesById.models")



exports.getArticlesById = (req, res, next) => {
    const{articles_id} = req.params
    return findArticle(articles_id)
    .then((article) => {
        res.status(200).send(article)
    })
    .catch((err) => {
      next(err)
    })
}