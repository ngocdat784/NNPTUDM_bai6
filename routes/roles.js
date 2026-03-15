var express = require('express');
var router = express.Router();

const { checkLogin } = require('../utils/auth');
const { checkAdmin, checkModOrAdmin } = require('../utils/permission');

let roles = [];


/* GET ALL ROLES (mod + admin) */
router.get('/', checkLogin, checkModOrAdmin, function(req, res) {

  let result = roles.filter(r => !r.isDeleted);

  res.send(result);
});


/* GET ROLE BY ID (mod + admin) */
router.get('/:id', checkLogin, checkModOrAdmin, function(req, res) {

  let role = roles.find(r => r.id == req.params.id && !r.isDeleted);

  if (!role) {
    return res.status(404).send({
      message: "Role not found"
    });
  }

  res.send(role);
});


/* CREATE ROLE (admin only) */
router.post('/', checkLogin, checkAdmin, function(req, res) {

  const { name, description } = req.body;

  if (!name) {
    return res.status(400).send({
      message: "Name is required"
    });
  }

  let existed = roles.find(r => r.name === name);

  if (existed) {
    return res.status(400).send({
      message: "Role already exists"
    });
  }

  let newRole = {
    id: roles.length + 1 + "",
    name: name,
    description: description || "",
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  roles.push(newRole);

  res.send(newRole);
});


/* UPDATE ROLE (admin only) */
router.put('/:id', checkLogin, checkAdmin, function(req, res) {

  let role = roles.find(r => r.id == req.params.id && !r.isDeleted);

  if (!role) {
    return res.status(404).send({
      message: "Role not found"
    });
  }

  Object.assign(role, req.body);

  role.updatedAt = new Date();

  res.send(role);
});


/* DELETE ROLE (admin only - soft delete) */
router.delete('/:id', checkLogin, checkAdmin, function(req, res) {

  let role = roles.find(r => r.id == req.params.id);

  if (!role) {
    return res.status(404).send({
      message: "Role not found"
    });
  }

  role.isDeleted = true;

  res.send({
    message: "Role deleted"
  });
});

module.exports = router;