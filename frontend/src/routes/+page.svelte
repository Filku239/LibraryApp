<script>
    import { onMount } from 'svelte';
    import Navbar from '$lib/components/Navbar.svelte';

    export let books = [];

    const loadBooks = async () => {
        try {
            const response = await fetch('http://localhost:3000/books');
            if (!response.ok) throw new Error('Failed to fetch books');
            books = await response.json();
        } catch (error) {
            console.error(error);
            books = [];
        }
    };

    onMount(loadBooks);
</script>

<Navbar />

<h2 class="library-heading">W naszej bibliotece znajdziesz:</h2>

<div class="books-container">
    {#each books as book}
        <a href={`/book/${book._id}`} class="book-card">
            <img src="{book.image}" alt="{book.title}" class="book-image" />
            <div class="book-info">
                <h2 class="book-title">{book.title}</h2>
                <p class="book-author">by {book.author}</p>
            </div>
        </a>
    {/each}
</div>

<style>
    :global(body) {
        font-family: 'Arial', sans-serif;
        margin: 0;
        background: #f5f5f5;
    }

    .library-heading {
        text-align: center;
        font-size: 28px;
        font-weight: 600;
        color: #333;
        margin: 24px 0;
        letter-spacing: 0.5px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
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
</style>
