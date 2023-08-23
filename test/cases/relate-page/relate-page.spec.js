import { test, expect } from "@playwright/test";

test("relate page", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/relate-page/index.html");
  await page.getByRole("heading", { name: "My Page" }).click();
  await page.getByText("Welcome to my page!").click();
});
