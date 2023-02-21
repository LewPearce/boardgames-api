const { fetchReviews } = require("../models/reviews_models");

const getReviews = (req, res, next) => {
  fetchReviews()
    .then((result) => res.status(200).send({ reviews: result }))
    .catch((err) => {
      next(err);
    });
};

module.exports = { getReviews };
