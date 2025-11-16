<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Navbar from '../../lib/components/Navbar.svelte';

    let title = '';
    let author = '';
    let description = '';
    let year = '';
    let image = '';

    onMount(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) goto('/login');
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            alert("Musisz być zalogowany!");
            goto("/login");
            return;
        }

        const book = { title, author, description, year: parseInt(year), image };

        const res = await fetch('http://localhost:3000/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(book)
        });

        if (res.ok) {
            alert('Książka dodana pomyślnie');
            title = '';
            author = '';
            description = '';
            year = '';
            image = '';
        } else {
            alert('Błąd dodawania książki');
        }
    };
</script>

<Navbar />

<div class="form-container">
    <form on:submit={handleSubmit} class="book-form">
        <h2>Dodaj nową książkę</h2>

        <label for="title">Tytuł:</label>
        <input type="text" id="title" bind:value={title} required />

        <label for="author">Autor:</label>
        <input type="text" id="author" bind:value={author} required />

        <label for="description">Opis:</label>
        <textarea id="description" rows="3" bind:value={description} required></textarea>

        <label for="year">Rok wydania:</label>
        <input type="number" id="year" bind:value={year} required />

        <label for="image">Okładka (URL):</label>
        <input type="text" id="image" placeholder="Wklej link do okładki" bind:value={image} />

        <button type="submit">Dodaj książkę</button>
    </form>
</div>

<style>
    :global(body) {
        margin: 0;
        font-family: Arial, sans-serif;
        background: #f0f4f8;
    }

    .form-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 24px 12px;
        min-height: calc(100vh - 80px);
    }

    .book-form {
        background: #ffffff;
        padding: 24px 30px;
        border-radius: 12px;
        box-shadow: 0 7px 20px rgba(0,0,0,0.08);
        width: 100%;
        max-width: 432px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        transition: transform 0.2s;
    }

    .book-form:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 28px rgba(0,0,0,0.12);
    }

    .book-form h2 {
        text-align: center;
        margin-bottom: 12px;
        color: #333;
        font-size: 24px;
    }

    label {
        font-weight: 600;
        margin-bottom: 2px;
        color: #555;
        font-size: 16px;
    }

    input[type="text"],
    input[type="number"],
    textarea {
        padding: 8px 12px;
        border-radius: 8px;
        border: 1px solid #ccc;
        font-size: 16px;
        width: 100%;
        box-sizing: border-box;
        transition: border 0.2s, box-shadow 0.2s;
    }

    textarea {
        resize: none;
    }

    input:focus,
    textarea:focus {
        border-color: #4b6cb7;
        box-shadow: 0 0 0 2px rgba(75,108,183,0.2);
        outline: none;
    }

    button {
        margin-top: 10px;
        padding: 8px 12px;
        background: linear-gradient(90deg, #4b6cb7, #182848);
        color: #fff;
        font-weight: bold;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: background 0.3s, transform 0.2s;
        font-size: 16px;
    }

    button:hover {
        background: linear-gradient(90deg, #182848, #4b6cb7);
        transform: translateY(-1px);
    }

    @media (max-width: 500px) {
        .book-form {
            padding: 18px 24px;
            gap: 7px;
        }
        .book-form h2 {
            font-size: 21px;
        }
        label, input, textarea, button {
            font-size: 13px;
        }
        button {
            padding: 6px 9px;
        }
    }
</style>
