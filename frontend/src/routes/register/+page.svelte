<script>
    import Navbar from '$lib/components/Navbar.svelte';
    import { writable } from 'svelte/store';
    import { goto } from '$app/navigation';
    import { token, user } from '$lib/auth.js';

    let username = '';
    let password = '';
    let confirmPassword = '';
    let name = '';

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert('Hasła i potwierdzenie hasła nie są takie same.');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email: username, password })
            });

            if (res.ok) {
                const data = await res.json();
                const userData = data.user || { name: username };
                token.set(data.token);
                user.set(userData.name);
                localStorage.setItem('jwtToken', data.token);
                localStorage.setItem('user', userData.name);
                goto('/');
            } else {
                alert('Błąd rejestracji.');
            }
        } catch {
            alert('Wystąpił błąd połączenia z serwerem.');
        }
    };
</script>

<Navbar />

<div class="register-page">
    <div class="register-container">
        <div class="register-card">
            <h1>Rejestracja</h1>
            <form on:submit={handleSubmit}>
                <label for="name">Imię:</label>
                <input
                    type="text"
                    id="name"
                    bind:value={name}
                    placeholder="np. Jan Kowalski"
                    required
                />

                <label for="username">E-mail:</label>
                <input
                    type="text"
                    id="username"
                    bind:value={username}
                    placeholder="np. jan.kowalski@example.com"
                    required
                />

                <label for="password">Hasło:</label>
                <input
                    type="password"
                    id="password"
                    bind:value={password}
                    placeholder="•••••••"
                    required
                />

                <label for="confirmPassword">Powtórz hasło:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    bind:value={confirmPassword}
                    placeholder="•••••••"
                    required
                />

                <button type="submit">Zarejestruj się</button>
            </form>

            <p class="login-link">
                Masz konto? <a href="/login">Zaloguj się</a>
            </p>
        </div>
    </div>
</div>

<style>
:global(body) {
    font-family: 'Arial', sans-serif;
    margin: 0;
    background: #f5f5f5;
}

.register-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: linear-gradient(135deg, #dceeff, #ffffff, #dff3ff);
}

.register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    margin: 80px;
}

.register-card {
    background: #ffffff;
    padding: 2rem 2.5rem;
    border-radius: 20px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    width: 100%;
    max-width: 420px;
    border: 1px solid #e9eef2;
}

.register-card h1 {
    text-align: center;
    font-size: 1.8rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1.5rem;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

label {
    font-size: 0.9rem;
    color: #475569;
}

input {
    padding: 0.7rem 1rem;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.2s ease;
}

input:focus {
    border-color: #38bdf8;
    outline: none;
    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.3);
}

button {
    background-color: #0ea5e9;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    border: none;
    border-radius: 10px;
    padding: 0.8rem;
    cursor: pointer;
    transition: background-color 0.25s ease, transform 0.1s ease;
}

button:hover {
    background-color: #0284c7;
    transform: translateY(-1px);
}

button:disabled {
    background-color: #7dd3fc;
    cursor: not-allowed;
}

.login-link {
    text-align: center;
    font-size: 0.9rem;
    color: #475569;
    margin-top: 1.5rem;
}

.login-link a {
    color: #0ea5e9;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s ease;
}

.login-link a:hover {
    color: #0369a1;
}
</style>
