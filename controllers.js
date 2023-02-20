const { fetchCategories } = require("./modules");

const getCategories = (req, res, next) => {
  fetchCategories().then((result) =>
    res.status(200).send({ categories: result })
  ).catch(next)
};

module.exports = { getCategories };
