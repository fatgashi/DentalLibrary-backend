const passport = require('passport');
const Book = require('../models/booksModel');

const protectUploads = (req, res, next) => {
    const bookId = req.params.bookId;
    passport.authenticate('jwt', { session: false }, async (err, user) => {
        if (err || !user) {
          return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;

        const purchasedBook = user.purchasedBooks.find(book => book.book.toString() === bookId);
        
        if(purchasedBook){
            next();
        } else {
            return res.status(403).json({ message: 'Access denied. Book not purchased.' });
        }
        
      })(req, res, next);

}

module.exports = {
    protectUploads
}