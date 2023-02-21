const { fetchCategories } = require("../models/categories_models");

const getCategories = (req, res, next) => {
  fetchCategories()
    .then((result) => res.status(200).send({ categories: result }))
    .catch((err) => {
      next(err);
    });
};

module.exports = { getCategories };
