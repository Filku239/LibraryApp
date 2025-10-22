<script>
    import { onMount } from 'svelte';
    import Navbar from '$lib/components/Navbar.svelte';

    export let books = [];

    // Funkcja fetchująca książki
    const fetchBooks = async () => {
        try {
            const res = await fetch('http://localhost:3000/books');
            if (!res.ok) throw new Error('Failed to fetch books');
            books = await res.json();
        } catch (error) {
            console.error(error);
            books = [];
        }
    }

    onMount(fetchBooks);
</script>

<Navbar/>   

<div class="book-grid">
    {#each books as book, i}
        <div class="book-card" style="animation-delay: {i * 0.1}s">
            <img src="{book.image}" alt="{book.title}" class="book-image" />
            <div class="book-info">
                <h2>{book.title}</h2>
                <p>by {book.author}</p>
            </div>
        </div>
    {/each}
</div>

<style>
    :global(body) {
        font-family: 'Arial', sans-serif;
        margin: 0;
        background: #f5f5f5;
    }

    h1 {
        text-align: center;
        margin: 2rem 0;
        color: #333;
    }

    .book-grid {
        display: grid;
        margin-top: 30px;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        justify-content: center;
        padding: 0 2rem 2rem 2rem;
    }

    .book-card {
        max-width: 220px;
        background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        overflow: hidden;
        cursor: pointer;
        margin: 0 auto;
        transition: transform 0.2s, box-shadow 0.2s;
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.4s forwards;
    }

    .book-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }

    .book-image {
        width: 100%;
        height: 250px;
        object-fit: cover;
    }

    .book-info {
        padding: 1rem;
        text-align: center;
    }

    .book-info h2 {
        font-size: 1.2rem;
        margin: 0.5rem 0;
        font-weight: bold;
    }

    .book-info p {
        color: #555;
        font-size: 0.9rem;
        margin: 0;
        font-style: italic;
    }

    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
