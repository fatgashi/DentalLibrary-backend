const express = require('express');
const CartController = require('../controllers/CartController');

const cartRouter = express.Router();

cartRouter.post('/addBookToCart', CartController.addBookToCart);
cartRouter.get('/getBooksFromCart/:userId', CartController.getBooksFromCart);
cartRouter.get('/checkCart/:userId/:bookId', CartController.checkIfBookIsAddedToCart);
cartRouter.delete('/deleteBookFromCart/:userId/:bookId', CartController.deleteBookFromCart);

module.exports = cartRouter;