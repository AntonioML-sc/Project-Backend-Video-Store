
const { Order } = require('../models/index');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let authConfig = require('../config/auth');

//UserController object declaration
const OrdersController = {};

OrdersController.getOrders = async (req, res) => {
    try {
        await Order.findAll()
            .then(data => {
                res.send(data);
            }).catch((error) => {
                res.send(error);
            });
    } catch (error) {
        res.send(error);
    }
};

OrdersController.getUserOrders = async (req, res) => {

    // pick the token
    let token = req.headers.authorization.split(' ')[1];
    // pick the user logged
    let { user } = jwt.decode(token, authConfig.secret);
    let userId = user.id;

    let myQuery = `SELECT users.name AS Client, films.title AS Movie, orders.createdAt AS FromDate, orders.returnDate AS UntilDate, orders.totalPrice AS Price
    FROM users
    INNER JOIN orders ON users.id = orders.userId
    INNER JOIN films ON films.id = orders.filmId
    WHERE users.id LIKE '${userId}'`;

    try {
        let search = await Order.sequelize.query(myQuery, {
            type: Order.sequelize.QueryTypes.SELECT
        });

        if (search != 0) {
            res.send(search);
        } else {
            res.send("The user specified has no registered rentals in our database");
        };
    } catch (error) {
        res.send(error);
    }
};

OrdersController.postOrder = async (req, res) => {
    // user logged
    // pick the token
    let token = req.headers.authorization.split(' ')[1];
    // pick the user logged
    let { user } = jwt.decode(token, authConfig.secret);

    let userId = user.id;
    let returnDate = req.body.returnDate;
    let filmId = req.body.filmId;
    let totalPrice = req.body.totalPrice;

    try {
        await Order.create({
            returnDate: returnDate,
            userId: userId,
            filmId: filmId,
            totalPrice: totalPrice
        }).then(rent => {
            res.send(`User ${user.name} has rented the film ${rent.filmId} until ${rent.returnDate}`);
        }).catch((error) => {
            res.send(error);
        });
    } catch (error) {
        res.send(error);
    }
};


OrdersController.deleteOrder = async (req, res) => {

    let orderId = req.body.id;

    try {
        await Order.destroy({
            where: {
                id: orderId
            }
        }).then(count => {
            if (!count) {
                return res.status(404).send({ error: 'Order not found' });
            }
            res.send("Order deleted");
        }).catch((error) => {
            res.send(error);
        });
    } catch (error) {
        res.send(error);
    }
}

OrdersController.updateOrder = async (req, res) => {

    let orderId = req.params.id;

    try {
        await Order.update(req.body, {
            where: { id: orderId }
        }).then((elem) => {
            res.send(`The rental with id${orderId} has been edited`);
        }).catch(error => {
            res.send(error);
        });
    } catch (error) {
        res.send(error);
    }
}


//Export
module.exports = OrdersController;