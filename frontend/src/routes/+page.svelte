<script>
    import { onMount } from 'svelte';
    import Navbar from '$lib/components/Navbar.svelte';

    export let books = [];
    let searchQuery = '';

    const loadBooks = async (query = '') => {
        try {
            const url = query
                ? `http://localhost:3000/books/search/${encodeURIComponent(query)}`
                : `http://localhost:3000/books`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch books');
            books = await response.json();
        } catch (error) {
            console.error(error);
            books = [];
        }
    };

    const handleSearch = async () => {
        await loadBooks(searchQuery.trim());
    };

    onMount(loadBooks);
</script>

<Navbar />

<div class="search-bar">
    <input
        type="text"
        bind:value={searchQuery}
        placeholder="Wyszukaj książkę po tytule lub autorze..."
        on:keydown={(e) => e.key === 'Enter' && handleSearch()}
    />
    <button on:click={handleSearch}>Szukaj</button>
</div>

<div class="books-container">
    {#if books.length > 0}
        {#each books as book}
            <a href={`/book/${book._id}`} class="book-card">
                <img src="{book.image}" alt="{book.title}" class="book-image" />
                <div class="book-info">
                    <h2 class="book-title">{book.title}</h2>
                    <p class="book-author">by {book.author}</p>
                </div>
            </a>
        {/each}
    {:else}
        <p class="no-results">Nie znaleziono książek 😔</p>
    {/if}
</div>

<style>
    :global(body) {
        font-family: 'Arial', sans-serif;
        margin: 0;
        background: #f5f5f5;
    }

    .search-bar {
        margin-top: 40px;   
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;
    }

    .search-bar input {
        padding: 10px 16px;
        font-size: 16px;
        border-radius: 8px;
        border: 1px solid #ccc;
        width: 300px;
        outline: none;
        transition: border-color 0.2s;
    }

    .search-bar input:focus {
        border-color: #007bff;
    }

    .search-bar button {
        padding: 10px 20px;
        background-color: #007bff;
        color: #fff;
        font-size: 16px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
    }

    .search-bar button:hover {
        background-color: #0056b3;
    }

    .books-container {
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
        padding: 16px 32px;
        justify-content: flex-start;
    }

    .book-card {
        width: 200px;
        text-decoration: none;
        color: inherit;
        flex-shrink: 0;
    }

    .book-image {
        width: 100%;
        height: 250px;
        object-fit: cover;
        border-radius: 8px 8px 0 0;
    }

    .book-info {
        background: #fff;
        padding: 12px;
        height: 80px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        border-radius: 0 0 12px 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }

    .book-title {
        font-size: 1.2rem;
        margin: 0;
        font-weight: bold;
    }

    .book-author {
        color: #555;
        font-size: 0.9rem;
        margin-top: 4px;
        font-style: italic;
    }

    .no-results {
        width: 100%;
        text-align: center;
        color: #777;
        font-size: 1.1rem;
        margin-top: 40px;
    }
</style>
