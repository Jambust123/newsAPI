const db = require("../db/connection");

exports.findAllArticles = (topic, sort_by, order) => {

  const validSortBy = ['created_at', 'comment_count', 'votes'];
  const validOrder = ['asc', 'desc'];

  if (!validSortBy.includes(sort_by)) {
    sort_by = 'created_at';
  }

  if (!validOrder.includes(order)) {
    order = 'desc';
  }

  let queryString = `
    SELECT 
      articles.author,
      articles.title,
      articles.topic,
      articles.article_id,
      articles.created_at,
      articles.votes,
      articles.article_img_url, 
      COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id`;

  const queryParams = [];

  if (topic) {
    queryString += ` WHERE articles.topic = $1`;
    queryParams.push(topic);
  }

  queryString += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order.toUpperCase()}`;

  return db.query(queryString, queryParams).then((result) => {
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
