const {
  fetchReviews,
  fetchReviewByID,
  fetchCommentsByReview,
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

const getCommentsByReview = (req, res, next) => {
  const commentPromise = fetchCommentsByReview(req);
  const reviewPromise = fetchReviewByID(req);
  return Promise.all([commentPromise, reviewPromise])
    .then(([result]) => res.status(200).send({ comments: result }))
    .catch((err) => {
      next(err);
    });
};

module.exports = { getReviews, getReviewByID, getCommentsByReview };
