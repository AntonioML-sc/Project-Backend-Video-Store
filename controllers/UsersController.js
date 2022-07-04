
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
            res.status(422).send("Any of the necessary data is missing or not valid"); // any of the values is not valid
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
                    res.status(201).send(`${user.dataValues.name} has been added succesfully to database`);
                } else {
                    res.status(409).send("Any of the necessary data is missing or not valid"); // email already exists
                }
            }).catch((error) => {
                res.status(500).send(error);
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
                res.status(401).send("User or password missing or not correct");
            } else if (bcrypt.compareSync(password, userFound.password)) {
                //In this point, we know that the email and password are ok
                const userInfo = {
                    "id": userFound.id,
                    "name": userFound.name,
                    "email": userFound.email,
                    "phone": userFound.phone,
                    "address": userFound.address,
                    "role": userFound.role,
                    "createdAt": userFound.createdAt,
                    "updatedAt": userFound.updatedAt
                }
                let token = jwt.sign({ user: userInfo }, authConfig.secret, {
                    expiresIn: authConfig.expires
                });
                let loginOKmessage = `Welcome again ${userFound.name}`
                res.status(200).json({
                    loginOKmessage,
                    user: {
                        name: userFound.name,
                        email: userFound.email
                    },
                    token: token
                })
            } else {
                res.status(401).send("User or password missing or not correct");
            };
        }).catch(err => console.log(err));
    } catch (error) {
        res.status(500).send(error);
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
                res.status(404).send("There is not a coincidence in the database");
            } else {
                res.status(200).send(userFound);
            };
        });
    } catch (error) {
        res.status(500).send(error);
    }
}

UsersController.getUserByEmail = async (req, res) => {

    let email = req.body.email;

    try {
        await User.findOne({
            where: { email: email }
        }).then(userFound => {
            if (!userFound) {
                res.status(404).send("This email is not in the database");
            } else {
                res.status(200).send(userFound);
            };
        });
    } catch (error) {
        res.status(500).send(error);
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
                res.status(404).send("User not found"); // this would never happen!
            } else {
                res.status(200).send(userFound);
            };
        });
    } catch (error) {
        res.status(500).send(error);
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
                return res.status(404).send({ error: 'User not found' });
            }
            res.status(204).send("user deleted");
        });
    } catch (error) {
        res.status(500).send(error);
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
            res.status(401).send("Any of the necessary data is missing or not valid");
        } else {
            await User.findOne({
                where: { email: body.email }
            }).then(userFound => {
                console.log("userFound", userFound);
                if ((userFound != null) && (userFound.id != body.id)) {
                    res.status(422).send("Any of the necessary data is missing or not valid"); // conflict
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
                            res.status(401).send("Any of the necessary data is missing or not valid");
                        } else {
                            res.status(204).send(`The user ${body.name} with id ${body.id} has been edited`);
                        }
                    }).catch(error => {
                        res.status(500).send(error);
                    });
                }
            });
        }
    } catch (error) {
        res.status(500).send(error);
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
            res.status(401).send("Any of the necessary data is missing or not valid"); // values not valid
        } else {
            await User.update({
                password: bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds)),
                phone: req.body.phone,
                address: req.body.address
            }, {
                where: { id: userId }
            }).then((elem) => {
                if (elem[0] == 0) {
                    res.status(404).send("Any of the necessary data is missing or not valid"); // not found (should never happen!)
                } else {
                    res.status(204).send(`${user.name}, you have modified your account successfully`);
                }
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

//Export
module.exports = UsersController;
