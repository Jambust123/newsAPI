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
        body.forEach((column) => {
          expect(column).toMatchObject({
            article_id: 1,
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
  test("400: should return bad request ", () => {
    return request(app)
      .get("/api/articles/NaN")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `ERROR: bad request. ensure you use a valid article ID number`
        );
      });
  });
  test("404 should return not found", () => {
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
  test("404: should return not found", () => {
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
            article_id: expect.any(Number),
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
    const input = {
      author: "icellusedkars",
      body: "lol",
    };
    return request(app)
      .post("/api/articles/banana/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`ERROR: bad request. ensure you use a valid article ID number`);
      });
  });  
});
