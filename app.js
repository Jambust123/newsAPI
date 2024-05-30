const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/api.controllers");
const { getAllArticles, getArticlesByTopic } = require("./controllers/articles.controllers");
const { getArticlesById, patchArticle } = require("./controllers/articlesById.controllers");
const { getArticleComments, postArticleComment, deleteArticleComment } = require("./controllers/articleComments.controllers");
const { getUsers } = require("./controllers/users.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles", getAllArticles)

app.get("/api/articles/:article_id/comments", getArticleComments)

app.post("/api/articles/:article_id/comments", postArticleComment)

app.patch("/api/articles/:article_id", patchArticle);  

app.delete("/api/comments/:comment_id", deleteArticleComment)

app.get("/api/users", getUsers)

app.use((err, req, res, next) => {
  if (err.code) {
    res
      .status(400)
      .send({ msg: `ERROR: bad request. ensure you use a valid article ID number` });
  }
  next(err);
});

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    }
    next(err);
});

app.use((err, req, res, next) => {
  res
    .status(500)
    .send({ msg: `ERROR: we're working to fix this internal error :(` });
});

module.exports = app;
