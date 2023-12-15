const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const BookSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  author: { type: String, required: true },
  photoUrl: { type: String },
  date: { type: Date, default: Date.now },
  category: { type: String, required: true},
  isbn: {type: String},
  pdfFiles: {
    type: String
  }
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;
