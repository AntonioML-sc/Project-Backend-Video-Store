
const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/UsersController');

const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

//Endpoint-function links
router.get('/', isAdmin, UsersController.getUsers);
router.post('/register', UsersController.postUser);
router.post('/login', UsersController.loginUser);

//Export
module.exports = router;