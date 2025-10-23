<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  // Tworzymy store na token i użytkownika, żeby navbar był reaktywny
  export const token = writable(null);
  export const user = writable(null);

  // Sprawdzamy localStorage przy montowaniu komponentu
  onMount(() => {
    const storedToken = localStorage.getItem('jwtToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken) token.set(storedToken);
    if (storedUser) user.set(storedUser);
  });

  // Funkcja wylogowania
  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    token.set(null);
    user.set(null);
  };

  $: navLinks = [
    { name: "Home", href: "/" },
    { name: "Add books", href: "/addbooks" },
    $token ? { name: "Logout", href: "#", action: logout } : { name: "Login", href: "/login" }
  ];
</script>

<nav class="navbar">
  <div class="navbar-logo">
    <h1>📖OurLibrary📖</h1>
  </div>
  <ul class="navbar-links">
    {#each navLinks as link}
      <li>
        {#if link.action}
          <a href={link.href} on:click|preventDefault={link.action}>{link.name}</a>
        {:else}
          <a href={link.href}>{link.name}</a>
        {/if}
      </li>
    {/each}
  </ul>
</nav>

<style>
    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem; 
        background: linear-gradient(90deg, #4b6cb7 0%, #182848 100%);
        color: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .navbar-logo h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: bold;
    }

    .navbar-links {
        display: flex;
        gap: 1.5rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .navbar-links a {
        text-decoration: none;
        color: #fff;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        transition: background 0.2s, transform 0.2s;
    }

    .navbar-links a:hover {
        background: rgba(255,255,255,0.2);
        transform: translateY(-2px);
    }

    @media (max-width: 600px) {
        .navbar {
            flex-direction: column;
            align-items: flex-start;
        }
        .navbar-links {
            flex-direction: column;
            width: 100%;
        }
        .navbar-links a {
            width: 100%;
            text-align: center;
        }
    }
</style>
