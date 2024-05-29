const { findArticleComments } = require("../models/articleComments.models")


exports.getArticleComments = (req, res, next) => {
    const{article_id} = req.params
    return findArticleComments(article_id)
    .then((comments) => {
        res.status(200).send({comments})
    })
    .catch((err) => {
      next(err)
    })
}