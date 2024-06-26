const db = require("../db/connection");

exports.findArticleComments = (article_id) => {
  let queryString = `SELECT * FROM comments`;
  const queries = [];

  if (article_id) {
    queryString += ` WHERE article_id = $1 ORDER BY comments.created_at DESC`;
    queries.push(article_id);
  }

  return db.query(queryString, queries).then((query) => {
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
  const commentBody = [article_id, body.author, body.body];

  return db
    .query(
      `INSERT INTO comments 
    (article_id, author, body) 
    VALUES 
    ($1, $2, $3) 
    RETURNING *`,
      commentBody
    )
    .then((query) => {
      if (query.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `ERROR: no comment with that id found`,
        });
      } else {
        return query.rows;
      }
    })
    .catch((err) => {
      throw err;
    });
};

exports.removesComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then((query) => {
      if (query.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `ERROR: no comment with that id found`,
        });
      }
    });
};