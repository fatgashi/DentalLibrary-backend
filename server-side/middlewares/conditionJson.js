const express = require('express');
const upload = require('./upload');

const conditionalJson = (req, res, next) => {
    if (req.path === '/payment/webhook') {
      return express.raw({ type: 'application/json' })(req, res, next);
    } else if(req.path.startsWith('/books/updateBook/')){
      return upload.any()(req, res, next);
    }
    return express.json()(req, res, next);
};

module.exports = conditionalJson