<script>
    import { onMount } from 'svelte';
    import Navbar from '$lib/components/Navbar.svelte';
    import { token } from '$lib/auth.js';
    import { writable } from 'svelte/store';

    let favoritesBooks = [];
    const loading = writable(true);

    const loadFavorites = async () => {
        let currentToken;
        token.subscribe(value => currentToken = value)();
        if (!currentToken) {
            favoritesBooks = [];
            loading.set(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/user/favorites', {
                headers: { "Authorization": `Bearer ${currentToken}` }
            });
            if (!res.ok) throw new Error('Nie udało się pobrać ulubionych książek');
            favoritesBooks = await res.json();
        } catch {
            favoritesBooks = [];
        } finally {
            loading.set(false);
        }
    };

    const removeFromFavorites = async (bookId) => {
        let currentToken;
        token.subscribe(value => currentToken = value)();
        if (!currentToken) return;

        const res = await fetch(`http://localhost:3000/user/favorites/${bookId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${currentToken}` }
        });
        if (res.ok) {
            favoritesBooks = favoritesBooks.filter(b => b._id !== bookId);
        }
    };

    onMount(loadFavorites);
</script>

<Navbar />

<div class="favorites-page">
    <h1>Twoje ulubione książki</h1>

    {#if $loading}
        <p>Ładowanie ulubionych książek...</p>
    {:else}
        {#if favoritesBooks.length > 0}
            <div class="books-container">
                {#each favoritesBooks as book}
                    <div class="book-card">
                        <a href={`/book/${book._id}`} class="book-link">
                            <img src={book.image} alt={book.title} class="book-image" />
                        </a>
                        <div class="book-info">
                            <h2 class="book-title">{book.title}</h2>
                            <p class="book-author">{book.author}</p>
                            <button class="favorite-btn" on:click={() => removeFromFavorites(book._id)}>💔</button>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <p class="no-favorites">Nie masz jeszcze żadnych ulubionych książek</p>
        {/if}
    {/if}
</div>

<style>
    .favorites-page {
        padding: 2rem;
        text-align: center;
    }

    .favorites-page h1 {
        font-size: 2rem;
        margin-bottom: 1.5rem;
        color: #333;
    }

    .books-container {
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
        justify-content: center;
    }

    .book-card {
        width: 180px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        overflow: hidden;
        position: relative;
        text-align: center;
    }

    .book-link {
        display: block;
    }

    .book-image {
        width: 100%;
        height: 250px;
        object-fit: cover;
    }

    .book-info {
        padding: 12px;
        position: relative;
        height: 100px;
    }

    .book-title {
        font-size: 1.1rem;
        margin: 0;
        font-weight: bold;
    }

    .book-author {
        color: #555;
        font-size: 0.9rem;
        margin-top: 4px;
        font-style: italic;
    }

    .favorite-btn {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 22px;
        cursor: pointer;
    }

    .favorite-btn:hover {
        transform: scale(1.1);
    }

    .no-favorites {
        font-size: 1.2rem;
        color: #777;
        margin-top: 2rem;
    }
</style>
