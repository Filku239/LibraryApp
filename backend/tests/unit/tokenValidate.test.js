const jwt = require('jsonwebtoken');

const originalJwtSecret = process.env.JWT_SECRET;
process.env.JWT_SECRET = 'test_secret';

const validateToken = require('../../tokenValidate');

jest.mock('jsonwebtoken');

describe('validateToken', () => {

  afterAll(() => {
    process.env.JWT_SECRET = originalJwtSecret;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns null if authorization header is missing', () => {
    // # Arrange
    const request = { headers: {} };

    // # Act
    const result = validateToken(request);

    // # Assert
    expect(result).toBeNull();
  });

  test('returns decoded token if token is valid', () => {
    // # Arrange
    const decodedPayload = { userId: '123', email: 'test@test.pl' };
    const request = { headers: { authorization: 'Bearer validtoken' } };
    jwt.verify.mockReturnValue(decodedPayload);

    // # Act
    const result = validateToken(request);

    // # Assert
    expect(jwt.verify).toHaveBeenCalledWith('validtoken', 'test_secret');
    expect(result).toEqual(decodedPayload);
  });
});
