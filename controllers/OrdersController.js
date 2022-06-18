
const { Order } = require('../models/index');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let authConfig = require('../config/auth');

//UserController object declaration
const OrdersController = {};

OrdersController.getOrders = (req, res) => {
    Order.findAll()
    .then(data => {
    
        res.send(data)
    });
};


//Export
module.exports = OrdersController;