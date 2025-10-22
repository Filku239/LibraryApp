<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import Navbar from '$lib/components/Navbar.svelte';

    let book = null;
    let id;
    $: id = $page.params.id;

    onMount(async () => {
        try {
            const res = await fetch(`http://localhost:3000/books/${id}`);
            if (!res.ok) throw new Error('Nie znaleziono książki');
            book = await res.json();
        } catch (err) {
            console.error(err);
            book = null;
        }
    });
</script>

<Navbar/>

{#if book}
    <div class="book-detail-container">
        <div class="book-image-wrapper">
            <img src={book.image} alt={book.title} />
        </div>
        <div class="book-info-wrapper">
            <h1>{book.title}</h1>
            <h3>Autor: {book.author}</h3>
            <p>{book.description}</p>
            <p><strong>Rok wydania:</strong> {book.year}</p>
        </div>
    </div>
{:else}
    <p>Ładowanie książki...</p>
{/if}

<style>
    .book-detail-container {
        max-width: 900px;
        margin: 40px auto;
        background: #fff;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 6px 16px rgba(0,0,0,0.08);
        display: flex;
        flex-wrap: wrap;
        gap: 24px;
    }

    .book-image-wrapper {
        flex: 1 1 300px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .book-image-wrapper img {
        width: 300px;
        height: 500px;
        object-fit: cover; 
        border-radius: 8px;
    }

    .book-info-wrapper {
        flex: 2 1 400px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 12px;
        text-align: center;
    }

    .book-info-wrapper h1 {
        margin: 0;
        font-size: 2rem;
        color: #333;
    }

    .book-info-wrapper h3 {
        margin: 0;
        font-weight: 500;
        color: #555;
    }

    .book-info-wrapper p {
        margin: 0;
        font-size: 1rem;
        color: #333;
        line-height: 1.5;
    }

    @media (max-width: 768px) {
        .book-detail-container {
            flex-direction: column;
            align-items: center;
        }

        .book-info-wrapper {
            flex: 1 1 100%;
        }

        .book-image-wrapper img {
            width: 250px; 
            height: 500px;
        }
    }
</style>