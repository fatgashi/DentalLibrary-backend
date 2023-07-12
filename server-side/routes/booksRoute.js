const express = require('express');
const BooksController = require('../controllers/BooksController');
const booksRouter = express.Router();


booksRouter.post('/addBook', BooksController.addBook);

module.exports = booksRouter;
