
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


UsersController.postUser = async (req, res) => {

    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phone;
    let password = bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds));    
    let address = req.body.address;
    let role = "user";

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
};

UsersController.loginUser = (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    User.findOne({
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
                    name:userFound.name,
                    email:userFound.email
                },
                token: token
            })
        } else {
            res.send("Usuario o password incorrectos");
        };

    }).catch(err => console.log(err));
};


//Export
module.exports = UsersController;
