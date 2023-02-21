const express = require("express");
const { getCategories } = require("./controllers/categories_controllers");
const { getReviews } = require("./controllers/reviews_constrollers");
const { handle404 } = require("./controllers/error-controllers");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.use(handle404);

module.exports = app;
