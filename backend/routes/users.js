const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const validateToken = require('../tokenValidate');

module.exports = [
  {
    method: 'POST',
    path: '/user/login',
    handler: async (request) => {
      const { email, password } = request.payload;
      const user = await User.findOne({ email });
      if (!user) return { message: 'Użytkownik nie istnieje.' };

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return { message: 'Nieprawidłowe hasło.' };

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return { message: 'Zalogowano pomyślnie.', token };
    }
  },
  {
    method: 'POST',
    path: '/user/register',
    handler: async (request) => {
      const { name, email, password } = request.payload;

      const existingUser = await User.findOne({ email });
      if (existingUser)
        return { message: 'Użytkownik o tym e-mailu już istnieje.' };

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
  },
  {
    method: 'POST',
    path: '/user/favorites/{bookId}',
    handler: async (request) => {
      const payload = validateToken(request);
      if (!payload) return { message: 'Brak autoryzacji.' };

      const user = await User.findById(payload.userId);
      const bookId = request.params.bookId;

      if (!user.favorites.includes(bookId)) {
        user.favorites.push(bookId);
        await user.save();
      }

      return { message: 'Dodano do ulubionych.' };
    }
  },
  {
    method: 'DELETE',
    path: '/user/favorites/{bookId}',
    handler: async (request) => {
      const payload = validateToken(request);
      if (!payload) return { message: 'Brak autoryzacji.' };

      const user = await User.findById(payload.userId);
      const bookId = request.params.bookId;

      user.favorites = user.favorites.filter(
        id => String(id) !== bookId
      );
      await user.save();

      return { message: 'Usunięto z ulubionych.' };
    }
  },
  {
    method: 'GET',
    path: '/user/favorites',
    handler: async (request) => {
      const payload = validateToken(request);
      if (!payload) return { message: 'Brak autoryzacji.' };

      const user = await User
        .findById(payload.userId)
        .populate('favorites');

      return user.favorites;
    }
  }
];
