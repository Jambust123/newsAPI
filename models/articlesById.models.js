const db = require("../db/connection");

exports.findArticle = (article_id) => {
  let queryString = `SELECT 
  articles.author, 
  articles.title, 
  articles.article_id, 
  articles.body, 
  articles.topic, 
  articles.votes, 
  articles.created_at,
  articles.article_img_url,
  COUNT(comments.comment_id) 
  AS comment_count 
  FROM articles 
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id`
  
  const articleId = [article_id];

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

exports.updateArticle = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then((query) => {
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
