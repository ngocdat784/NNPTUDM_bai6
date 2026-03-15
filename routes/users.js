var express = require('express');
var router = express.Router();

const { checkLogin } = require('../utils/auth');
const { checkAdmin, checkModOrAdmin } = require('../utils/permission');

let users = [];

/* GET ALL USERS (mod + admin) */
router.get('/', checkLogin, checkModOrAdmin, function(req, res) {

  let result = users.filter(u => !u.isDeleted);

  res.send(result);
});


/* GET USER BY ID (mod + admin) */
router.get('/:id', checkLogin, checkModOrAdmin, function(req, res) {

  let user = users.find(u => u.id == req.params.id && !u.isDeleted);

  if (!user) {
    return res.status(404).send({
      message: "User not found"
    });
  }

  res.send(user);
});


/* CREATE USER (admin only) */
router.post('/', checkLogin, checkAdmin, function(req, res) {

  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).send({
      message: "Thiếu thông tin"
    });
  }

  let newUser = {
    id: users.length + 1 + "",
    username,
    password,
    email,
    status: false,
    role: "user",
    loginCount: 0,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  users.push(newUser);

  res.send(newUser);
});


/* UPDATE USER (admin only) */
router.put('/:id', checkLogin, checkAdmin, function(req, res) {

  let user = users.find(u => u.id == req.params.id && !u.isDeleted);

  if (!user) {
    return res.status(404).send({
      message: "User not found"
    });
  }

  Object.assign(user, req.body);

  user.updatedAt = new Date();

  res.send(user);
});


/* DELETE USER (admin only - soft delete) */
router.delete('/:id', checkLogin, checkAdmin, function(req, res) {

  let user = users.find(u => u.id == req.params.id);

  if (!user) {
    return res.status(404).send({
      message: "User not found"
    });
  }

  user.isDeleted = true;

  res.send({
    message: "User deleted"
  });
});

module.exports = router;