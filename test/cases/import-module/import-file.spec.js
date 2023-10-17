import { test, expect } from "@playwright/test";

test("import module", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/import-module/test.html");

  await new Promise((res) => setTimeout(res, 100));

  await page.getByText("I am test comp").click();

  expect(await page.$eval("#ok", (node) => node.textContent)).toBe("ok");
});
