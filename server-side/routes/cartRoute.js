const express = require('express');
const passport = require('passport');
const CartController = require('../controllers/CartController');

const cartRouter = express.Router();

cartRouter.post('/addBookToCart', CartController.addBookToCart);
cartRouter.get('/getBooksFromCart', passport.authenticate('jwt', { session: false }), CartController.getBooksFromCart);
cartRouter.get('/checkCart/:userId/:bookId', CartController.checkIfBookIsAddedToCart);
cartRouter.delete('/deleteBookFromCart/:userId/:bookId', CartController.deleteBookFromCart);

module.exports = cartRouter;