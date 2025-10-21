const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  year: { type: Number, default: new Date().getFullYear() }
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
