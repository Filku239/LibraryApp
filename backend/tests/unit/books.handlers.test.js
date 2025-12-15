const handlers = require('../../routes/books');
const Book = require('../../models/book');

jest.mock('../../models/book');

describe('Book handlers', () => {

  test('GET /books returns list of books', async () => {
    // Arrange
    const mockBooks = [{ title: 'Książka 1' }, { title: 'Książka 2' }];
    Book.find.mockResolvedValue(mockBooks);
    const getBooksHandler = handlers.find(r => r.path === '/books').handler;

    // Act
    const response = await getBooksHandler();

    // Assert
    expect(response).toEqual(mockBooks);
    expect(Book.find).toHaveBeenCalled();
  });

  test('POST /books creates a new book', async () => {
    // Arrange
    const mockPayload = { title: 'Nowa książka', author: 'Autor', description: 'Opis', year: 2023, image: 'url' };
    const saveMock = jest.fn().mockResolvedValue(mockPayload);
    Book.mockImplementation(() => ({ ...mockPayload, save: saveMock }));
    const postBooksHandler = handlers.find(r => r.path === '/books' && r.method === 'POST').handler;

    // Act
    const response = await postBooksHandler({ payload: mockPayload });

    // Assert
    expect(saveMock).toHaveBeenCalled();
    expect(response).toMatchObject(mockPayload);
  });

  // ----- Dodatkowe testy -----

  test('GET /books/{id} returns single book by id', async () => {
    // Arrange
    const mockBook = { title: 'Book 1', _id: 'abc123' };
    Book.findById.mockResolvedValue(mockBook);
    const getBookByIdHandler = handlers.find(r => r.path === '/books/{id}').handler;

    // Act
    const response = await getBookByIdHandler({ params: { id: 'abc123' } });

    // Assert
    expect(response).toEqual(mockBook);
    expect(Book.findById).toHaveBeenCalledWith('abc123');
  });

  test('GET /books/search/{query} returns books matching query', async () => {
    // Arrange
    const mockBooks = [{ title: 'Test Book' }];
    Book.find.mockResolvedValue(mockBooks);
    const searchHandler = handlers.find(r => r.path === '/books/search/{query}').handler;

    // Act
    const response = await searchHandler({ params: { query: 'Test' } });

    // Assert
    expect(response).toEqual(mockBooks);
    expect(Book.find).toHaveBeenCalledWith({
      $or: [
        { title: { $regex: 'Test', $options: 'i' } },
        { author: { $regex: 'Test', $options: 'i' } }
      ]
    });
  });
});
