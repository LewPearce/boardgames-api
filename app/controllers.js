const { fetchCategories, commentCounter } = require("./models");

const getCategories = (req, res, next) => {
  fetchCategories()
    .then((result) => res.status(200).send({ categories: result }))
    .catch((err) => {
      next(err);
    });
};

const getReviews = (req, res, next) => {
  commentCounter()
    .then((result) => res.status(200).send({ reviews: result }))
    .catch((err) => {
      next(err);
    });
};

module.exports = { getCategories, getReviews };
