const { findUsers } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  return findUsers()
    .then((users) => {
     res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
