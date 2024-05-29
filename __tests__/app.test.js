const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const app = require("../app");
const endpoint = require("../endpoints.json")

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
        expect(body).toEqual([{"description": "The man, the Mitch, the legend", "slug": "mitch"}, {"description": "Not dogs", "slug": "cats"}, {"description": "what books are made of", "slug": "paper"}]);
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

describe('getArticles', () => {
    test('200: /api/articles/:article_id', () => {
        return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        body.forEach((column) => {
          expect(column).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        })
      });
    });
    test('400: should return bad request ', () => {
        return request(app)
        .get("/api/articles/NaN")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe(`ERROR: bad request. use "/api" for acceptable endpoints`)
        });
    });
    test('404 should return not ', () => {
        return request(app)
        .get("/api/articles/99")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe(`ERROR: no article with that id found`)
        });
    });
});