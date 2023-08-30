const express = require('express');

const conditionalJson = (req, res, next) => {
    if (req.path === '/payment/webhook') {
      return express.raw({ type: 'application/json' })(req, res, next);
    }
    return express.json()(req, res, next);
};

module.exports = conditionalJson