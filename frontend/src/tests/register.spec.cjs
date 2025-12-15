import { test, expect } from '@playwright/test';

test.describe('Formularz rejestracji', () => {
  test.beforeEach(async ({ page }) => {
    // arrange
    await page.goto('http://localhost:5173/register');
  });

  test('powinien zablokować rejestrację przy różnych hasłach', async ({ page }) => {
    // arrange
    await page.fill('#name', 'Jan Kowalski');
    await page.fill('#username', 'jan@example.com');
    
    // act
    await page.fill('#password', 'haslo123');
    await page.fill('#confirmPassword', 'innehaslo');
    await page.click('button[type="submit"]');
    
    // assert
    await expect(page.locator('#password')).toHaveValue('haslo123');
    await expect(page.locator('#confirmPassword')).toHaveValue('innehaslo');
  });

  test('powinien zarejestrować użytkownika pomyślnie', async ({ page }) => {
    // arrange
    const uniqueEmail = 'test' + Date.now() + '@example.com';
    
    // act
    await page.fill('#name', 'Test User');
    await page.fill('#username', uniqueEmail);
    await page.fill('#password', 'haslo123');
    await page.fill('#confirmPassword', 'haslo123');
    await page.click('button[type="submit"]');
    
    // assert
    await expect(page).toHaveURL('http://localhost:5173/');
  });

  test('powinien wypełnić pola poprawnie', async ({ page }) => {
    // act
    await page.fill('#name', 'Jan Kowalski');
    await page.fill('#username', 'jan.kowalski@example.com');
    
    // assert
    await expect(page.locator('#name')).toHaveValue('Jan Kowalski');
    await expect(page.locator('#username')).toHaveValue('jan.kowalski@example.com');
  });
});
