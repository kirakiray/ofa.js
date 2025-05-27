import { test, expect } from "@playwright/test";

test("o-if in o-fill", async ({ page }) => {
  await page.goto(
    "http://localhost:3348/test/cases/oif-hybird-ofill/demo1.html"
  );

  await expect(page.locator("c-ifinfill")).toContainText(`[{"count":0}]
    count: 0 blue`);

  await page.getByRole("button", { name: "AddOne" }).click();

  await expect(page.locator("c-ifinfill")).toContainText(`[{"count":1}]
    count: 1 red`);

  await page.getByRole("button", { name: "AddOne" }).click();

  await expect(page.locator("c-ifinfill")).toContainText(`[{"count":2}]
    count: 2 blue`);

  await page.getByRole("button", { name: "AddOne" }).click();

  await expect(page.locator("c-ifinfill")).toContainText(`[{"count":3}]
      count: 3 red`);
});

test("o-if in o-if", async ({ page }) => {
  await page.goto(
    "http://localhost:3348/test/cases/oif-hybird-ofill/demo2.html"
  );

  await expect(page.locator("c-ifinif")).toContainText(`{"count":-1}
count: -1 green`);

  await page.getByRole("button", { name: "AddOne" }).click();

  await expect(page.locator("c-ifinif")).toContainText(`{"count":0}
count: 0 pink`);

  await page.getByRole("button", { name: "AddOne" }).click();

  await expect(page.locator("c-ifinif")).toContainText(`{"count":1}
count: 1 red`);

  await page.getByRole("button", { name: "AddOne" }).click();

  await expect(page.locator("c-ifinif")).toContainText(`{"count":2}
count: 2 yellow`);

  await page.getByRole("button", { name: "AddOne" }).click();

  await expect(page.locator("c-ifinif")).toContainText(`{"count":3}
count: 3 blue`);
});
