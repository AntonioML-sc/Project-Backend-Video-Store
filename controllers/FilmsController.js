
const { Film } = require('../models/index');

const utils = require('../utils');

//UserController object declaration
const FilmsController = {};

FilmsController.getFilms = async (req, res) => {
    try {
        await Film.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            order: [['year', 'DESC'], ['title']]
        })
            .then(data => {
                res.status(200).send(data);
            })
    } catch (error) {
        res.status(500).send(error);
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

    let myQuery = `SELECT *
    FROM films
    WHERE films.genre LIKE '%${genre1}%' AND films.genre LIKE '%${genre2}%' AND films.genre LIKE '%${genre3}%'
    ORDER BY films.year DESC`;

    try {
        let search = await Film.sequelize.query(myQuery, {
            type: Film.sequelize.QueryTypes.SELECT
        });

        if (search != 0) {
            res.status(200).send(search);
        } else {
            res.status(404).send(search);
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

FilmsController.getByGenre2 = async (req, res) => {

    let genres = req.params;
    let genre1 = genres.genre1;
    let [genre2, genre3] = ["", ""];
    if (genres.genre2 != undefined) {
        genre2 = genres.genre2;
    }
    if (genres.genre3 != undefined) {
        genre3 = genres.genre3;
    }

    let myQuery = `SELECT films.title AS title, films.year AS ReleaseYear, films.genre AS Genres
    FROM films
    WHERE films.genre LIKE '%${genre1}%' AND films.genre LIKE '%${genre2}%' AND films.genre LIKE '%${genre3}%'
    ORDER BY films.year DESC`;

    try {
        let search = await Film.sequelize.query(myQuery, {
            type: Film.sequelize.QueryTypes.SELECT
        });

        if (search != 0) {
            res.status(200).send(search);
        } else {
            res.status(404).send("There are no movies of the indicated genre");
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

FilmsController.getByTitle = async (req, res) => {

    let title = req.params.title;

    let myQuery = `SELECT *
    FROM films
    WHERE films.title LIKE '%${title}%'
    ORDER BY films.year DESC`;

    try {
        let search = await Film.sequelize.query(myQuery, {
            type: Film.sequelize.QueryTypes.SELECT
        });

        if (search != 0) {
            res.status(200).send(search);
        } else {
            res.status(404).send(search);
        }
    } catch (error) {
        res.send(error);
    }
}

FilmsController.getByTitle2 = async (req, res) => {

    let title = req.params.title;

    let myQuery = `SELECT films.title AS title, films.year AS ReleaseYear, films.genre AS Genres, films.director AS Director,
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

    let myQuery = `SELECT films.title AS title, films.year AS ReleaseYear, films.genre AS Genres, films.director AS Director,
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
            res.send("There are no movies of this director");
        }
    } catch (error) {
        res.send(error);
    }
}

FilmsController.registerFilm = async (req, res) => {

    let body = {
        title: req.body.title,
        year: req.body.year,
        genre: req.body.genre,
        price: req.body.price,
        duration: req.body.duration,
        director: req.body.director,
        minAge: req.body.minAge,
        synopsis: req.body.synopsis,
        image: req.body.image
    }

    try {
        if (!utils.validate(body)) {
            res.send("Any of the necessary data is missing or not valid");
        } else {
            await Film.findOrCreate({
                where: {
                    title: body.title
                },
                defaults: body
            }).then(([film, created]) => {
                if (created) {
                    res.send(`${film.dataValues.title} has been added succesfully to database`);
                } else {
                    res.send("Any of the necessary data is missing or not valid");
                }
            }).catch((error) => {
                res.send(error);
            });
        }
    } catch (error) {
        res.send(error);
    }
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
        }).catch((error) => {
            res.send(error);
        });
    } catch (error) {
        res.send(error);
    }
}

FilmsController.updateFilm = async (req, res) => {

    let filmId = req.body.id;

    let body = {
        title: req.body.title,
        year: req.body.year,
        genre: req.body.genre,
        price: req.body.price,
        duration: req.body.duration,
        director: req.body.director,
        minAge: req.body.minAge,
        synopsis: req.body.synopsis,
        image: req.body.image
    }

    try {
        if ((!utils.validate(body)) || (!utils.validate({"id": filmId}))) {
            res.send("Any of the necessary data is missing or not valid");
        } else {
            await Film.findOne({
                where: { title: body.title }
            }).then(filmFound => {
                if ((filmFound != null) && (filmFound.id != filmId)) {
                    res.send("Any of the necessary data is missing or not valid 2");
                } else {
                    Film.update(body, {
                        where: { id: filmId }
                    }).then((elem) => {
                        if (elem[0] == 1) {
                            res.send(`The film ${body.title} with id ${filmId} has been edited`);
                        } else {
                            res.send("Any of the necessary data is missing or not valid 3");
                        }
                    }).catch(error => {
                        res.send(error);
                    });
                }
            }).catch(error => {
                res.send(error);
            });
        }
    } catch (error) {
        res.send(error);
    }
}

//Export
module.exports = FilmsController;