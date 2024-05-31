const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const app = require("../app");
const endpoint = require("../endpoints.json");
const jestsorted = require("jest-sorted");
const { string } = require("pg-format");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

describe("getTopics", () => {
  test("200: /api/topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual([
          { description: "The man, the Mitch, the legend", slug: "mitch" },
          { description: "Not dogs", slug: "cats" },
          { description: "what books are made of", slug: "paper" },
        ]);
      });
  });

  describe("get available endpoints ", () => {
    test("200: /api", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(endpoint);
        });
    });
  });
});

describe("getArticles", () => {
  test("200: /api/articles/:article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        body.article.forEach((column) => {
          expect(column).toMatchObject({
            article_id: 1,
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("400: should return bad request when given a string", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `ERROR: bad request. ensure you use a valid article ID number`
        );
      });
  });
  test("404 should return not found when passed an article that is invalid", () => {
    return request(app)
      .get("/api/articles/99")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`ERROR: no article with that id found`);
      });
  });
  test("200: should return all articles when given only /articles endpoint", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.allArticles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: should return the comment information when given an article id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
      });
  });
  test("404 should return not found when passed an article that is invalid", () => {
    return request(app)
      .get("/api/articles/99/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`ERROR: no article with that id found`);
      });
  });
  test("200: should be ordered by time created", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy(`created_at`, { descending: true });
      });
  });
  test("400: should return bad request", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `ERROR: bad request. ensure you use a valid article ID number`
        );
      });
  });
});

describe("post article comments", () => {
  test("201: should post a comment to the relecent article", () => {
    const input = {
      author: "icellusedkars",
      body: "lol",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        body.comment.forEach((comment) => {
          expect(comment).toMatchObject({
            article_id: 1,
            author: "icellusedkars",
            body: "lol",
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
  test("400: should return bad request", () => {
    return request(app)
      .post("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `ERROR: bad request. ensure you use a valid article ID number`
        );
      });
  });
  test('404 should return not found when passed an comment that is invalid', () => {
    const input = {
      author: "icellusedkars",
      body: "lol",
    };
    return request(app)
    .post("/api/articles/99/comments")
    .send(input)
     .expect(404)
     .then(({ body }) => {
        expect(body.msg).toBe(`ERROR: no article with that id found`);
      });
  });
});

describe("patch article votes", () => {
  test("200: should return the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        body.article.forEach((article) => {
          expect(article).toMatchObject({
            article_id: 1,
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });
  test("404 should return not found when passed an article that is invalid", () => {
    return request(app)
      .patch("/api/articles/99")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`ERROR: no article with that id found`);
      });
  });
  test("400: should return bad reqyest", () => {
    return request(app)
      .patch("/api/articles/banana")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `ERROR: bad request. ensure you use a valid article ID number`
        );
      });
  });
});

describe("delete article comments", () => {
  test("204: should delete a comment", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("404 should return not found when passed an comment that is invalid", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`ERROR: no comment with that id found`);
      });
  });
  test("400: should return bad request", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `ERROR: bad request. ensure you use a valid article ID number`
        );
      });
  });
});

describe(" get users", () => {
  test("200: should get all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            avatar_url: expect.any(String),
            name: expect.any(String),
          });
        });
      });
  });
  test('200: should have 4 users', () => {
    return request(app)
     .get("/api/users")
     .expect(200)
     .then(({ body }) => {
        expect(body.users.length).toBe(4);
      });
  });
});

describe("get articles by topic", () => {
  test("200: should get all articles by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        body.allArticles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "mitch",
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test('200: should have 12 articles witht the mitch topic', () => {
    return request(app)
     .get("/api/articles?topic=mitch")
     .expect(200)
     .then(({ body }) => {
       expect(body.allArticles.length).toBe(12);
     })
  });
  test("404: should return not found", () => {
    return request(app)
      .get("/api/articles?topic=banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`ERROR: topic not yet created`);
      });
  });
});

describe("get comment count from article", () => {
  test("200: should return the comment count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        body.article.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("404 should return not found when passed an article that is invalid", () => {
    return request(app)
      .get("/api/articles/99")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`ERROR: no article with that id found`);
      });
  });
  test("400: should return bad request", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `ERROR: bad request. ensure you use a valid article ID number`
        );
      });
  });
});
