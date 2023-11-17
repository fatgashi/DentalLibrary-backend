const express = require('express');
const passport = require('passport');
const usersController = require('../controllers/UsersController');
const { isAdmin } = require('../middlewares/authorization');

const usersRouter = express.Router();

usersRouter.post('/register', usersController.register);
usersRouter.post('/login', usersController.login);
usersRouter.post('/logout', usersController.logout);
usersRouter.get('/hasTokenExpired', usersController.hasTokenExpired);
usersRouter.get('/getPurchasedBooks', passport.authenticate('jwt', { session: false }), usersController.getPurchasedBooks);
usersRouter.post('/subscribe', isAdmin, usersController.subscription);

  usersRouter.get(
    '/client/profile',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      usersController.getProfile(req, res);
    }
  );

module.exports = usersRouter;