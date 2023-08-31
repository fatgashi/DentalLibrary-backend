const express = require('express');
const passport = require('passport');
const usersController = require('../controllers/UsersController');

const usersRouter = express.Router();

usersRouter.post('/register', usersController.register);
usersRouter.post('/login', usersController.login);
usersRouter.post('/logout', usersController.logout);
usersRouter.get('/hasTokenExpired', usersController.hasTokenExpired);
usersRouter.get('/getPurchasedBooks', passport.authenticate('jwt', { session: false }), usersController.getPurchasedBooks);

  usersRouter.get(
    '/client/profile',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      usersController.getProfile(req, res);
    }
  );

module.exports = usersRouter;