import { test, expect } from "@playwright/test";

test("In-app page jumping", async ({ page }) => {
  await page.goto("http://localhost:3348/test/test-app.html");
  await expect(page.getByTestId("first-div")).toHaveText(
    new RegExp('{"count":"1"}')
  );

  await page.getByTestId("gotohome").click();
  await new Promise((res) => setTimeout(res, 500));
  await expect(page.getByTestId("first-div")).toHaveText(
    new RegExp('{"count":"2"}')
  );

  await page.getByTestId("gotohome").click();
  await new Promise((res) => setTimeout(res, 500));
  await expect(page.getByTestId("first-div")).toHaveText(
    new RegExp('{"count":"3"}')
  );

  await page.getByTestId("back").click();
  await new Promise((res) => setTimeout(res, 500));
  await expect(page.getByTestId("first-div")).toHaveText(
    new RegExp('{"count":"2"}')
  );

  await page.getByTestId("gotohome").click();
  await new Promise((res) => setTimeout(res, 500));
  await expect(page.getByTestId("first-div")).toHaveText(
    new RegExp('{"count":"3"}')
  );

  await page.getByTestId("replacetohome").click();
  await new Promise((res) => setTimeout(res, 500));
  await expect(page.getByTestId("first-div")).toHaveText(
    new RegExp('{"count":"250"}')
  );

  await page.getByTestId("back").click();
  await new Promise((res) => setTimeout(res, 500));
  await expect(page.getByTestId("first-div")).toHaveText(
    new RegExp('{"count":"2"}')
  );

  await page.getByTestId("gotofail").click();
  await new Promise((res) => setTimeout(res, 500));
  await expect(page.getByTestId("error-container")).toHaveText(
    new RegExp("load fail")
  );
});
