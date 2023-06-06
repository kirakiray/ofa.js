import { test, expect } from "@playwright/test";

test("load page", async ({ page }) => {
  await page.goto("http://localhost:3348/test/test-page.html");
  await page.getByPlaceholder("Enter something...").fill("1001");

  const { _preview: pageFirstDivText } = await page.waitForFunction(
    async () => {
      return $("o-page").shadow.$("div").text;
    }
  );

  await expect(pageFirstDivText).toBe('params --> {"num":"1001"}');
});
