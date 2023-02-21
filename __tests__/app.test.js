const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app/app");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("app", () => {
  it("GET: 404, handle incorrect endpoint", () => {
    return request(app)
      .get("/not_a_real_endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Path not found!" });
      });
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
  });
  describe("/api/reviews", () => {
    it("GET: 200, should return an array of the reviews with a comment count", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          body.reviews.forEach((review) =>
            expect(review).toEqual(
              expect.objectContaining({
                category: expect.any(String),
                created_at: expect.any(String),
                designer: expect.any(String),
                owner: expect.any(String),
                review_id: expect.any(Number),
                review_img_url: expect.any(String),
                title: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            )
          );
        });
    });
    it("GET: 200, should return an array of the reviews sorted by created_at in descending order", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          console.log(body.reviews[0].created_at);
          expect(body.reviews).toBeSorted("created_at", { descending: true });
        });
    });
  });
});
