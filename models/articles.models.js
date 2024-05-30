const db = require("../db/connection");

exports.findAllArticles = (topic) => {

  let queryString =`SELECT 
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
    `
  
    const queres = []

if(topic) {
  queryString += ` WHERE articles.topic = $1 `
  queres.push(topic)
}

queryString += `
GROUP BY articles.article_id
ORDER BY articles.created_at DESC`

  return db.query(queryString, queres)
  .then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `ERROR: topic not yet created`,
      });
    } else {
      return result.rows;
    }
})
}