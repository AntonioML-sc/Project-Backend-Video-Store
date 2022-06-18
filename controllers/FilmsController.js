
const { Film } = require('../models/index');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//UserController object declaration
const FilmsController = {};

FilmsController.getFilms = async (req, res) => {
    try {
        await Film.findAll()
            .then(data => {
                res.send(data);
            }).catch((error) => {
                res.send(error);
            });
    } catch (error) {
        res.send(error);
    }
};

FilmsController.getByGenre = async (req, res) => {

    let genres = req.params;
    let genre1 = genres.genre1;
    let [genre2, genre3] = ["", ""];
    if (genres.genre2 != undefined) {
        genre2 = genres.genre2;
    }
    if (genres.genre3 != undefined) {
        genre3 = genres.genre3;
    }

    let myQuery = `SELECT films.title AS Movie, films.year AS ReleaseYear, films.genre AS Genres
    FROM films
    WHERE films.genre LIKE '%${genre1}%' AND films.genre LIKE '%${genre2}%' AND films.genre LIKE '%${genre3}%'
    ORDER BY films.year DESC`;

    try {
        let search = await Film.sequelize.query(myQuery, {
            type: Film.sequelize.QueryTypes.SELECT
        });

        if (search != 0) {
            res.send(search);
        } else {
            res.send("There are no movies of the indicated genre");
        }
    } catch (error) {
        res.send(error);
    }
}

FilmsController.getByTitle = async (req, res) => {

    let title = req.params.title;

    let myQuery = `SELECT films.title AS Movie, films.year AS ReleaseYear, films.genre AS Genres, films.director AS Director,
    films.duration AS Duration, films.minAge AS RecomendedAge, films.synopsis AS Synopsis
    FROM films
    WHERE films.title LIKE '%${title}%'
    ORDER BY films.year DESC`;

    try {
        let search = await Film.sequelize.query(myQuery, {
            type: Film.sequelize.QueryTypes.SELECT
        });

        if (search != 0) {
            res.send(search);
        } else {
            res.send("There are no movies with the title provided");
        }
    } catch (error) {
        res.send(error);
    }
}

FilmsController.getByDirector = async (req, res) => {

    let director = req.params.director;

    let myQuery = `SELECT films.title AS Movie, films.year AS ReleaseYear, films.genre AS Genres, films.director AS Director,
    films.duration AS Duration, films.minAge AS RecomendedAge, films.synopsis AS Synopsis
    FROM films
    WHERE films.director LIKE '%${director}%'
    ORDER BY films.year DESC`;

    try {
        let search = await Film.sequelize.query(myQuery, {
            type: Film.sequelize.QueryTypes.SELECT
        });

        if (search != 0) {
            res.send(search);
        } else {
            res.send("There are no movies with the title provided");
        }
    } catch (error) {
        res.send(error);
    }
}

FilmsController.postFilm = async (req, res) => {

    let title = req.body.title;
    let year = req.body.year;
    let genre = req.body.genre;
    let price = req.body.price;
    let duration = req.body.duration;
    let director = req.body.director;
    let minAge = req.body.minAge;
    let synopsis = req.body.synopsis;
    let image = req.body.image;

    Film.create({
        title: title,
        year: year,
        genre: genre,
        price: price,
        duration: duration,
        director: director,
        minAge: minAge,
        synopsis: synopsis,
        image: image
    }).then(film => {
        console.log(film);
        res.send(`${film.title}, you have been added succesfully`);

    }).catch((error) => {
        res.send(error);
    });
};

FilmsController.getById = async (req, res) => {

    let filmId = req.body.id;

    try {
        await Film.findByPk(filmId).then(data => {
            res.send(data);
        }).catch((error) => {
            res.send(error);
        });
    } catch (error) {
        res.send(error);
    }
}

FilmsController.deleteFilm = async (req, res) => {

    let filmId = req.body.id;

    try {
        await Film.destroy({
            where: {
                id: filmId
            }
        }).then(count => {
            if (!count) {
                return res.status(404).send({ error: 'Film not found' });
            }
            res.send("Film deleted");
        }).catch((err) => {
            console.log(err);
        });
    } catch (error) {
        res.send(error);
    }
}

FilmsController.updateFilm = async (req, res) => {

    let filmId = req.params.id;

    try {
        await Film.update(req.body, {
            where: { id: filmId }
        }).then((elem) => {
            res.send(`The film with id ${filmId} has been edited`);
        }).catch(err => {
            console.log(err);
        });
    } catch (error) {
        res.send(error);
    }
}

//Export
module.exports = FilmsController;