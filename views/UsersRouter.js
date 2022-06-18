
const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/UsersController');

const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

//Endpoint-function links
router.get('/', isAdmin, UsersController.getUsers);
router.post('/register', UsersController.postUser);
router.post('/login', UsersController.loginUser);
router.post('/getByName', isAdmin, UsersController.getUserByName);
router.post('/getByEmail', isAdmin, UsersController.getUserByEmail);
router.get('/myAccount', auth, UsersController.getLoggedUser);

//Export
module.exports = router;