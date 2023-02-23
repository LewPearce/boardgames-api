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
//   describe("/api/users", () => {
//     it("GET: 200, returns an array of all users with a username, name and avatar url", () => {
//       return request(app)
//         .get("/api/users")
//         .expect(200)
//         .then(({ body }) => {
//           body.users.forEach((user) =>
//             expect(user).toEqual({ name: 380928309 })
//           );
//         });
//     });
//   });
// });
