const express = require("express");
const { getCategories } = require("./controllers");

const app = express();

app.get("/api/categories", getCategories);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server Error!");
});

module.exports = app;
