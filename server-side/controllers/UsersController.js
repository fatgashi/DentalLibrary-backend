const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const passport = require('passport');
const transporter = require('../config/transporter');

const usersController = {
    register: async (req,res) => {
        try {
            const { name, surname, username, password, email, role } = req.body;
        
            // Check if username is already taken
            const existingUser = await User.findOne({ username });
            if (existingUser) {
              return res.status(400).json({ message: 'Username already taken!' });
            }

            const existingEmail = await User.findOne({ email });
            
            if (existingEmail) {
              return res.status(400).json({ message: 'Email already taken!' });
            }

        
            // Generate salt and hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
        
            // Create new user object
            const newUser = new User({
              name,
              surname,
              username,
              password: hashedPassword,
              email,
              role: role || 'client',
            });
        
            // Save the user to the database
            await newUser.save();

            const mailOptions = {
              from: 'fatjon.gashii04@gmail.com',
              to: email,
              subject: "Information on the E-book Purchase Process",
              html: `
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    /* Inline CSS styles for formatting */
                    body {
                      font-family: Arial, sans-serif;
                    }
                  </style>
                </head>
                <body>
                  <p>Dear ${email},</p>
                  <p>I hope this message finds you well. We appreciate your interest in purchasing e-books from our store, and we are here to guide you through the process. Here's a step-by-step overview of how to proceed:</p>
                  <ol>
                    <li><strong>Book Selection:</strong> Please reply to this email with the names of the e-books you wish to purchase. If you have specific editions or authors in mind, kindly provide those details as well.</li>
                    <li><strong>Price Quotation:</strong> Once we receive your e-book selections, our team will promptly calculate the total cost. We will then send you an email with the detailed price breakdown.</li>
                    <li><strong>Payment Information:</strong> In the email containing the price breakdown, you will find the account number to which you can transfer the payment. Kindly note that we accept payments via Bank Transfers.</li>
                    <li><strong>Payment Confirmation:</strong> After making the payment, please reply to our email with a confirmation of the transaction, along with any reference or transaction ID provided by your payment method.</li>
                    <li><strong>E-book Delivery:</strong> As soon as your payment is confirmed, we will process your order and send you the e-books in PDF format to the email address associated with your account.</li>
                  </ol>
                  <p><strong>Customer Support:</strong> If you have any questions or need assistance at any stage of the process, please do not hesitate to contact our customer support team at [customer support email or phone number].</p>
                  <p>We are committed to making your e-book purchase experience as seamless as possible, and we look forward to assisting you every step of the way. Please feel free to ask if you have any questions or require further clarification on any part of the process.</p>
                  <p>Thank you for choosing our bookstore, and we're excited to help you acquire the e-books you desire. We anticipate receiving your e-book selections and assisting you in making a successful purchase.</p>
                  <p><strong>Best regards,</strong></p>
                  <p>Dental Books</p>
                </body>
                </html>
              `,
            };

            transporter.sendMail(mailOptions, null);
        
            res.status(201).json({ message: 'You have registered successfully!' });
        } 
        catch (err) {
          if (err.errors) {
            const errorMessages = {};

            for (const field in err.errors) {
              errorMessages[field] = err.errors[field].message;
            }
            res.status(400).json(errorMessages);
          } else {
            res.status(500).json({ message: 'Internal server error' });
          }
        }
    },
    login: async(req,res,next) => {
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Internal server error' });
            }
        
            if (!user) {
              return res.status(401).json({ message: 'Invalid credentials' });
            }
        
            // Generate JWT token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: '1h'});
        
            res.json({ token });
          })(req, res, next);
    },
    logout: async (req, res) => {
      req.logout(function (err) {
        if (err) {
          console.error('Error while logging out:', err);
          return res.status(500).json({ message: 'Error during logout' });
        }
    
        // Optional: Perform any additional actions after logout, such as clearing session data or redirecting to a different page
        res.json({ message: 'Logout successful' });
      });
    },

    hasTokenExpired: (req,res) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ message: 'Missing or invalid token' });
        }
    
        const token = authHeader.replace('Bearer ', '');
    
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const now = Date.now();
    
        const expired = decodedToken.exp * 1000 < now;

        res.json({ expired });
        
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          // Token has expired
          res.json({ expired: true });
        } else if (error instanceof jwt.JsonWebTokenError) {
          // Token is invalid
          res.json({ expired: true });
        } else {
          res.status(500).json({ message: 'Internal server error' });
        }
      }
    },

    subscription: async (req, res) => {
      const { userId, numberOfMonths } = req.body;

      try {

        // Ensure userId and numberOfMonths are provided in the request body

        if (!userId || !numberOfMonths) {
            return res.status(400).json({ message: 'User ID and number of months are required.' });
        }

        const existingUser = await User.findById(userId);
        if (!existingUser) {
          return res.status(400).json({ message: 'Username not found!' });
        }

        // Calculate the start and end dates
        const currentDate = new Date();
        const startDate = currentDate;
        const endDate = new Date(currentDate);
        endDate.setMonth(endDate.getMonth() + numberOfMonths);

        // Find the user in the database and update their subscription
        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    'subscription.active': true,
                    'subscription.startDate': startDate,
                    'subscription.endDate': endDate,
                },
            },
        );

        await user.save();

        return res.status(200).json({ message: 'Subscription updated successfully.' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    },

    getPurchasedBooks: async (req, res) => {
      try {
          const user = req.user;

          await user.populate('purchasedBooks.book');

          let books = user.purchasedBooks.map(books => {
            return books.book
          })


          const purchasedBooks = books.reverse();
        
          res.json(purchasedBooks);
          
      } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
      }
    },
    
    getProfile: (req,res) => {
        res.json(req.user);
    },

    getUser: async (req,res) => {
      const { username } = req.params;
      try {
        const user = await User.findOne({username: username});
        if(!user) res.status(404).json({message: "User not found !"});
        res.json(user);
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
}



module.exports = usersController;
