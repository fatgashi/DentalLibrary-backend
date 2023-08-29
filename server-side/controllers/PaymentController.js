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
                client_reference_id: userId,
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
    },

    webhook: async (req,res) => {
      const sig = req.headers['stripe-signature'];
      const endpointSecret = process.env.ENDPOINT_SECRET;

      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.client_reference_id;

        const user = await User.findById(userId);

        const purchasedBooksIds = user.cart.map(book => book._id);

        user.purchasedBooks.push(...purchasedBooksIds);

        user.cart = [];

        await user.save();
        
        return res.status(200).json({ received: true });
      }
    }
}

module.exports = PaymentController;