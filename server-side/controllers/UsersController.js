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
            console.error(err);
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
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        
            res.json({ token });
          })(req, res, next);
    },
    getProfile: (req,res) => {
        res.json(req.user);
    }
}



module.exports = usersController;
