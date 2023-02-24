const express = require("express");
const { getCategories } = require("./controllers/categories_controllers");
const { getUsers } = require("./controllers/users_controllers");
const {
  getReviews,
  getReviewByID,
  postComment,
  getCommentsByReview,
  patchVotes,
} = require("./controllers/reviews_constrollers");
const {
  handle404,
  handle400,
  handleCustomErrors,
} = require("./controllers/error-controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/users", getUsers);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewByID);

app.get("/api/reviews/:review_id/comments", getCommentsByReview);

app.patch("/api/reviews/:review_id", patchVotes);

app.post("/api/reviews/:review_id/comments", postComment);

app.use(handle400);
app.use(handle404);
app.use(handleCustomErrors);

module.exports = app;
