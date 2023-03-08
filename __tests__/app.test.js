const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app/app");
const seed = require("../db/seeds/seed");
const { expect } = require("@jest/globals");

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
    it("GET: 200, should return an array of the categories with a slug and a description", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          body.categories.forEach((category) =>
            expect(category).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            )
          );
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
          expect(body.reviews).toBeSorted("created_at", { descending: true });
        });
    });
    describe("/api/reviews?category", () => {
      it("QUERY: 200, accepts a category query which will specify the category of games to retrieve the reviews for", () => {
        return request(app)
          .get("/api/reviews?category=dexterity")
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            body.reviews.forEach((review) =>
              expect(review).toEqual(
                expect.objectContaining({
                  category: "dexterity",
                })
              )
            );
          });
      });
      it("QUERY: 200, can handle a query with spaces", () => {
        return request(app)
          .get("/api/reviews?category=social+deduction")
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            body.reviews.forEach((review) =>
              expect(review).toEqual(
                expect.objectContaining({
                  category: "social deduction",
                })
              )
            );
          });
      });
      it("QUERY: 404, throws error if category doesn't exist", () => {
        return request(app)
          .get("/api/reviews?category=not-a-real-category")
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({
              msg: "Oops! Category:not-a-real-category doesn't exist!",
            });
          });
      });
    });
    describe("/api/reviews?sort_by", () => {
      it("QUERY: 200, accepts a sort_by value which returns the reviews sorted by the specified value", () => {
        return request(app)
          .get("/api/reviews?sort_by=review_id")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSorted("review_id", { descending: true });
          });
      });
    });
    describe("/api/reviews?order_by", () => {
      it("QUERY: 200, accepts an order_by value which returns the reviews ordered by ascending or descending", () => {
        return request(app)
          .get("/api/reviews?order_by=ASC")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSorted("review_id", { descending: false });
          });
      });
      it("QUERY: 400, throws error if not given ASC or DESC", () => {
        return request(app)
          .get("/api/reviews?order_by=ascending")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({
              msg: `ascending is not a valid order, try DESC or ASC`,
            });
          });
      });
    });
    describe("/api/reviews/:review_id", () => {
      it("GET: 200, retrieves specific review data", () => {
        return request(app)
          .get("/api/reviews/1")
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual({
              review: {
                review_id: 1,
                title: "Agricola",
                designer: "Uwe Rosenberg",
                owner: "mallionaire",
                review_img_url:
                  "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
                review_body: "Farmyard fun!",
                category: "euro game",
                created_at: "2021-01-18T10:00:20.514Z",
                votes: 1,
              },
            });
          });
      });
      it("GET: 400, should return an error if given an invalid id", () => {
        return request(app)
          .get("/api/reviews/bananas")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ msg: "bad request" });
          });
      });
      it("GET: 404, should return an error if given a valid but non-existent id", () => {
        return request(app)
          .get("/api/reviews/999")
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({ msg: "Oops! ID:999 doesn't exist!" });
          });
      });
      it("PATCH: 200, accepts an object containing an integer value to increment the votes value by, will return the updated review", () => {
        const voteUpBy2 = {
          inc_votes: "2",
        };
        return request(app)
          .patch("/api/reviews/1")
          .send(voteUpBy2)
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual({
              updatedComment: {
                title: expect.any(String),
                designer: expect.any(String),
                owner: expect.any(String),
                review_img_url: expect.any(String),
                review_body: expect.any(String),
                review_id: 1,
                category: expect.any(String),
                created_at: expect.any(String),
                votes: 3,
              },
            });
          });
      });
      it("PATCH: 200, correctly handles negative numbers", () => {
        const voteDownBy2 = {
          inc_votes: "-2",
        };
        return request(app)
          .patch("/api/reviews/1")
          .send(voteDownBy2)
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual({
              updatedComment: {
                title: expect.any(String),
                designer: expect.any(String),
                owner: expect.any(String),
                review_img_url: expect.any(String),
                review_body: expect.any(String),
                review_id: 1,
                category: expect.any(String),
                created_at: expect.any(String),
                votes: -1,
              },
            });
          });
      });
      it("PATCH: 200, ignores extraneous properties", () => {
        const voteUpBy2 = {
          inc_votes: "2",
          votes: "73874837",
          inc_boats: "394727420",
        };
        return request(app)
          .patch("/api/reviews/1")
          .send(voteUpBy2)
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual({
              updatedComment: {
                title: expect.any(String),
                designer: expect.any(String),
                owner: expect.any(String),
                review_img_url: expect.any(String),
                review_body: expect.any(String),
                review_id: 1,
                category: expect.any(String),
                created_at: expect.any(String),
                votes: 3,
              },
            });
          });
      });
      it("PATCH: 400, throws an error if given an invalid data type, e.g. not an integer", () => {
        const voteUpByBanana = {
          inc_votes: "banana",
        };
        return request(app)
          .patch("/api/reviews/1")
          .send(voteUpByBanana)
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({
              msg: "bad request",
            });
          });
      });
      it("PATCH: 400, throws an error if given an invalid review_id", () => {
        const voteUpBy5 = {
          inc_votes: "5",
        };
        return request(app)
          .patch("/api/reviews/AAAAAAAAA")
          .send(voteUpBy5)
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({
              msg: "bad request",
            });
          });
      });
      it("PATCH: 404, throws an error if given a valid but non-existent review_id", () => {
        const voteUpBy5 = {
          inc_votes: "5",
        };
        return request(app)
          .patch("/api/reviews/67888")
          .send(voteUpBy5)
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({
              msg: "Oops! ID:67888 doesn't exist!",
            });
          });
      });
      describe("/api/reviews/:review_id/comments", () => {
        it("GET: 200, retrieves specific reviews comments as an array of objects", () => {
          return request(app)
            .get("/api/reviews/2/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body).toEqual({
                comments: [
                  {
                    body: "Now this is a story all about how, board games turned my life upside down",
                    votes: 13,
                    author: "mallionaire",
                    review_id: 2,
                    created_at: expect.any(String),
                    comment_id: expect.any(Number),
                  },
                  {
                    body: "I loved this game too!",
                    votes: 16,
                    author: "bainesface",
                    review_id: 2,
                    created_at: expect.any(String),
                    comment_id: expect.any(Number),
                  },
                  {
                    body: "EPIC board game!",
                    votes: 16,
                    author: "bainesface",
                    review_id: 2,
                    created_at: expect.any(String),
                    comment_id: expect.any(Number),
                  },
                ],
              });
            });
        });
        it("GET: 200, should return an array of the comments sorted by created_at in descending order", () => {
          return request(app)
            .get("/api/reviews/2/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).toBeSorted("created_at", {
                descending: true,
              });
            });
        });
        it("GET: 200, returns an empty array if there are no comments", () => {
          return request(app)
            .get("/api/reviews/1/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body).toEqual({
                comments: [],
              });
            });
        });
        it("GET: 404, if the id does not exist it will throw an error, not return an array", () => {
          return request(app)
            .get("/api/reviews/999/comments")
            .expect(404)
            .then(({ body }) => {
              expect(body).toEqual({ msg: "Oops! ID:999 doesn't exist!" });
            });
        });
        it("GET: 400, if the id is not valid it will throw an error, not return an array", () => {
          return request(app)
            .get("/api/reviews/not-an-id/comments")
            .expect(400)
            .then(({ body }) => {
              expect(body).toEqual({ msg: "bad request" });
            });
        });
        it("POST: 201, accepts a username and a body, will return a fully formatted comment", () => {
          const newComment = {
            username: "mallionaire",
            body: "testing, testing, 1 2 3.",
          };
          return request(app)
            .post("/api/reviews/1/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
              expect(body).toEqual({
                new_comment: {
                  author: "mallionaire",
                  body: "testing, testing, 1 2 3.",
                  comment_id: 7,
                  created_at: expect.any(String),
                  review_id: 1,
                  votes: 0,
                },
              });
            });
        });
        it("POST: 201, unnecessary properties on request body are ignored", () => {
          const newComment = {
            username: "mallionaire",
            body: "testing, testing, 1 2 3.",
            random: "this shouldn't impact the posting of a comment",
          };
          return request(app)
            .post("/api/reviews/1/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
              expect(body).toEqual({
                new_comment: {
                  author: "mallionaire",
                  body: "testing, testing, 1 2 3.",
                  comment_id: 7,
                  created_at: expect.any(String),
                  review_id: 1,
                  votes: 0,
                },
              });
            });
        });
        it("POST: 404, should throw an error if the user is valid but does not exist", () => {
          const newComment = {
            username: "not-a-username",
            body: "testing, testing, 1 2 3.",
          };
          return request(app)
            .post("/api/reviews/1/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
              expect(body).toEqual({ msg: "not found" });
            });
        });
        it("POST: 404, review_id is valid but doesn't exist", () => {
          const newComment = {
            username: "mallionaire",
            body: "testing, testing, 1 2 3.",
          };
          return request(app)
            .post("/api/reviews/999/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
              expect(body).toEqual({
                msg: "not found",
              });
            });
        });
        it("POST: 400, review_id is invalid", () => {
          const newComment = {
            username: "mallionaire",
            body: "testing, testing, 1 2 3.",
          };
          return request(app)
            .post("/api/reviews/bananas/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
              expect(body).toEqual({
                msg: "bad request",
              });
            });
        });
      });
    });
  });
});
