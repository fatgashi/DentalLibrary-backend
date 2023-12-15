const Book = require("../models/booksModel");
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const BooksController = {
    addBook: async (req,res) => {
        try {
            const { title, description, originalPrice, price, category, isbn, author, photoUrl } = req.body;

            const newBook = new Book ({
                title,
                description,
                originalPrice,
                price,
		category,
		isbn,
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
            const bookList = await Book.find({}).sort({ date: -1});
            if(!bookList) throw new Error("No Book list was found!");
            res.json(bookList);
        } catch (error) {
            res.status(500).json({message: 'Internal server error!'});
        }
    },

    countBooks: async (req,res) => {
        try {
            const bookCount = await Book.countDocuments();
            res.status(200).json(bookCount);
          } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
          }
    },

    getLatestBooks: async (req,res) => {
        try {
            const lastBooks = await Book.find({})
              .sort({ date: -1 }) // Sort by the 'date' field in descending order (most recent first)
              .limit(12); // Limit the result to 12 books
        
            res.json(lastBooks);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error!' });
          }
    },

    updateBook: async(req,res) => {
        
        try {
            const { id } = req.params;
            const { title, description, originalPrice, price, category, isbn, author, photoUrl } = req.body;
            const book = await Book.findById(id);

            if(title) book.title = title;

            if(description) book.description = description;

            if(originalPrice) book.originalPrice = originalPrice;

            if(price) book.price = price;

            if(category) book.category = category;

            if(isbn) book.isbn = isbn;

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

    searchBook: async (req,res) => {
        try {
            const searchQuery = req.query.title;
        
            // Use MongoDB's text search to find exact and partial title matches
            const books = await Book.find(
              { $text: { $search: searchQuery } },
              { score: { $meta: 'textScore' } }
            )
              .sort({ score: { $meta: 'textScore' } })
              .limit(10);
        
            // Additional logic for nearby matches
            if (books.length === 0) {
              const nearbyBooks = await Book.find({
                title: { $regex: new RegExp(searchQuery, 'i') },
              }).limit(10);
        
              return res.json({ books: nearbyBooks });
            }
        
            res.json({ books });
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
          }
    },

    uploadBook: async(req,res) => {
        const bookId = req.params.bookId;
        try{
            const book = await Book.findById(bookId);
      
            if (!book) {
            return res.status(404).json({ message: 'Book not found' });
            }
        
            const fileName = book.pdfFiles.split('\\').pop();
            // Assuming the book has a field called 'pdfFile' containing the file name
            const filePath = path.join(__dirname, '..', '..', 'uploads', fileName);
        
            // Use res.sendFile() to send the file
            res.sendFile(filePath);

        } catch (err) {
            res.status(500).json({message: "Internal server error!"});
        }
  
    },

    readBook: async (req,res) => {
        const bookId = req.params.bookId;
        try {
            const book = await Book.findById(bookId);

            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }

            const fileName = path.basename(book.pdfFiles);
            const filePath = path.join(__dirname, '..', '..', 'uploads', fileName);

            // Check if the file exists
            if (fs.existsSync(filePath)) {
                const fileStream = fs.createReadStream(filePath);

                const compress = zlib.createGzip();
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'inline; filename=' + fileName);
                res.setHeader('Content-Encoding', 'gzip');

                fileStream.pipe(compress).pipe(res);
            } else {
                res.status(404).send('File not found');
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "Internal server error!"});
        }
    },

    deleteBook: async (req,res) => {
        const { id } = req.params;
        try {
            const book = await Book.findById(id);

            if (!book) {
            return res.status(404).json({ message: 'Book not found' });
            }

            const fileName = path.basename(book.pdfFiles);

            if(fileName != undefined || fileName != null){
                const filePath = path.join(__dirname, '..', '..', 'uploads', fileName);
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
