const express = require('express');
const BooksController = require('../controllers/BooksController');
const booksRouter = express.Router();
const { isAdmin } = require('../middlewares/authorization');
const upload = require('../middlewares/upload');
const { protectUploads } = require('../middlewares/protectUploads');

booksRouter.get('/getAllBooks', BooksController.getAllBooks);
booksRouter.get('/getBook/:id', BooksController.getBook);
booksRouter.post('/addBook', upload.single('pdfFiles'), isAdmin, BooksController.addBook);
booksRouter.post('/updateBook/:id', isAdmin, BooksController.updateBook);
booksRouter.get('/searchBook', BooksController.searchBook);
booksRouter.get('/getLatestBooks', BooksController.getLatestBooks);
booksRouter.delete('/deleteBook/:id', isAdmin, BooksController.deleteBook);
booksRouter.get('/uploads/:bookId', protectUploads, BooksController.uploadBook)

module.exports = booksRouter;
