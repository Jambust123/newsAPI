const db = require("../db/connection");


exports.findArticleComments = (article_id) => {
  let queryString = ` SELECT * FROM comments `;
  const queries = [];

  if (article_id) {
    queryString += ` WHERE article_id = $1 `;
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
