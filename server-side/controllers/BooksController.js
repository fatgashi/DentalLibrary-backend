const Book = require("../models/booksModel");

const BooksController = {
    addBook: async (req,res) => {
        try {
            const { title, description, price, author, photoUrl } = req.body;

            const newBook = new Book ({
                title,
                description,
                price,
                author,
                photoUrl
            });

            res.status(201).json({message: "Book registered successfuly!"});
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    
    
}

module.exports = BooksController;