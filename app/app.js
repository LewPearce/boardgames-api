const express = require("express");
const { getCategories, getReviews } = require("./controllers");
const { handle404 } = require("./error-controllers");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.use(handle404);

module.exports = app;
