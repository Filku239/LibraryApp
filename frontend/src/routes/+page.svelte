<script>
  import Navbar from '$lib/components/Navbar.svelte';
  import { token } from '$lib/auth.js';
  import { onMount } from 'svelte';

  export let books = [];
  let searchQuery = '';
  let favorites = [];

  const loadBooks = async (query = '') => {
    try {
      const url = query
        ? `http://localhost:3000/books/search/${encodeURIComponent(query)}`
        : `http://localhost:3000/books`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Nie udało się pobrać książek');
      books = await res.json();
    } catch (err) {
      console.error(err);
      books = [];
    }
  };

  const loadFavorites = async () => {
    let currentToken;
    token.subscribe(value => currentToken = value)();
    if (!currentToken) return;

    const res = await fetch('http://localhost:3000/user/favorites', {
      headers: { "Authorization": `Bearer ${currentToken}` }
    });

    if (res.ok) {
      const favBooks = await res.json();
      favorites = favBooks.map(b => b._id);
    }
  };

  const addToFavorites = async (bookId) => {
    let currentToken;
    token.subscribe(value => currentToken = value)();
    if (!currentToken) return alert("Musisz być zalogowany!");

    const res = await fetch(`http://localhost:3000/user/favorites/${bookId}`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${currentToken}` }
    });
    if (res.ok) favorites = [...favorites, bookId];
  };

  const removeFromFavorites = async (bookId) => {
    let currentToken;
    token.subscribe(value => currentToken = value)();
    if (!currentToken) return;

    const res = await fetch(`http://localhost:3000/user/favorites/${bookId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${currentToken}` }
    });
    if (res.ok) favorites = favorites.filter(id => id !== bookId);
  };

  const toggleFavorite = (bookId) => {
    if (favorites.includes(bookId)) removeFromFavorites(bookId);
    else addToFavorites(bookId);
  };

  const handleSearch = async () => await loadBooks(searchQuery.trim());

  onMount(async () => {
    await loadBooks();
    await loadFavorites();
  });
</script>

<Navbar />

<div class="search-bar">
  <input
    type="text"
    bind:value={searchQuery}
    placeholder="Szukaj książki po tytule lub autorze..."
    on:keydown={(e) => e.key === 'Enter' && handleSearch()}
  />
  <button on:click={handleSearch}>Szukaj</button>
</div>

<div class="books-container">
  {#if books.length > 0}
    {#each books as book}
      <div class="book-card">
        <a href={`/book/${book._id}`} class="book-link">
          <img src={book.image} alt={book.title} class="book-image" />
        </a>
        <div class="book-info">
          <h2 class="book-title">{book.title}</h2>
          <p class="book-author">by {book.author}</p>

          {#if $token}
            <button class="favorite-btn" on:click={() => toggleFavorite(book._id)}>
              {favorites.includes(book._id) ? '❤️' : '🤍'}
            </button>
          {/if}
        </div>
      </div>
    {/each}
  {:else}
    <p class="no-results">Nie znaleziono książek</p>
  {/if}
</div>

<style>
:global(body) {
  margin: 0;
  font-family: 'Arial', sans-serif;
  background-color: #f5f5f5;
}

.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 40px 0 24px;
}

.search-bar input {
  width: 300px;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border 0.2s;
}

.search-bar input:focus {
  border-color: #007bff;
}

.search-bar button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

.search-bar button:hover {
  background-color: #0056b3;
}

.books-container {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  padding: 16px 32px;
  justify-content: flex-start;
}

.book-card {
  width: 200px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  position: relative;
  transition: transform 0.2s;
}

.book-card:hover {
  transform: translateY(-3px);
}

.book-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.book-info {
  padding: 12px;
  text-align: center;
  position: relative;
  height: 100px;
}

.book-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0;
}

.book-author {
  font-size: 0.9rem;
  color: #555;
  margin: 4px 0 8px;
  font-style: italic;
}

.favorite-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 22px;
  background: none;
  border: none;
  cursor: pointer;
}

.favorite-btn:hover {
  transform: scale(1.2);
}

.no-results {
  width: 100%;
  text-align: center;
  margin-top: 40px;
  font-size: 1.1rem;
  color: #777;
}
</style>
