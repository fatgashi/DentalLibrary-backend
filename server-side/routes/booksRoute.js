const express = require('express');
const BooksController = require('../controllers/BooksController');
const booksRouter = express.Router();
const { isAdmin } = require('../middlewares/authorization');


booksRouter.get('/getAllBooks', BooksController.getAllBooks);
booksRouter.get('/getBook/:id', BooksController.getBook);
booksRouter.post('/addBook', isAdmin, BooksController.addBook);
booksRouter.post('/updateBook/:id', isAdmin, BooksController.updateBook);
booksRouter.delete('/deleteBook/:id', isAdmin, BooksController.deleteBook);


module.exports = booksRouter;
