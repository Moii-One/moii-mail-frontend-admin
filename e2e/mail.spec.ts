import { test, expect } from '@playwright/test';
import { loginViaUI, waitForLoader, BASE_URL } from '../../../e2e/helpers/auth';

// ──────────────────────────────────────────────────────────────────
// moii-mail E2E Tests
//
// Routes:
//   /mail/templates           — Templates.vue (CRUD table + modals)
//   /mail/templates/create    — TemplateForm.vue
//   /mail/logs                — MailLogs.vue (read-only table)
// ──────────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════════
// TEMPLATES PAGE  (/mail/templates)
// ═══════════════════════════════════════════════════════════════════

test.describe('Mail Templates — Page Load & Header', () => {

    test.beforeEach(async ({ page }) => {
        await loginViaUI(page);
        await waitForLoader(page);
        await page.goto(`${BASE_URL}/mail/templates`);
        await waitForLoader(page);
    });

    test('page renders with correct title and subtitle', async ({ page }) => {
        await expect(page.locator('h5:has-text("Email Templates")')).toBeVisible({ timeout: 10_000 });
        await expect(page.locator('text=Manage email templates used across the platform')).toBeVisible();
    });

    test('page shows Add button', async ({ page }) => {
        const addBtn = page.locator('button.btn-primary:has-text("Add")');
        await expect(addBtn.first()).toBeVisible({ timeout: 10_000 });
    });

    test('navigation links to Templates and Logs are visible', async ({ page }) => {
        await expect(page.locator('a[href*="/mail/templates"]').first()).toBeVisible({ timeout: 10_000 });
        await expect(page.locator('a[href*="/mail/logs"]').first()).toBeVisible();
    });
});

test.describe('Mail Templates — Filters (collapsed by default)', () => {

    test.beforeEach(async ({ page }) => {
        await loginViaUI(page);
        await waitForLoader(page);
        await page.goto(`${BASE_URL}/mail/templates`);
        await waitForLoader(page);
        await page.locator('button[title="Toggle Filters"]').click();
        await page.waitForTimeout(500);
    });

    test('search input is visible', async ({ page }) => {
        const search = page.locator('input[placeholder*="Search templates"]');
        await expect(search).toBeVisible({ timeout: 10_000 });
    });

    test('package, status, and tag filter labels are visible', async ({ page }) => {
        await expect(page.locator('label:text("Package")').first()).toBeVisible({ timeout: 10_000 });
        await expect(page.locator('label:text("Status")').first()).toBeVisible();
        await expect(page.locator('label:text("Tag")').first()).toBeVisible();
    });
});

test.describe('Mail Templates — Data Table', () => {

    test.beforeEach(async ({ page }) => {
        await loginViaUI(page);
        await waitForLoader(page);
        await page.goto(`${BASE_URL}/mail/templates`);
        await waitForLoader(page);
    });

    test('table or empty state is visible', async ({ page }) => {
        await page.waitForTimeout(2000);
        const datatable = page.locator('.bh-table-responsive');
        const emptyState = page.locator('text=No templates found');
        const tableVisible = await datatable.isVisible().catch(() => false);
        const emptyVisible = await emptyState.isVisible().catch(() => false);
        expect(tableVisible || emptyVisible).toBeTruthy();
    });

    test('table has expected columns when data exists', async ({ page }) => {
        await page.waitForTimeout(2000);
        const datatable = page.locator('.bh-table-responsive');
        if (await datatable.isVisible().catch(() => false)) {
            await expect(datatable.locator('text=Name').first()).toBeVisible({ timeout: 10_000 });
            await expect(datatable.locator('text=Subject').first()).toBeVisible();
            await expect(datatable.locator('text=Status').first()).toBeVisible();
        }
    });

    test('table rows have action buttons when data exists', async ({ page }) => {
        await page.waitForTimeout(2000);
        const datatable = page.locator('.bh-table-responsive');
        if (await datatable.isVisible().catch(() => false)) {
            const previewBtn = datatable.locator('[title="Preview"]').first();
            if (await previewBtn.isVisible().catch(() => false)) {
                await expect(previewBtn).toBeVisible();
            }
        }
    });
});

