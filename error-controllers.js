
const handle404 = (err, req, res, next) => {
  return res.status(404).send("Server Error!");
};

module.exports = {handle404}