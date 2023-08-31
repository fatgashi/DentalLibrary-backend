const Book = require("../models/booksModel");
const fs = require('fs');
const path = require('path');

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

            if(req.file){
                newBook.pdfFiles = req.file.path
            }

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
        
        try {
            const { id } = req.params;
            const { title, description, price, author, photoUrl } = req.body;
            const book = await Book.findById(id);

            if(title) book.title = title;

            if(description) book.description = description;

            if(price) book.price = price;
            
            if(author) book.author = author;

            if(photoUrl) book.photoUrl = photoUrl;

            if(req.files && req.files.length > 0){
                book.pdfFiles = req.files[0].path;
            }

            const updatedBook = await book.save();

            res.json(updatedBook);
            
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
            const book = await Book.findById(id);

            if (!book) {
            return res.status(404).json({ message: 'Book not found' });
            }
            
            if(book.pdfFiles != undefined || book.pdfFiles != null){
                const filePath = path.resolve(__dirname, '..', '..', book.pdfFiles);
                const fileExists = fs.existsSync(filePath);
                if(fileExists){
                    fs.unlinkSync(filePath); // Delete the file
                }
            }


            

            // Delete the book from the database
            await Book.findByIdAndDelete(id);
            res.status(200).json({
                message: 'Book deleted successfully',
                book: book
            });

        } catch (error) {
            res.status(500).json({message: error.message});
        }    
    },
    
    
}

module.exports = BooksController;