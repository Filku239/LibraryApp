const Book = require('../models/book');

module.exports = [
  {
    method: 'GET',
    path: '/books',
    handler: async () => await Book.find()
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: async (request) =>
      await Book.findById(request.params.id)
  },
  {
    method: 'POST',
    path: '/books',
    handler: async (request) => {
      const book = new Book(request.payload);
      await book.save();
      return book;
    }
  },
  {
    method: 'GET',
    path: '/books/search/{query}',
    handler: async (request) => {
      const q = request.params.query;
      return await Book.find({
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { author: { $regex: q, $options: 'i' } }
        ]
      });
    }
  }
];
