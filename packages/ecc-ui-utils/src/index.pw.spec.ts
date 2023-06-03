import { expect, test } from "@playwright/test";

test.describe("page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });
});
