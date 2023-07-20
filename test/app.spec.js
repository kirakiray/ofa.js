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

async function getRouters(page) {
  const { _preview: data } = await page.waitForFunction(async () => {
    return JSON.stringify($("o-app").routers);
  });

  return JSON.parse(data);
}

test("app routers", async ({ page }) => {
  await page.goto("http://localhost:3348/test/test-app.html");

  await new Promise((res) => setTimeout(res, 500));

  await expect(await getRouters(page)).toEqual([
    {
      src: "http://localhost:3348/test/pages/home.mjs?count=1",
    },
  ]);

  await page.getByTestId("gotohome").click();
  await new Promise((res) => setTimeout(res, 500));

  await expect(await getRouters(page)).toEqual([
    {
      src: "http://localhost:3348/test/pages/home.mjs?count=1",
    },
    {
      src: "http://localhost:3348/test/pages/home.mjs?count=2",
    },
  ]);

  await page.getByTestId("gotohome").click();
  await new Promise((res) => setTimeout(res, 500));

  await expect(await getRouters(page)).toEqual([
    {
      src: "http://localhost:3348/test/pages/home.mjs?count=1",
    },
    {
      src: "http://localhost:3348/test/pages/home.mjs?count=2",
    },
    {
      src: "http://localhost:3348/test/pages/home.mjs?count=3",
    },
  ]);

  await page.getByTestId("back").click();
  await new Promise((res) => setTimeout(res, 500));

  await expect(await getRouters(page)).toEqual([
    {
      src: "http://localhost:3348/test/pages/home.mjs?count=1",
    },
    {
      src: "http://localhost:3348/test/pages/home.mjs?count=2",
    },
  ]);

  await page.getByTestId("replacetohome").click();
  await new Promise((res) => setTimeout(res, 500));

  await expect(await getRouters(page)).toEqual([
    {
      src: "http://localhost:3348/test/pages/home.mjs?count=1",
    },
    {
      src: "http://localhost:3348/test/pages/home.mjs?count=250",
    },
  ]);

  await page.getByTestId("back").click();
  await new Promise((res) => setTimeout(res, 500));

  await expect(await getRouters(page)).toEqual([
    {
      src: "http://localhost:3348/test/pages/home.mjs?count=1",
    },
  ]);
});

test("test o-link", async ({ page }) => {
  await page.goto("http://localhost:3348/test/test-app.html");
  await page.getByRole("link", { name: "TO single-page in o-link" }).click();
  await new Promise((res) => setTimeout(res, 500));

  await page.getByText("I am singlePage page 1");
  await page.getByTestId("back").click();
  await new Promise((res) => setTimeout(res, 500));
  await page
    .getByRole("link", { name: "In component olink (using relative paths)" })
    .click();
  await new Promise((res) => setTimeout(res, 500));
  await page.getByRole("heading", { name: "I am page1" });
});
