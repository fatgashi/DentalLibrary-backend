const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const passport = require('passport');

const usersController = {
    register: async (req,res) => {
        try {
            const { name, surname, username, password, email, role } = req.body;
        
            // Check if username is already taken
            const existingUser = await User.findOne({ username });
            if (existingUser) {
              return res.status(400).json({ message: 'Username already taken' });
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
        
            res.status(201).json({ message: 'User registered successfully' });
        } 
        catch (err) {
            res.status(500).json({ message: 'Internal server error' });
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
          // Other errors
          console.error(error);
          res.status(500).json({ message: 'Internal server error' });
        }
      }
    },
    
    getProfile: (req,res) => {
        res.json(req.user);
    }
}



module.exports = usersController;
