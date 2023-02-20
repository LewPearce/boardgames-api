const express = require("express");
const { getCategories } = require("./controllers");
const { handle404 } = require("./error-controllers");

const app = express();

app.get("/api/categories", getCategories);

app.use(handle404);

module.exports = app;
