import { test, expect } from "@playwright/test";

test("global link", async ({ page }) => {
  await page.goto("http://localhost:3348/libs/global-link/test/test.html");

  await new Promise((res) => setTimeout(res, 200)); // 等待渲染

  const innerColor = await page.evaluate(async () => {
    return $("test-comp").shadow.$(".test-class").css.color;
  });

  expect(innerColor).toBe("rgb(255, 0, 0)");
});
