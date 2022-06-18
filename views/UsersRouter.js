
const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/UsersController');

const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

//Endpoint-function links
router.get('/', UsersController.getUsers);

//Export
module.exports = router;