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

test("test style url", async ({ page }) => {
  await page.goto("http://localhost:3348/test/test-app.html");

  await new Promise((res) => setTimeout(res, 300));

  const backgroundUrl = await page.$eval("[data-testid='testbg']", (el) => {
    const style = window.getComputedStyle(el);
    return style.backgroundImage;
  });

  expect(backgroundUrl).toBe('url("http://localhost:3348/test/testimg.jpeg")');
});

test("page attached and detached", async ({ page }) => {
  await page.goto("http://localhost:3348/test/test-app.html");
  await new Promise((res) => setTimeout(res, 100));

  const { _preview: _attached_home } = await page.waitForFunction(() => {
    return window._attached_home;
  });
  const { _preview: detached_home1 } = await page.waitForFunction(() => {
    return window._detached_home || "notok";
  });

  expect(_attached_home).toBe("ok");
  expect(detached_home1).toBe("notok");

  await page.getByRole("link", { name: "TO single-page in o-link" }).click();
  await new Promise((res) => setTimeout(res, 500));

  const { _preview: detached_home2 } = await page.waitForFunction(() => {
    return window._detached_home || "notok";
  });
  expect(detached_home2).toBe("ok");
});
