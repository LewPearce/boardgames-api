const handle404 = (req, res, next) => {
  return res.status(404).send({ msg: "Path not found!" });
};

module.exports = { handle404 };
