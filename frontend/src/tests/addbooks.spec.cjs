import { test, expect } from '@playwright/test';

test.describe('Formularz dodawania książki', () => {
  test('powinien dodać książkę pomyślnie', async ({ page }) => {
    // arrange
    await page.addInitScript(() => {
      localStorage.setItem('jwtToken', 'valid-jwt-token');
    });
    
    await page.goto('http://localhost:5173/addbooks');
    
    // act
    await page.fill('#title', 'Testowa Książka');
    await page.fill('#author', 'Jan Kowalski');
    await page.fill('#description', 'Test opis');
    await page.fill('#year', '2023');
    await page.click('button[type="submit"]');
    
    // assert
    await expect(page.locator('#title')).toHaveValue('');
    await expect(page.locator('#author')).toHaveValue('');
  });

  test('powinien przekierować na login bez tokena', async ({ page }) => {
    // arrange
    await page.goto('http://localhost:5173/addbooks');
    
    // assert
    await expect(page).toHaveURL(/.*login/);
  });
});
