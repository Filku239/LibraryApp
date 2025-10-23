<script>
  import Navbar from '$lib/components/Navbar.svelte';
  import { fade } from 'svelte/transition';
    import { goto } from '$app/navigation';

  let username = '';
  let password = '';
  let jwtToken = null;
  let user = null;
  let loading = false;

  const handleSubmit = async (event) => {
    event.preventDefault();
    loading = true;

    const formData = new FormData(event.target);
    const credentials = {
      email: formData.get('username'),
      password: formData.get('password')
    };

    try {
      const res = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (res.ok) {
        const data = await res.json();
        jwtToken = data.token;
        user = data.user || { name: credentials.email };
        localStorage.setItem('jwtToken', jwtToken);
        localStorage.setItem('user', user.name);
         goto('/')
      } else {
        alert('Błąd logowania.');
      }
    } catch (err) {
      console.error(err);
      alert('Wystąpił błąd połączenia z serwerem.');
    } finally {
      loading = false;
    }
  };
</script>

<Navbar />

<div class="login-page">
  <div class="login-container">
    <div class="login-card" in:fade>
      <h1>Logowanie</h1>
      <form on:submit={handleSubmit}>
        <label for="username">E-mail:</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="np. jan.kowalski@example.com"
          required
        />

        <label for="password">Hasło:</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          required
        />

        <button type="submit" disabled={loading}>
          {#if loading}
            Logowanie...
          {:else}
            Zaloguj się
          {/if}
        </button>
      </form>

      <p class="register-link">
        Nie masz konta?
        <a href="/register">Zarejestruj się</a>
      </p>
    </div>
  </div>

  {#if jwtToken}
    <div class="welcome-popup" in:fade>
      <p>Witaj, <strong>{user.name}</strong></p>
      <a href="/logout">Wyloguj</a>
    </div>
  {/if}
</div>

<style>
    :global(body) {
        font-family: 'Arial', sans-serif;
        margin: 0;
        background: #f5f5f5;
    }

  .login-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: linear-gradient(135deg, #dceeff, #ffffff, #dff3ff);
  }

  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    margin: 80px;
  }

  .login-card {
    background: #ffffff;
    padding: 2rem 2.5rem;
    border-radius: 20px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    width: 100%;
    max-width: 420px;
    border: 1px solid #e9eef2;
    animation: fadeIn 0.6s ease;
  }

  .login-card h1 {
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

  .register-link {
    text-align: center;
    font-size: 0.9rem;
    color: #475569;
    margin-top: 1.5rem;
  }

  .register-link a {
    color: #0ea5e9;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .register-link a:hover {
    color: #0369a1;
  }

  .welcome-popup {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1rem 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    animation: slideUp 0.4s ease;
  }

  .welcome-popup p {
    color: #1e293b;
    margin: 0;
    font-size: 1rem;
  }

  .welcome-popup a {
    display: block;
    color: #0ea5e9;
    margin-top: 0.3rem;
    text-decoration: none;
  }

  .welcome-popup a:hover {
    text-decoration: underline;
  } 
</style>
