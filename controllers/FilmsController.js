
const { Film } = require('../models/index');

//UserController object declaration
const FilmsController = {};

FilmsController.getFilms = (req, res) => {
    Film.findAll()
    .then(data => {
        res.send(data);
    }).catch((error) => {
        res.send(error);
    });
};


//Export
module.exports = FilmsController;