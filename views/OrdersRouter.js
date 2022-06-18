
const express = require('express');
const router = express.Router();

const OrdersController = require('../controllers/OrdersController');

const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

//Endpoint-function links
router.get('/', OrdersController.getOrders);

//Export
module.exports = router;