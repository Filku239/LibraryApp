const handlers = require('../../routes/users');
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validateToken = require('../../tokenValidate');

jest.mock('../../models/user');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../tokenValidate');

describe('User login', () => {
  test('login returns error when user does not exist', async () => {
    // Arrange
    User.findOne.mockResolvedValue(null);
    const loginHandler = handlers.find(r => r.path === '/user/login').handler;

    // Act
    const response = await loginHandler({
      payload: { email: 'test@test.pl', password: '123' }
    });

    // Assert
    expect(response.message).toBe('Użytkownik nie istnieje.');
  });

  test('login returns error when password is incorrect', async () => {
    // Arrange
    const mockUser = { _id: '12345', email: 'test@test.pl', password: 'hashedPassword' };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);
    const loginHandler = handlers.find(r => r.path === '/user/login').handler;

    // Act
    const response = await loginHandler({
      payload: { email: 'test@test.pl', password: 'wrongpassword' }
    });

    // Assert
    expect(response.message).toBe('Nieprawidłowe hasło.');
  });

  test('login succeeds with correct password', async () => {
    // Arrange
    const mockUser = { _id: '12345', email: 'test@test.pl', password: 'hashedPassword' };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('fake_jwt_token');
    const loginHandler = handlers.find(r => r.path === '/user/login').handler;

    // Act
    const response = await loginHandler({
      payload: { email: 'test@test.pl', password: 'hashedPassword' }
    });

    // Assert
    expect(response.message).toBe('Zalogowano pomyślnie.');
    expect(response.token).toBe('fake_jwt_token');
  });
});

describe('User favorites', () => {

  test('POST /user/favorites/{bookId} adds book to favorites', async () => {
    // Arrange
    const mockUser = { _id: 'user123', favorites: [], save: jest.fn() };
    validateToken.mockReturnValue({ userId: 'user123' });
    User.findById.mockResolvedValue(mockUser);
    const addFavoriteHandler = handlers.find(r => r.path === '/user/favorites/{bookId}' && r.method === 'POST').handler;
    const bookId = 'book456';

    // Act
    const response = await addFavoriteHandler({ params: { bookId } });

    // Assert
    expect(mockUser.favorites).toContain(bookId);
    expect(mockUser.save).toHaveBeenCalled();
    expect(response.message).toBe('Dodano do ulubionych.');
  });

  test('DELETE /user/favorites/{bookId} removes book from favorites', async () => {
    // Arrange
    const mockUser = { _id: 'user123', favorites: ['book456'], save: jest.fn() };
    validateToken.mockReturnValue({ userId: 'user123' });
    User.findById.mockResolvedValue(mockUser);
    const removeFavoriteHandler = handlers.find(r => r.path === '/user/favorites/{bookId}' && r.method === 'DELETE').handler;
    const bookId = 'book456';

    // Act
    const response = await removeFavoriteHandler({ params: { bookId } });

    // Assert
    expect(mockUser.favorites).not.toContain(bookId);
    expect(mockUser.save).toHaveBeenCalled();
    expect(response.message).toBe('Usunięto z ulubionych.');
  });


  test('POST /user/favorites/{bookId} returns error if no auth', async () => {
    // Arrange
    validateToken.mockReturnValue(null);
    const addFavoriteHandler = handlers.find(r => r.path === '/user/favorites/{bookId}' && r.method === 'POST').handler;
    const bookId = 'book456';

    // Act
    const response = await addFavoriteHandler({ params: { bookId } });

    // Assert
    expect(response.message).toBe('Brak autoryzacji.');
  });
});
