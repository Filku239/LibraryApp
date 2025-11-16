# LibraryApp
## Testowanie i jakość oprogramowania 
Autor: Filip Kuciel
Temat projektu: Aplikacja biblioteka książek
Opis projektu: to nowoczesna aplikacja webowa do zarządzania i przeglądania kolekcji książek, stworzona w technologii **Svelte** (frontend) oraz **Hapi.js + MongoDB** (backend). Umożliwia użytkownikom przeglądanie książek, zarządzanie ulubionymi pozycjami oraz korzystanie z własnego konta.

## Funkcjonalności

- **Przeglądanie książek**
  - Wyświetlanie wszystkich dostępnych książek.
  - Szczegółowy widok książki (tytuł, autor, opis, rok wydania).
  - Wyszukiwanie po tytule lub autorze.

- **Rejestracja i logowanie**
  - Tworzenie konta z imieniem, e-mailem i hasłem.
  - Logowanie z wykorzystaniem JWT.
  - Ochrona funkcji wymagających autoryzacji (dodawanie książek, ulubione).

- **Zarządzanie ulubionymi**
  - Dodawanie i usuwanie książek z listy ulubionych.
  - Przeglądanie ulubionych pozycji.

- **Dodawanie książek** *(dla zalogowanych użytkowników)*
  - Formularz z walidacją danych.
  - Możliwość dodania tytułu, autora, opisu, roku wydania i okładki.

- **Bezpieczeństwo**
  - Hasła hashowane w bazie danych (bcrypt).
  - Autoryzacja przy pomocy JWT.

- **Responsywny interfejs**
  - Przyjazny design na urządzenia mobilne i desktop.
  - Estetyczne karty książek z możliwością interakcji.

- **Uruchamianie**
 - W backendzie komenda: npm run start
 - W frontendzie komenda: npm run dev

 Może być problem z funkjconalnosciami, poniewaz nie wrzucilem pliku .env do repozytorium githuba

## Technologia

- **Frontend:** Svelte, Svelte Stores, Svelte Transitions  
- **Backend:** Hapi.js, MongoDB, Mongoose, JWT, bcrypt
