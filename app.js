const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/api.controllers");
const { getArticles } = require("./controllers/articles.controllers");

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:articles_id", getArticles);

app.use((err, req, res, next) => {
  if (err.code) {
    res
      .status(400)
      .send({ msg: `ERROR: bad request. use "/api" for acceptable endpoints` });
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
