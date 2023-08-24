const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const User = require('../models/usersModel');

const PaymentController = {
    createCheckoutSession: async (req, res) => {
        try {
            const { userId } = req.body;

            const user = await User.findById(userId).populate('cart');
        
            if (!user) {
              return res.status(404).json({ message: 'User not found! ' });
            }


            const cartBooks = user.cart

            const lineItems = cartBooks.map(book => ({
                price_data: {
                  currency: 'eur', // Change to appropriate currency
                  product_data: {
                    name: book.title, // Replace with book title
                    description: book.description, // Replace with book description
                    images: [book.photoUrl], // Replace with book image URL
                  },
                  unit_amount: book.price * 100, // Convert to cents
                },
                quantity: 1, // Assuming each book is added once
              }));

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: `${process.env.CLIENT_URL}`,
                cancel_url: `${process.env.CLIENT_URL}`,
              });
            
            res.json({url: session.url});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
}

module.exports = PaymentController;