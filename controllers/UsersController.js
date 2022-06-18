
const { User } = require('../models/index');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let authConfig = require('../config/auth');

//UserController object declaration
const UsersController = {};

UsersController.getUsers = (req, res) => {
    User.findAll({
        attributes: {
            exclude: ['password']
        }
    }).then(data => {
        res.send(data)
    }).catch((error) => {
        res.send(error);
    });
};


//Export
module.exports = UsersController;
