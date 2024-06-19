const db = require("../db/connection");

exports.articlesByDate = (created_at) => {
  let queryString = `SELECT 
    articles.author,
    articles.title,
    articles.topic,
    articles.article_id,
    articles.created_at,
    articles.votes,
    articles.article_img_url, 
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    `;

  const queres = [];

  if (created_at) {
    queryString += ` WHERE articles.created_at = $1 `;
    queres.push(created_at);
  }

  queryString += `
GROUP BY articles.article_id
ORDER BY articles.created_at DESC`;

  return db.query(queryString, queres).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `ERROR: No articles found with the given criteria`,
      });
    } else {
      return result.rows;
    }
  });
};
