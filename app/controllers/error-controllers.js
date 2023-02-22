const handle400 = (err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "bad request" });
  } else if (err.code === "23503") {
    return res
      .status(404)
      .send({ msg: `User '${req.body.username}' not found!` });
  } else next(err);
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
};

const handle404 = (req, res, next) => {
  res.status(404).send({ msg: "Path not found!" });
};

module.exports = { handle404, handle400, handleCustomErrors };
