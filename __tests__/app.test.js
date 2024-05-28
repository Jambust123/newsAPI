const request = require("supertest")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data/index")
const app = require("../app")

beforeEach(() => {
    return seed(testData);
});
afterAll(() => {
    return db.end();
});

describe('getTopics', () => {
    test('200: /api/topics', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
          expect(body).toHaveLength(3)
        })
    });
});