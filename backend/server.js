'use strict';

const Hapi = require('@hapi/hapi');
const mongoose = require("mongoose");
require('dotenv').config();

const Book = require('./models/book');

const connectDB = async () => {
  try {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
    await mongoose.connect(uri, {      
    });
    console.log('Połączono z MongoDB');
  } catch (err) {
    console.error('Błąd połączenia z MongoDB:', err.message);
    process.exit(1);
  }
};

const init = async () => {
    await connectDB();

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route([
    {
      method: 'GET',
      path: '/books',
      handler: async () => {
        return await Book.find();
      }
    },
    {
      method: 'POST',
      path: '/books',
      handler: async (request) => {
        const book = new Book(request.payload);
        await book.save();
        return book;
      }
    }
  ]);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();