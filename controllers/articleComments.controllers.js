const { findArticleComments, removesComment, createArticleComments } = require("../models/articleComments.models");

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  return findArticleComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticleComment = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  return createArticleComments(article_id, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteArticleComment = (req, res, next) => {
    const { comment_id } = req.params;
    return removesComment(comment_id)
   .then((deletedComment) => {
     res.status(204).send("comment has been deleted")
   })
   .catch((err) => {
     next(err)
   })
}