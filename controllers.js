const { fetchCategories } = require("./modules");

const getCategories = (req, res, next) => {
  fetchCategories().then((result) =>
    res.status(200).send({ categories: result })
  );
};

module.exports = { getCategories };
