const express = require('express');
const passport = require('passport');
const usersController = require('../controllers/UsersController');

const usersRouter = express.Router();

usersRouter.post('/register', usersController.register);
usersRouter.post('/login', usersController.login);
usersRouter.post('/logout', usersController.logout);

  usersRouter.get(
    '/client/profile',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: 'Access denied' });
      }
      usersController.getProfile(req, res);
    }
  );

module.exports = usersRouter;