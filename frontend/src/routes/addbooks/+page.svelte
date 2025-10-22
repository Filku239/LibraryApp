<script>
    import Navbar from '../../lib/components/Navbar.svelte';

    let title = '';
    let author = '';
    let description = '';
    let year = '';
    let image = null;

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const book = {
            title: formData.get('title'),  
            author: formData.get('author'),
            description: formData.get('description'),
            year: parseInt(formData.get('year')),
            image: image
        };
        const res = await fetch('http://localhost:3000/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        });
        if (res.ok) alert('Książka dodana pomyślnie');
        else alert('Błąd dodawania książki');
    };
</script>

<Navbar/>

<div class="form-container">
    <form onsubmit={handleSubmit} class="book-form">
        <h2>Dodaj nową książkę</h2>

        <label for="title">Tytuł:</label>
        <input type="text" name="title" id="title" bind:value={title} required />

        <label for="author">Autor:</label>
        <input type="text" name="author" id="author" bind:value={author} required />

        <label for="description">Opis:</label>
        <textarea name="description" id="description" rows="3" bind:value={description} required></textarea>

        <label for="year">Rok wydania:</label>
        <input type="number" name="year" id="year" bind:value={year} required />

        <label for="image">Okładka (URL):</label>
        <input 
            type="text" 
            name="image" 
            id="image" 
            placeholder="Wklej link do okładki" 
            bind:value={image} 
        />

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
        max-width: 432px; /* powiększone o 20% */
        display: flex;
        flex-direction: column;
        gap: 9.6px; /* powiększone o 20% */
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
        font-size: 24px; /* powiększone o 20% */
    }

    label {
        font-weight: 600;
        margin-bottom: 2.4px;
        color: #555;
        font-size: 16.8px; /* powiększone o 20% */
    }

    input[type="text"],
    input[type="number"],
    textarea {
        padding: 7.2px 10.8px; /* powiększone o 20% */
        border-radius: 7.2px;
        border: 1px solid #ccc;
        font-size: 16.8px; /* powiększone o 20% */
        width: 100%;
        box-sizing: border-box;
        transition: border 0.2s, box-shadow 0.2s;
    }

    textarea {
        resize: none;
    }

    input[type="text"]:focus,
    input[type="number"]:focus,
    textarea:focus {
        border-color: #4b6cb7;
        box-shadow: 0 0 0 2px rgba(75,108,183,0.2);
        outline: none;
    }

    button {
        margin-top: 9.6px; /* powiększone o 20% */
        padding: 7.8px 12px; /* powiększone o 20% */
        background: linear-gradient(90deg, #4b6cb7, #182848);
        color: #fff;
        font-weight: bold;
        border: none;
        border-radius: 9.6px; /* powiększone o 20% */
        cursor: pointer;
        transition: background 0.3s, transform 0.2s;
        font-size: 16.8px; /* powiększone o 20% */
    }

    button:hover {
        background: linear-gradient(90deg, #182848, #4b6cb7);
        transform: translateY(-1px);
    }

    @media (max-width: 500px) {
        .book-form {
            padding: 18px 24px;
            gap: 7.2px;
        }
        .book-form h2 {
            font-size: 21.6px;
        }
        label {
            font-size: 13px;
        }
        input[type="text"],
        input[type="number"],
        textarea {
            font-size: 13px;
        }
        button {
            font-size: 13px;
            padding: 6px 9px;
        }
    }
</style>