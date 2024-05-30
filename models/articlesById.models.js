const db = require("../db/connection");

exports.findArticle = (article_id) => {
  let queryString = ` SELECT articles.* FROM articles `;
  const articleId = [];

  if (article_id) {
    queryString += ` WHERE article_id = $1`;
    articleId.push(article_id);
  }
  return db.query(queryString, articleId).then((query) => {
    if (query.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `ERROR: no article with that id found`,
      });
    } else {
      return query.rows;
    }
  });
};

exports.createArticleComments = (article_id, body) => {
  commentBody = [article_id, body.author, body.body];

  return db
    .query(
      `INSERT INTO comments 
    (article_id, author, body) 
    VALUES 
    ($1, $2, $3) 
    returning *`,
      commentBody
    )
    .then((query) => {
      if (query.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `ERROR: no article with that id found`,
        });
      } else {
        return query.rows;
      }
    });
};
