const {
  fetchReviews,
  fetchReviewByID,
  addComment,
} = require("../models/reviews_models");

const getReviews = (req, res, next) => {
  fetchReviews()
    .then((result) => res.status(200).send({ reviews: result }))
    .catch((err) => {
      next(err);
    });
};

const getReviewByID = (req, res, next) => {
  fetchReviewByID(req)
    .then((result) => res.status(200).send({ review: result }))
    .catch((err) => {
      next(err);
    });
};

const postComment = (req, res, next) => {
  addComment(req)
    .then((result) => res.status(201).send({ new_comment: result }))
    .catch((err) => {
      next(err);
    });
};

module.exports = { getReviews, getReviewByID, postComment };
