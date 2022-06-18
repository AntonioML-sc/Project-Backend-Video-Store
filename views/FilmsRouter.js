
const express = require('express');
const router = express.Router();

const FilmsController = require('../controllers/FilmsController');

const isAdmin = require("../middlewares/isAdmin");

//Endpoint-function links
router.get('/', FilmsController.getFilms);

//Export
module.exports = router;