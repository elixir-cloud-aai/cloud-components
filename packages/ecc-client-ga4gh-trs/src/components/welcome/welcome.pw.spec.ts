import { expect, test } from "@playwright/test";

test.describe("fast-welcome", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("should contain a div element", async ({ page }) => {
        const element = page.locator("fast-welcome > div");

        await expect(element).not.toBeNull();
    });
});
