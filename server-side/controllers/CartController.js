const Book = require('../models/booksModel');
const User = require('../models/usersModel');

const CartController = {
    addBookToCart: async (req,res) => {
        try {
            const { userId, bookId } = req.body;
        
            // Find the user by _id
            const user = await User.findById(userId);
        
            if (!user) {
              return res.status(404).json({ message: 'User not found! ' });
            }

            if (user.cart.includes(bookId)) {
                return res.status(400).json({ message: 'Book already has added to cart! ' });
            }

            if(user.purchasedBooks.includes(bookId)) {
              return res.status(400).json({message: 'Book already purchased !'});
            }
        
            // Find the book by _id
            const book = await Book.findById(bookId);
        
            if (!book) {
              return res.status(404).json({ message: 'Book not found! ' });
            }
        
            // Add the book's _id to the user's cart
            user.cart.push(bookId);
            await user.save();
        
            res.json({ message: 'Book added to cart!' });
          } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
          }
    },

    getBooksFromCart: async (req, res) => {
        try {
            const userId = req.params.userId;
        
            // Find the user by _id
            const user = await User.findById(userId).populate('cart');
        
            if (!user) {
              return res.status(404).json({ message: 'User not found! ' });
            }
        
            // Retrieve the books from the user's cart
            const cartBooks = user.cart;
        
            res.json(cartBooks);
          } catch (error) {
            res.status(500).json({ message: 'Internal server error!' });
          }
    },

    checkIfBookIsAddedToCart: async (req, res) => {
      try {
        const userId = req.params.userId;
        const bookId = req.params.bookId;
  
        const user = await User.findById(userId);
  
        if(!user) {
          return res.status(404).json({ message: 'User not found! '});
        }
  
        if(user.cart.includes(bookId)){
          return res.json({cart: true});
        }
  
        res.json({cart: false});

      } catch(error) {
        res.status(500).json({message: 'Internal server error!'});
      }

      
    },

    deleteBookFromCart: async (req,res) => {
        try {
            const userId = req.params.userId;
            const bookId = req.params.bookId;
        
            // Find the user by _id
            const user = await User.findById(userId);
        
            if (!user) {
              return res.status(404).json({ message: 'User not found! ' });
            }
        
            // Remove the book's _id from the user's cart
            user.cart.pull(bookId);
            await user.save();
        
            res.json({ message: 'Book removed from cart! ' });
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
          }
    }
}


module.exports = CartController;