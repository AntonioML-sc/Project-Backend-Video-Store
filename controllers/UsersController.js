
const { User } = require('../models/index');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let authConfig = require('../config/auth');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//UserController object declaration
const UsersController = {};

UsersController.getUsers = async (req, res) => {
    try {
        await User.findAll({
            attributes: {
                exclude: ['password']
            }
        }).then(data => {
            res.send(data)
        }).catch((error) => {
            res.send(error);
        });
    } catch (error) {
        res.send(error);
    }
};


UsersController.postUser = async (req, res) => {

    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phone;
    let password = bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds));
    let address = req.body.address;
    let role = "user";

    try {
        await User.create({
            name: name,
            password: password,
            phone: phone,
            email: email,
            address: address,
            role: role
        }).then(user => {
            res.send(`${user.name} has been added succesfully to database`);

        }).catch((error) => {
            res.send(error);
        });
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

                console.log(token);

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
        }).catch(err => console.log(err));
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
            attributes: {
                exclude: ['password', 'id']
            }
        }).then(userFound => {
            if (!userFound) {
                res.send("User not found");
            } else {
                res.json({
                    user: {
                        name: userFound.name,
                        email: userFound.email,
                        phone: userFound.phone,
                        address: userFound.address
                    }
                });
            };
        }).catch(err => console.log(err));
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
        }).catch((err) => {
            console.log(err);
        });
    } catch (error) {
        res.send(error);
    }
}

UsersController.updateUser = async (req, res) => {
    // admin only
    let userId = req.params.id;

    let body = {
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds)),
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address
    };

    try {
        await User.update(body, {
            where: { id: userId }
        }).then((elem) => {
            res.send(`The user with id ${userId} has been edited`);
        }).catch(err => {
            console.log(err);
        });
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

    // Changing name and id and is not allowed
    let body = {
        password: bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds)),
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address
    };

    try {
        await User.update(body, {
            where: { id: userId }
        }).then((elem) => {
            res.send(`${user.name}, you have modified your account successfully`);
        }).catch(err => {
            console.log(err);
        });
    } catch (error) {
        res.send(error);
    }
}


//Export
module.exports = UsersController;
