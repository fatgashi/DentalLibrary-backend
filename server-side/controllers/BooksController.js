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

            await newBook.save();

            res.status(201).json({message: "Book registered successfuly!"});
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getAllBooks: async (req,res) => {
        try {
            const bookList = await Book.find();
            if(!bookList) throw new Error("No Book list was found!");
            const sorted = bookList.sort((a,b) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            });
            res.json(sorted);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    },

    updateBook: async(req,res) => {
        const { id } = req.params;

        try {
            const response = await Book.findByIdAndUpdate(id, req.body);
            if(!response) throw new Error('Something went wrong !');
            const updated = { ...response._doc, ...req.body}
            res.status(200).json(updated);
            
        } catch(error){
            res.status(500).json({message: error.message});
            
        }
    },

    getBook: async (req,res) => {
        const { id } = req.params;
        try {
            const book = await Book.findById(id);
            if(!book) throw new Error("Book not found!");
            res.json(book);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    },

    deleteBook: async (req,res) => {
        const { id } = req.params;
        try {
            const removed = await Book.findByIdAndDelete(id);
            if(!removed) throw new Error('Book was not found !');
            res.status(200).json({
                message: 'Book deleted successfully',
                book: removed
            });

        } catch (error) {
            res.status(500).json({message: error.message});
        }    
    },
    
    
}

module.exports = BooksController;