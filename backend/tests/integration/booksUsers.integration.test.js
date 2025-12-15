'use strict';

const mongoose = require('mongoose');
const request = require('supertest');
const { createServer, connectDB } = require('../../server');
const Book = require('../../models/book');
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.setTimeout(30000);

let token;
let userId;
let server;

beforeAll(async () => {
  process.env.JWT_SECRET = 'super_duper_tajne_haslo';
  process.env.NODE_ENV = 'test';

  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  server = await createServer();

  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await User.create({
    name: 'Test',
    email: 'test@test.com',
    password: hashedPassword,
    favorites: []
  });

  userId = user._id;
  token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await User.deleteMany({ email: 'test@test.com' });
  await Book.deleteMany({ title: /Book|Fav/ });
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Book.deleteMany();
});

describe('Integration tests - backend (Hapi.js) using real MongoDB', () => {

  test('POST /books creates a new book', async () => {
    // Arrange
    const payload = { title: 'Book 1', author: 'Author', year: 2023 };

    // Act
    const res = await request(server.listener)
      .post('/books')
      .send(payload);

    // Assert
    expect(res.statusCode).toBe(200);
    // Assert
    expect(res.body.title).toBe(payload.title);

    // Assert
    const dbBook = await Book.findOne({ title: 'Book 1' });
    // Assert
    expect(dbBook).not.toBeNull();
  });

  test('GET /books returns all books', async () => {
    // Arrange
    await Book.create({ title: 'Book 1', author: 'A' });
    // Arrange
    await Book.create({ title: 'Book 2', author: 'B' });

    // Act
    const res = await request(server.listener).get('/books');

    // Assert
    expect(res.statusCode).toBe(200);
    // Assert
    expect(res.body.length).toBe(2);
  });

  test('POST /user/favorites/{bookId} adds book to favorites', async () => {
    // Arrange
    const book = await Book.create({ title: 'Favorite Book', author: 'A' });

    // Act
    const res = await request(server.listener)
      .post(`/user/favorites/${book._id}`)
      .set('Authorization', `Bearer ${token}`);

    // Assert
    expect(res.statusCode).toBe(200);
    // Assert
    expect(res.body.message).toBe('Dodano do ulubionych.');

    // Assert
    const user = await User.findById(userId);
    // Assert
    expect(user.favorites.map(id => id.toString())).toContain(book._id.toString());
  });

  test('DELETE /user/favorites/{bookId} removes book from favorites', async () => {
    // Arrange
    const book = await Book.create({ title: 'Book To Remove', author: 'B' });
    // Arrange
    await User.findByIdAndUpdate(userId, { favorites: [book._id] });

    // Act
    const res = await request(server.listener)
      .delete(`/user/favorites/${book._id}`)
      .set('Authorization', `Bearer ${token}`);
    
    // Assert
    expect(res.statusCode).toBe(200);
    // Assert
    expect(res.body.message).toBe('Usunięto z ulubionych.');

    // Assert
    const user = await User.findById(userId);
    // Assert
    expect(user.favorites.map(id => id.toString())).not.toContain(book._id.toString());
  });
});