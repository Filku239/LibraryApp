'use strict';

const Hapi = require('@hapi/hapi');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();


const Book = require('./models/book');
const User = require('./models/user');


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
        host: 'localhost',
        routes: {
        cors: {
          origin: ['*'],
          headers: ['Accept', 'Content-Type', 'Authorization'],
          additionalHeaders: ['X-Requested-With']
        }
  }
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
      method: 'GET',
      path: '/books/{id}',
      handler: async (request) => {
        return await Book.findById(request.params.id);
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
    },
    {
      method: 'DELETE',
      path: '/books',
      handler: async (request) => {
        await Book.deleteMany({});
        return { message: 'Wszystkie ksiazki zostały usunięte.' };
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
    },
    {
      method: 'POST',
      path: '/user/login',
      handler: async (request) => {
        const { email, password } = request.payload;
        const user = await User.findOne({ email });
        if (!user) {
          return { message: 'Użytkownik nie istnieje.' };
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return { message: 'Nieprawidłowe hasło.' };
        }

        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        return { message: 'Zalogowano pomyślnie.', token };      }
    },
    {
      method: 'POST',
      path: '/user/register',
      handler: async (request) => {
        const { name, email, password } = request.payload;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return { message: 'Użytkownik o tym e-mailu już istnieje.' };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        return { message: 'Rejestracja pomyślna.', token };
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