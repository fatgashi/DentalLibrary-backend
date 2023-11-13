const passport = require('passport');

const checkSubscriptionStatus = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user) => {
      if (err || !user) {
        return res.status(401).json({ message: 'Hello Unauthorized' });
      }
  
      req.user = user;
  
      const today = new Date();
      const endDateTime = new Date(user.subscription.endDate);
  
      if (endDateTime > today) {
        // Subscription is still active, continue
        next();
      } else {
        // Subscription has expired
        user.subscription.active = false;
        await user.save();
        return res.status(403).json({ message: 'Subscription has expired. Please renew.' });
      }
    })(req, res, next);
  };

module.exports = {
    checkSubscriptionStatus
}