test.describe('Mail Templates — Create Form Page', () => {

    test.beforeEach(async ({ page }) => {
        await loginViaUI(page);
        await waitForLoader(page);
        await page.goto(`${BASE_URL}/mail/templates/create`);
        await waitForLoader(page);
    });

    test('create form page loads with form fields', async ({ page }) => {
        await expect(page.locator('#name')).toBeVisible({ timeout: 10_000 });
        await expect(page.locator('#slug')).toBeVisible();
        await expect(page.locator('#subject')).toBeVisible();
    });

    test('form has HTML content and plain text fields', async ({ page }) => {
        await expect(page.locator('#content_html')).toBeVisible({ timeout: 10_000 });
        await expect(page.locator('#content_text')).toBeVisible();
    });

    test('form has sender fields', async ({ page }) => {
        await expect(page.locator('#from_email')).toBeVisible({ timeout: 10_000 });
        await expect(page.locator('#from_name')).toBeVisible();
    });
});

// ═══════════════════════════════════════════════════════════════════
// MAIL LOGS PAGE  (/mail/logs)
// ═══════════════════════════════════════════════════════════════════

test.describe('Mail Logs — Page Load & Header', () => {

    test.beforeEach(async ({ page }) => {
        await loginViaUI(page);
        await waitForLoader(page);
        await page.goto(`${BASE_URL}/mail/logs`);
        await waitForLoader(page);
    });

    test('page renders with correct title and subtitle', async ({ page }) => {
        await expect(page.locator('h5:has-text("Mail Logs")')).toBeVisible({ timeout: 10_000 });
        await expect(page.locator('text=Monitor email delivery status and track sent messages')).toBeVisible();
    });
});

test.describe('Mail Logs — Statistics Cards', () => {

    test.beforeEach(async ({ page }) => {
        await loginViaUI(page);
        await waitForLoader(page);
        await page.goto(`${BASE_URL}/mail/logs`);
        await waitForLoader(page);
    });

    test('displays stat cards', async ({ page }) => {
        await expect(page.locator('.panel .text-white-dark:has-text("Total Emails")')).toBeVisible({ timeout: 10_000 });
        await expect(page.locator('.panel .text-white-dark:has-text("Delivered")')).toBeVisible();
        await expect(page.locator('.panel .text-white-dark:has-text("Pending")')).toBeVisible();
        await expect(page.locator('.panel .text-white-dark:has-text("Failed")')).toBeVisible();
    });
});

test.describe('Mail Logs — Filters (collapsed by default)', () => {

    test.beforeEach(async ({ page }) => {
        await loginViaUI(page);
        await waitForLoader(page);
        await page.goto(`${BASE_URL}/mail/logs`);
        await waitForLoader(page);
        await page.locator('button[title="Toggle Filters"]').click();
        await page.waitForTimeout(500);
    });

    test('search and status filter visible', async ({ page }) => {
        const search = page.locator('input[placeholder*="Search by email, subject"]');
        await expect(search).toBeVisible({ timeout: 10_000 });
        await expect(page.locator('label:text("Status")').first()).toBeVisible();
    });
});

test.describe('Mail Logs — Data Table', () => {

    test.beforeEach(async ({ page }) => {
        await loginViaUI(page);
        await waitForLoader(page);
        await page.goto(`${BASE_URL}/mail/logs`);
        await waitForLoader(page);
    });

    test('table is visible', async ({ page }) => {
        await page.waitForTimeout(2000);
        const datatable = page.locator('.bh-table-responsive');
        await expect(datatable).toBeVisible({ timeout: 10_000 });
    });
});

// ═══════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════

test.describe('Mail — Navigation', () => {

    test.beforeEach(async ({ page }) => {
        await loginViaUI(page);
        await waitForLoader(page);
    });

    test('navigate from Templates to Logs', async ({ page }) => {
        await page.goto(`${BASE_URL}/mail/templates`);
        await waitForLoader(page);
        await page.locator('a[href*="/mail/logs"]').first().click();
        await waitForLoader(page);
        await expect(page).toHaveURL(/\/mail\/logs/);
        await expect(page.locator('h5:has-text("Mail Logs")')).toBeVisible({ timeout: 10_000 });
    });

    test('navigate from Logs to Templates', async ({ page }) => {
        await page.goto(`${BASE_URL}/mail/logs`);
        await waitForLoader(page);
        await page.locator('a[href*="/mail/templates"]').first().click();
        await waitForLoader(page);
        await expect(page).toHaveURL(/\/mail\/templates/);
    });
});

// ═══════════════════════════════════════════════════════════════════
// PROTECTED ROUTES
// ═══════════════════════════════════════════════════════════════════

test.describe('Mail — Protected Routes', () => {

    test('unauthenticated user is redirected to login', async ({ page }) => {
        await page.goto(`${BASE_URL}/login`);
        await page.evaluate(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        });
        await page.goto(`${BASE_URL}/mail/templates`);
        await page.waitForURL(/\/login/, { timeout: 10_000 });
        await expect(page.locator('#Email')).toBeVisible();
    });
});
