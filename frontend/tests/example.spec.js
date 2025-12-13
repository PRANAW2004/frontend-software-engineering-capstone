// @ts-check
import { test, expect } from '@playwright/test';



test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page).toHaveTitle(/RecipeMaster/);
});


test("Homepage explore button test", async ({ page }) => {
  
  await page.goto("http://localhost:3000/homepage");

  // Start Exploring Recipes button
  const startLink = page.locator('#start-explore');
  await expect(startLink).toBeVisible();
  await startLink.click();
  await expect(page).toHaveURL("http://localhost:3000/recipes");

});

test("Homepage add recipe button test", async ({ page }) => {
  await page.goto("http://localhost:3000/homepage");

  const addLink = page.locator('#add-recipe');
  await expect(addLink).toBeVisible();
  await addLink.click();


  await expect(page).toHaveURL("http://localhost:3000/recipes/own");
});




test('Add a new recipe', async ({ page }) => {

  // 🔹 Fake logged-in user
  await page.addInitScript(() => {
    localStorage.setItem('userId', 'test-user-123');
  });

  await page.route('**/add-recipe', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    });
  });

  await page.route('**/get-own-recipes/**', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          _id: '1',
          name: 'Playwright Test Recipe',
          category: 'Test Category',
          area: 'Test Area',
          tags: 'E2E',
          ingredients: [{ ingredient: 'Sugar', measure: '2 tsp' }],
          instructions: 'Test instructions',
        },
      ]),
    });
  });

  // 🔹 Go to page
  await page.goto('http://localhost:3000/recipes/own');

  await expect(page.getByText('🍽 My Recipes')).toBeVisible();

  await page.getByRole('button', { name: '+' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();

  await page.getByPlaceholder('Name').fill('Playwright Test Recipe');
  await page.getByPlaceholder('Category').fill('Test Category');
  await page.getByPlaceholder('Area').fill('Test Area');
  await page.getByPlaceholder('Tags').fill('E2E');

  await page
    .getByPlaceholder('[{"ingredient":"Flour","measure":"1 cup"}]')
    .fill('[{"ingredient":"Sugar","measure":"2 tsp"}]');

  await page.getByLabel('Instructions').fill('Test instructions');

  await page.getByRole('button', { name: /add recipe/i }).click();


  await page.waitForSelector('.modal.show', { state: 'detached' });

  const recipeCard = page.locator('.card', {
    hasText: 'Playwright Test Recipe',
  });

  await expect(recipeCard).toBeVisible();
});


