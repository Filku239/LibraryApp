# LibraryApp

## Nazwa kursu
**Testowanie i Jakość Oprogramowania**

## Autor
Filip Kuciel

## Temat projektu
Aplikacja – biblioteka książek

## Opis projektu
LibraryApp to aplikacja webowa do zarządzania i przeglądania kolekcji książek, stworzona w technologii **Svelte** (frontend) oraz **Hapi.js + MongoDB** (backend). Umożliwia użytkownikom przeglądanie książek, zarządzanie ulubionymi pozycjami oraz korzystanie z własnego konta.

## Funkcjonalności

- **Przeglądanie książek**
  - Wyświetlanie wszystkich dostępnych książek.
  - Szczegółowy widok książki (tytuł, autor, opis, rok wydania).
  - Wyszukiwanie po tytule lub autorze.

- **Rejestracja i logowanie**
  - Tworzenie konta z imieniem, e-mailem i hasłem.
  - Logowanie z wykorzystaniem JWT.
  - Ochrona funkcji wymagających autoryzacji (dodawanie książek, ulubione).

- **Zarządzanie ulubionymi** *(dla zalogowanych użytkowników)*
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

## Uruchomienie projektu

### Backend
```bash
npm install
npm run start
```

### Frontend
```bash
npm install
npm run dev
```

### Uwaga
 Może być problem z funkcjonalnościami, ponieważ nie wrzucilem pliku .env do repozytorium github.

## Testy

### Testy jednostkowe

