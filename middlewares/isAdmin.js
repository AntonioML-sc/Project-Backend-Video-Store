
//Imports
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

//Export logic
module.exports = (req, res, next) => {
    // pick the token
    let token = req.headers.authorization.split(' ')[1];
    // pick the user logged. It must be 'user' because we named it 'user' in UsersController.login
    let {user} = jwt.decode(token, authConfig.secret);
    try {
        if (user.role == "admin") {
            next();
        } else {
            res.status(403).send({ msg: `User is not allowed.` });
        }
    } catch (error) {
        res.status(400).json({
            msg: `Something bad happened, try to check the infos you put and try again.`,
            error: error
        });
    }
};