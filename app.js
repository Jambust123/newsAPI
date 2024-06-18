const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/api.controllers");
const {
  getAllArticles,
  getArticlesByTopic,
} = require("./controllers/articles.controllers");
const {
  getArticlesById,
  patchArticle,
} = require("./controllers/articlesById.controllers");
const {
  getArticleComments,
  postArticleComment,
  deleteArticleComment,
} = require("./controllers/articleComments.controllers");
const { getUsers } = require("./controllers/users.controllers");
const cors = require("cors");

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
})

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postArticleComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteArticleComment);

app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({
      msg: `ERROR: no article with that id found`
    });
  }else if (err.code && !(err.code === "23503")) {
    res.status(400).send({
      msg: err.code,
    });
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
