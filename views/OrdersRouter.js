
const express = require('express');
const router = express.Router();

const OrdersController = require('../controllers/OrdersController');

const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

//Endpoint-function links
router.get('/', isAdmin, OrdersController.getOrders);
router.get('/userOrders', auth, OrdersController.getUserOrders);
router.post('/getByEmail', isAdmin, OrdersController.getByEmail);
router.post('/register', auth, OrdersController.postOrder);
router.delete('/delete', isAdmin, OrdersController.deleteOrder);
router.put('/update/:id', isAdmin, OrdersController.updateOrder);

//Export
module.exports = router;