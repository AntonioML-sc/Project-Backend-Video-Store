
const { User } = require('../models/index');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let authConfig = require('../config/auth');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const utils = require('../utils');

//UserController object declaration
const UsersController = {};

UsersController.getUsers = async (req, res) => {
    try {
        await User.findAll({
            attributes: {
                exclude: ['password']
            },
            order: [['createdAt', 'DESC']]
        }).then(data => {
            res.status(200).send(data);
        })
    } catch (error) {
        res.status(500).json({ msg: "An error occurred during search", error });;
    }
};

UsersController.postUser = async (req, res) => {

    let body = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        address: req.body.address,
        role: "user"
    }

    try {
        // tests the data provided by using regexp in utils.js
        if (!utils.validate(body)) {
            res.send("Any of the necessary data is missing or not valid");
        } else {
            await User.findOrCreate({
                where: {
                    email: body.email
                },
                defaults: {
                    name: req.body.name,
                    phone: req.body.phone,
                    password: bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds)),
                    address: req.body.address,
                    role: "user"
                }
            }).then(([user, created]) => {
                if (created) {
                    res.send(`${user.dataValues.name} has been added succesfully to database`);
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

UsersController.loginUser = async (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    try {
        await User.findOne({
            where: { email: email }
        }).then(userFound => {
            if (!userFound) {
                res.send("User or password missing or not correct");
            } else if (bcrypt.compareSync(password, userFound.password)) {
                //In this point, we know that the email and password are ok
                let token = jwt.sign({ user: userFound }, authConfig.secret, {
                    expiresIn: authConfig.expires
                });
                let loginOKmessage = `Welcome again ${userFound.name}`
                res.json({
                    loginOKmessage,
                    user: {
                        name: userFound.name,
                        email: userFound.email
                    },
                    token: token
                })
            } else {
                res.send("Usuario o password incorrectos");
            };
        }).catch(err => console.log(err));
    } catch (error) {
        res.send(error);
    }
};

UsersController.getUserByName = async (req, res) => {

    let name = req.body.name;

    try {
        await User.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`
                }
            }
        }).then(userFound => {
            if (!userFound) {
                res.send("There is not a coincidence in the database");
            } else {
                res.send(userFound);
            };
        }).catch(error => {
            console.log(error)
        });
    } catch (error) {
        res.send(error);
    }
}

UsersController.getUserByEmail = async (req, res) => {

    let email = req.body.email;

    try {
        await User.findOne({
            where: { email: email }
        }).then(userFound => {
            if (!userFound) {
                res.send("This email is not in the database");
            } else {
                res.send(userFound);
            };
        }).catch(err => console.log(err));
    } catch (error) {
        res.send(error);
    }
}

UsersController.getLoggedUser = async (req, res) => {

    // pick the token
    let token = req.headers.authorization.split(' ')[1];
    // pick the user logged
    let { user } = jwt.decode(token, authConfig.secret);

    try {
        await User.findOne({
            where: { id: user.id },
            attributes: ['name', 'email', 'phone', 'address']
        }).then(userFound => {
            if (!userFound) {
                res.send("User not found");
            } else {
                res.send(userFound);
            };
        }).catch(error => {
            res.send(error)
        });
    } catch (error) {
        res.send(error);
    }
}

UsersController.deleteUser = async (req, res) => {

    let userId = req.body.id;

    try {
        await User.destroy({
            where: {
                id: userId
            }
        }).then(count => {
            if (!count) {
                return res.status(404).send({ error: 'No not found' });
            }
            res.send("user deleted");
        }).catch((error) => {
            res.send(error);
        });
    } catch (error) {
        res.send(error);
    }
}

UsersController.updateUser = async (req, res) => {
    // admin only
    let body = {
        id: req.body.id,
        name: req.body.name,
        password: req.body.password,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address
    };

    try {
        if (!utils.validate(body)) {
            res.send("Any of the necessary data is missing or not valid");
        } else {
            await User.findOne({
                where: { email: body.email }
            }).then(userFound => {
                console.log("userFound", userFound);
                if ((userFound != null) && (userFound.id != body.id)) {
                    res.send("Any of the necessary data is missing or not valid");
                } else {
                    User.update(
                        {
                            name: req.body.name,
                            password: bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds)),
                            phone: req.body.phone,
                            email: req.body.email,
                            address: req.body.address
                        }, {
                        where: { id: body.id }
                    }).then((elem) => {
                        if (elem[0] == 0) {
                            res.send("Any of the necessary data is missing or not valid");
                        } else {
                            res.send(`The user ${body.name} with id ${body.id} has been edited`);
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

UsersController.updateLoggedUser = async (req, res) => {
    // logged user
    // pick the token
    let token = req.headers.authorization.split(' ')[1];
    // pick the user logged
    let { user } = jwt.decode(token, authConfig.secret);

    let userId = user.id;

    // Changing name, email and id and is not allowed
    let body = {
        password: req.body.password,
        phone: req.body.phone,
        address: req.body.address
    };

    try {
        if (!utils.validate(body)) {
            res.send("Any of the necessary data is missing or not valid");
        } else {
            await User.update({
                password: bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds)),
                phone: req.body.phone,
                address: req.body.address
            }, {
                where: { id: userId }
            }).then((elem) => {
                if (elem[0] == 0) {
                    res.send("Any of the necessary data is missing or not valid");
                } else {
                    res.send(`${user.name}, you have modified your account successfully`);
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
module.exports = UsersController;
