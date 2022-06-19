
const express = require('express');
const router = express.Router();

const FilmsController = require('../controllers/FilmsController');

const isAdmin = require("../middlewares/isAdmin");

//Endpoint-function links
router.get('/', FilmsController.getFilms);
router.get('/getByGenre/:genre1', FilmsController.getByGenre);
router.get('/getByGenre/:genre1/:genre2', FilmsController.getByGenre);
router.get('/getByGenre/:genre1/:genre2/:genre3', FilmsController.getByGenre);
router.get('/getById', isAdmin, FilmsController.getById);
router.get('/getByTitle/:title', FilmsController.getByTitle);
router.get('/getByDirector/:director', FilmsController.getByDirector);
router.post('/register', isAdmin, FilmsController.registerFilm);
router.delete('/delete', isAdmin, FilmsController.deleteFilm);
router.put('/update', isAdmin, FilmsController.updateFilm);

//Export
module.exports = router;