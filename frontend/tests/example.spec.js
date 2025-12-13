// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Expect a title "to contain" a substring.
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

async function addTestRecipe(page, name, category) {
  // Open modal
  await page.goto("http://localhost:3000/recipes/own")
  await page.locator('button', { hasText: '+' }).click();
  const modal = page.locator('.modal.show');
  await expect(modal).toBeVisible();

  await modal.locator('input[placeholder="Name"]').fill(name);
  await modal.locator('input[placeholder="Category"]').fill(category);
  await modal.locator('input[placeholder="Area"]').fill('Test Area');
  await modal.locator('input[placeholder="Tags"]').fill('Test,Playwright');
  await modal
    .locator('textarea[placeholder=\'[{"ingredient":"Flour","measure":"1 cup"}]\']')
    .fill('[{"ingredient":"Sugar","measure":"2 tsp"}]');
  await modal.locator('textarea[rows="5"]').fill('Test instructions');

  await modal.locator('button[type="submit"]').click();

  // Wait for modal to close
  await expect(modal).toHaveCount(0);

  // Confirm card appears
  await expect(
    page.locator('.card').filter({ hasText: name })
  ).toBeVisible();
}

test("Filter recipes by category", async ({ page }) => {
  await addTestRecipe(page, 'Filter Test Recipe', 'FilterCategory');

  const filterSelect = page.locator('select');
  await filterSelect.selectOption({ label: 'FilterCategory' });

  const cards = page.locator('.card');
  await expect(cards).toHaveCount(1);

  await expect(cards.first()).toContainText('FilterCategory');
});

test("Search recipes by name", async ({ page }) => {
  await addTestRecipe(page, 'Searchable Recipe', 'SearchCategory');

  const searchInput = page.locator('input[placeholder="Search recipes..."]');
  await searchInput.fill('Searchable Recipe');

  const cards = page.locator('.card');
  await expect(cards).toHaveCount(1);

  await expect(cards.first()).toContainText('Searchable Recipe');
});
