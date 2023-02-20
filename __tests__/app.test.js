const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api/categories", () => {
  it("GET: 200, should return an array of the categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          categories: [
            {
              slug: "euro game",
              description: "Abstact games that involve little luck",
            },
            {
              slug: "social deduction",
              description:
                "Players attempt to uncover each other's hidden role",
            },
            {
              slug: "dexterity",
              description: "Games involving physical skill",
            },
            {
              slug: "children's games",
              description: "Games suitable for children",
            },
          ],
        });
      });
  });
  it("GET: 404, handle incorrect endpoint", () => {
    return request(app).get("/api/categorie").expect(404);
  });
});

const fix = 1;