#### 1. Test 'GET /books returns list of books'
[`backend/tests/unit/books.handlers.test.js`](backend/tests/unit/books.handlers.test.js#L8-L20)

Test sprawdza, czy handler endpointu GET /books poprawnie zwraca listę książek.
Model Book jest zamockowany tak, aby metoda find() zwróciła przykładowe dane. Następnie wywoływany jest handler trasy, a test weryfikuje, czy zwrócona odpowiedź zawiera oczekiwaną listę książek oraz czy metoda find() została wywołana.

#### 2. Test 'POST /books creates a new book'
[`backend/tests/unit/books.handlers.test.js`](backend/tests/unit/books.handlers.test.js#L22-L35)

Test sprawdza, czy endpoint POST /books poprawnie tworzy nową książkę. W teście symulowane jest zapisanie książki do bazy danych, a następnie weryfikowane jest, czy metoda zapisu została wywołana oraz czy odpowiedź zawiera dane nowo utworzonej książki.

#### 3. Test 'GET /books/{id} returns single book by id'
[`backend/tests/unit/books.handlers.test.js`](backend/tests/unit/books.handlers.test.js#L39-L51)

Test sprawdza, czy endpoint GET /books/{id} poprawnie zwraca pojedynczą książkę na podstawie jej identyfikatora. W teście symulowane jest pobranie książki z bazy danych, a następnie weryfikowane jest, czy zwrócone dane są zgodne z oczekiwaniami oraz czy metoda wyszukiwania została wywołana z poprawnym identyfikatorem.

#### 4. Test 'GET /books/search/{query} returns books matching query'
[`backend/tests/unit/books.handlers.test.js`](backend/tests/unit/books.handlers.test.js#L53-L70)

Test sprawdza, czy endpoint GET /books/search/{query} poprawnie wyszukuje książki na podstawie podanego zapytania. W teście symulowane jest wyszukiwanie w bazie danych po tytule lub autorze, a następnie weryfikowane jest, czy zwrócona lista książek odpowiada zapytaniu oraz czy metoda wyszukiwania została wywołana z poprawnymi parametrami.

#### 5. Test 'returns null if authorization header is missing'
[`backend/tests/unit/tokenValidate.test.js`](backend/tests/unit/tokenValidate.test.js#L20-L29)

Test sprawdza, czy funkcja validateToken poprawnie zwraca null, gdy w żądaniu brakuje nagłówka autoryzacji. Tworzony jest obiekt żądania bez tokena, wywoływana jest funkcja, a następnie weryfikowane, że wynik jest pusty, co zapewnia bezpieczne działanie funkcji przy braku tokena.

#### 6. Test 'returns decoded token if token is valid'
[`backend/tests/unit/tokenValidate.test.js`](backend/tests/unit/tokenValidate.test.js#L31-L43)

Test sprawdza, czy funkcja validateToken poprawnie dekoduje token JWT, gdy jest on prawidłowy. Tworzony jest obiekt żądania z nagłówkiem autoryzacji, a funkcja jwt.verify jest zamockowana, aby zwrócić przykładowy payload. Następnie test weryfikuje, że funkcja wywołała jwt.verify z odpowiednim tokenem i sekretem oraz że zwrócony wynik odpowiada oczekiwanemu payload.

#### 7. Test 'login returns error when user does not exist'
[`backend/tests/unit/users.handlers.test.js`](backend/tests/unit/users.handlers.test.js#L12-L25)

Test sprawdza, czy endpoint logowania poprawnie obsługuje sytuację, gdy użytkownik nie istnieje w bazie danych. Funkcja wyszukiwania użytkownika (User.findOne) jest zamockowana, aby zwrócić null, a następnie wywoływany jest handler logowania. Test weryfikuje, że odpowiedź zawiera komunikat informujący o braku użytkownika.

#### 8. Test 'login returns error when password is incorrect'
[`backend/tests/unit/users.handlers.test.js`](backend/tests/unit/users.handlers.test.js#L27-L41)

Test sprawdza, czy endpoint logowania poprawnie reaguje, gdy podane hasło jest nieprawidłowe. Funkcja wyszukiwania użytkownika (User.findOne) zwraca istniejącego użytkownika, a funkcja bcrypt.compare jest zamockowana, aby zwrócić false. Test weryfikuje, że odpowiedź zawiera komunikat informujący o nieprawidłowym haśle.

#### 9. Test 'DELETE /user/favorites/{bookId} removes book from favorites'
[`backend/tests/unit/users.handlers.test.js`](backend/tests/unit/users.handlers.test.js#L81-L96)

Test sprawdza, czy endpoint usuwania książki z ulubionych działa poprawnie. Funkcja validateToken zwraca ID zalogowanego użytkownika, a User.findById zwraca obiekt użytkownika z książką na liście ulubionych. Test weryfikuje, że ID książki zostało usunięte z listy, metoda zapisu użytkownika została wywołana, a odpowiedź zawiera komunikat potwierdzający usunięcie z ulubionych.

#### 10. Test 'POST /user/favorites/{bookId} returns error if no auth'
[`backend/tests/unit/users.handlers.test.js`](backend/tests/unit/users.handlers.test.js#L99-L110)

Test sprawdza, czy endpoint dodawania książki do ulubionych poprawnie reaguje, gdy użytkownik nie jest zalogowany. Funkcja validateToken zwraca null, a test weryfikuje, że odpowiedź zawiera komunikat o braku autoryzacji.

#### 11. Test 'should fill empty fields correct' 
[`frontend\src\tests\register.spec.cjs`](frontend\src\tests\register.spec.cjs#L39-L47)

Test sprawdza, czy pola formularza rejestracji poprawnie przyjmują wpisane wartości. Użytkownik wypełnia pola imienia i adresu e-mail, a test weryfikuje, że wartości w polach odpowiadają wprowadzonym danym, co potwierdza poprawne działanie formularza na froncie.

### Testy integracyjne

#### 1. Test 'POST /books creates a new book'
[`backend/tests/integration/booksUSers.integration.test.js`](backend/tests/integration/booksUSers.integration.test.js#L50-L68)

Test sprawdza, czy endpoint POST /books poprawnie tworzy nową książkę. Wysyłany jest rzeczywisty request z danymi książki do serwera, a następnie weryfikowane są odpowiedź HTTP oraz zapis w bazie danych, co potwierdza, że książka została dodana.

#### 2. Test 'GET /books returns all books'
[`backend/tests/integration/booksUSers.integration.test.js`](backend/tests/integration/booksUSers.integration.test.js#L70-L83)

Test sprawdza, czy endpoint GET /books poprawnie zwraca wszystkie książki. Najpierw do bazy dodawane są dwie przykładowe książki, następnie wysyłany jest request do serwera, a test weryfikuje, że odpowiedź ma kod 200 i zawiera dokładnie dwie pozycje.


#### 3. Test 'POST /user/favorites/{bookId} adds book to favorites'
[`backend/tests/integration/booksUSers.integration.test.js`](backend/tests/integration/booksUSers.integration.test.js#L85-L103)

Test sprawdza, czy endpoint POST /user/favorites/{bookId} poprawnie dodaje książkę do ulubionych zalogowanego użytkownika. Najpierw tworzona jest przykładowa książka w bazie, następnie wysyłany jest request z tokenem autoryzacyjnym, a test weryfikuje, że odpowiedź ma kod 200, zawiera komunikat potwierdzający dodanie, oraz że lista ulubionych użytkownika faktycznie zawiera dodaną książkę.

#### 4. Test 'DELETE /user/favorites/{bookId} removes book from favorites'
[`backend/tests/integration/booksUSers.integration.test.js`](backend/tests/integration/booksUSers.integration.test.js#L105-L125)

Test sprawdza, czy endpoint DELETE /user/favorites/{bookId} poprawnie usuwa książkę z ulubionych zalogowanego użytkownika. Najpierw tworzona jest przykładowa książka i dodawana do listy ulubionych użytkownika, następnie wysyłany jest request z tokenem autoryzacyjnym. Test weryfikuje, że odpowiedź ma kod 200, zawiera komunikat potwierdzający usunięcie, oraz że książka została faktycznie usunięta z listy ulubionych użytkownika.

#### 5. Test 'should add book successfully'
[`frontend\src\tests\addbooks.spec.cjs`](frontend\src\tests\addbooks.spec.cjs#L4-L22)

Test sprawdza, czy formularz dodawania książki na froncie działa poprawnie. Najpierw ustawiany jest token JWT w localStorage, następnie użytkownik wypełnia pola formularza i wysyła dane. Test weryfikuje, że po pomyślnym dodaniu książki pola formularza są wyczyszczone, co potwierdza poprawne przesłanie danych.

#### 6. Test 'should redirect to login without token'
[`frontend\src\tests\addbooks.spec.cjs`](frontend\src\tests\addbooks.spec.cjs#L24-L30)

Test sprawdza, czy strona dodawania książki poprawnie przekierowuje niezalogowanego użytkownika na stronę logowania. Użytkownik odwiedza chronioną stronę bez tokena w localStorage, a test weryfikuje, że adres URL zmienia się na stronę logowania, co potwierdza działanie mechanizmu autoryzacji na froncie.

#### 7. Test 'should block registration with diffrent passwords'
[`frontend\src\tests\register.spec.cjs`](frontend\src\tests\register.spec.cjs#L9-L22)

Test sprawdza, czy formularz rejestracji poprawnie blokuje próbę utworzenia konta przy różnych hasłach. Użytkownik wypełnia pola rejestracyjne, podając różne wartości w polach hasła i potwierdzenia hasła, a test weryfikuje, że pola pozostają niezmienione, co wskazuje, że rejestracja nie została zaakceptowana.

#### 8. Test 'should register user succesfully'
[`frontend\src\tests\register.spec.cjs`](frontend\src\tests\register.spec.cjs#L24-L37)

Test sprawdza, czy formularz rejestracji pozwala na poprawne utworzenie konta użytkownika. Użytkownik wypełnia wszystkie wymagane pola zgodnymi danymi i wysyła formularz, a test weryfikuje, że po pomyślnej rejestracji następuje przekierowanie na stronę główną.

#### 9. Test 'login succeeds with correct password'
[`backend/tests/unit/users.handlers.test.js`](backend/tests/unit/users.handlers.test.js#L43-L59)

Test sprawdza, czy endpoint logowania działa poprawnie, gdy podane hasło jest prawidłowe. Funkcja wyszukiwania użytkownika (User.findOne) zwraca istniejącego użytkownika, a bcrypt.compare potwierdza poprawność hasła. Funkcja jwt.sign jest zamockowana, aby wygenerować token, a test weryfikuje, że odpowiedź zawiera komunikat o sukcesie logowania oraz wygenerowany token.

#### 10. Test 'POST /user/favorites/{bookId} adds book to favorites'
[`backend/tests/unit/users.handlers.test.js`](backend/tests/unit/users.handlers.test.js#L64-L79)

Test sprawdza, czy endpoint dodawania książki do ulubionych działa poprawnie. Funkcja validateToken zwraca ID zalogowanego użytkownika, a User.findById zwraca obiekt użytkownika. Test weryfikuje, że ID książki zostało dodane do listy ulubionych, metoda zapisu użytkownika została wywołana, a odpowiedź zawiera komunikat potwierdzający dodanie do ulubionych.

## Dokumentacja API

## 1. Książki

| Metoda | Endpoint | Parametry | Opis | Odpowiedź | Błędy |
|--------|----------|-----------|------|-----------|-------|
| GET    | /books  | brak      | Pobiera wszystkie książki | Lista wszystkich książek z tytułem, autorem, opisem i rokiem wydania | brak |
| GET    | /books/{id} | id książki | Pobiera pojedynczą książkę po ID | Szczegóły książki: tytuł, autor, opis, rok wydania | brak |
| POST   | /books  | title, author, description, year, image (opcjonalne) | Dodaje nową książkę | Dane nowo utworzonej książki | brak |
| GET    | /books/search/{query} | query (szukany tekst) | Wyszukuje książki po tytule lub autorze | Lista książek pasujących do zapytania | brak |

---

## 2. Użytkownicy

| Metoda | Endpoint | Parametry | Opis | Odpowiedź | Błędy |
|--------|----------|-----------|------|-----------|-------|
| POST | /user/register | name, email, password | Rejestracja nowego użytkownika | Komunikat o sukcesie rejestracji i token JWT | Komunikat o istniejącym użytkowniku |
| POST | /user/login | email, password | Logowanie użytkownika | Komunikat o sukcesie logowania i token JWT | Komunikat o nieistniejącym użytkowniku lub nieprawidłowym haśle |

---

## 3. Ulubione książki (Favorites)

| Metoda | Endpoint | Parametry | Opis | Odpowiedź | Błędy |
|--------|----------|-----------|------|-----------|-------|
| POST | /user/favorites/{bookId} | bookId | Dodaje książkę do ulubionych | Komunikat potwierdzający dodanie książki | brak |
| DELETE | /user/favorites/{bookId} | bookId | Usuwa książkę z ulubionych | Komunikat potwierdzający usunięcie książki | brak |
| GET | /user/favorites | brak | Pobiera listę ulubionych książek użytkownika | Lista książek dodanych do ulubionych | brak |


## Testy manualne (Przypadki testowe)

| ID   | Tytuł                                              | Warunki początkowe                                                                                     | Kroki testowe                                                                                                                                                      | Oczekiwany rezultat                                                                                                                                                         |
|------|----------------------------------------------------|--------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| TC001 | Wyświetlenie listy książek                        | Użytkownik otwiera stronę główną aplikacji, backend `GET /books` działa                               | 1. Otwórz stronę `/` w przeglądarce. 2. Poczekaj na załadowanie zawartości.                                                 | Lista książek jest widoczna, każda książka ma okładkę, tytuł i autora.                                                               |
| TC002 | Wyszukiwanie książki po tytule (Enter)            | Aplikacja jest otwarta na stronie `/`, backend `GET /books/search/:query` działa                      | 1. W polu wyszukiwania wpisz „Harry”. 2. Naciśnij klawisz Enter.                                                            | Lista książek odświeża się i pokazuje tylko pozycje zawierające „Harry” w tytule lub autorze.                                       |
| TC003 | Wyszukiwanie po autorze z polskimi znakami        | Aplikacja jest otwarta na stronie `/`, w bazie istnieje książka autora „Żeromski”                      | 1. W polu wyszukiwania wpisz „Żeromski”. 2. Naciśnij Enter.                                                                 | Lista książek zawiera wyłącznie pozycje autora „Żeromski”; polskie znaki są poprawnie obsłużone, brak krzaków w tekście.             |
| TC004 | Czyszczenie wyszukiwania i powrót do pełnej listy | Aplikacja jest otwarta na `/`, wcześniej wykonano wyszukiwanie które zawęziło listę wyników           | 1. W polu wyszukiwania zaznacz cały tekst i usuń go (pozostaw pole puste). 2. Naciśnij Enter lub kliknij „Szukaj”.          | Lista książek znów pokazuje wszystkie dostępne pozycje tak jak po pierwszym wejściu na stronę (reset filtra wyszukiwania).          |
| TC005 | Nawigacja do szczegółów książki                   | Aplikacja jest otwarta na stronie `/`, lista książek zawiera co najmniej jedną pozycję                | 1. Najedź kursorem na dowolną książkę. 2. Kliknij jej okładkę.                                                              | Przeglądarka przechodzi na stronę `/book/{id}` odpowiadającą wybranej książce.                                                      |
| TC006 | Ikona ulubionych widoczna dla zalogowanego        | Użytkownik jest zalogowany, w localStorage i store `token` zapisany ważny JWT                         | 1. Otwórz stronę `/`. 2. Obejrzyj kartę dowolnej książki.                                                                   | Na karcie książki w prawym dolnym rogu widać przycisk z ikoną serca (❤️ lub 🤍).                                                    |
| TC007 | Dodanie książki do ulubionych                     | Użytkownik jest zalogowany, książka nie jest jeszcze w ulubionych                                     | 1. Otwórz stronę `/`. 2. Na wybranej książce kliknij ikonę serca w stanie „puste” (🤍).                                      | Ikona natychmiast zmienia się na „pełne” serce (❤️), a książka pojawia się na liście `/favorites` po przejściu na tę stronę.       |
| TC008 | Usunięcie książki z ulubionych                    | Użytkownik jest zalogowany, książka znajduje się już w ulubionych                                     | 1. Otwórz stronę `/` lub `/favorites`. 2. Na wybranej książce kliknij ikonę serca w stanie „pełne” (❤️).                    | Ikona zmienia się na „puste” serce (🤍), a po przejściu na `/favorites` książka znika z listy ulubionych.                          |
| TC009 | Brak przycisku ulubionych dla niezalogowanego     | Użytkownik jest wylogowany, w localStorage brak `jwtToken`, store `token` jest pusty                  | 1. Otwórz stronę `/`. 2. Sprawdź dowolną kartę książki.                                                                    | Na kartach książek nie ma przycisku z ikoną serca; użytkownik nie ma możliwości zarządzania ulubionymi.                            |
| TC010 | Ładowanie i widok strony „Ulubione książki”       | Użytkownik jest zalogowany i ma co najmniej jedną książkę w ulubionych, backend `GET /user/favorites` działa | 1. Przejdź na stronę `/favorites`. 2. Obserwuj komunikat ładowania. 3. Poczekaj na zakończenie ładowania.                  | Najpierw pojawia się tekst „Ładowanie ulubionych książek...”, po chwili wyświetla się lista ulubionych książek z okładką, tytułem i autorem. |


## Technologia

- **Frontend:** Svelte, Svelte Stores, Svelte Transitions  
- **Backend:** Hapi.js, MongoDB, Mongoose, JWT, bcrypt
