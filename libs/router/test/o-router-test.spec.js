import { test, expect } from "@playwright/test";

test("o-router fix body", async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 800 });
  await page.goto("http://localhost:3348/libs/router/test/router-test.html");

  const boundingBox = await (await page.$("o-app")).boundingBox();

  expect(boundingBox.width).toBe(800);
  expect(boundingBox.height).toBe(800);
});

const getHash = async (page) => {
  const { _preview: href } = await page.waitForFunction(() => {
    // return location.hash; // Can cause stuck
    return location.href;
  });

  if (/.+(#.+)/.exec(href)) {
    return href.replace(/.+(#.+)/, "$1");
  }

  return "";
};

test("o-router hash router", async ({ page }) => {
  await page.goto("http://localhost:3348/libs/router/test/router-test.html");

  expect(await getHash(page)).toBe("");

  await page.getByTestId("gotohome").click();
  await new Promise((res) => setTimeout(res, 500));
  expect(await getHash(page)).toBe("#/test/pages/home.html?count=2");

  await page.getByTestId("gotohome").click();
  await new Promise((res) => setTimeout(res, 500));
  expect(await getHash(page)).toBe("#/test/pages/home.html?count=3");

  await page.getByTestId("back").click();
  await new Promise((res) => setTimeout(res, 500));
  expect(await getHash(page)).toBe("#/test/pages/home.html?count=2");

  await page.getByTestId("replacetohome").click();
  await new Promise((res) => setTimeout(res, 500));
  expect(await getHash(page)).toBe("#/test/pages/home.html?count=250");

  await page.getByTestId("back").click();
  await new Promise((res) => setTimeout(res, 500));
  expect(await getHash(page)).toBe("");

  await page.getByTestId("gotohome").click();
  await new Promise((res) => setTimeout(res, 500));
  await page.getByTestId("gotohome").click();
  await new Promise((res) => setTimeout(res, 500));

  await page.goBack();
  expect(await getHash(page)).toBe("#/test/pages/home.html?count=2");
  await new Promise((res) => setTimeout(res, 500));
  await expect(page.getByTestId("first-div")).toHaveText(
    new RegExp('{"count":"2"}')
  );

  await page.goForward();
  expect(await getHash(page)).toBe("#/test/pages/home.html?count=3");
  await new Promise((res) => setTimeout(res, 500));
  await expect(page.getByTestId("first-div")).toHaveText(
    new RegExp('{"count":"3"}')
  );

  await page.waitForFunction(() => {
    history.go(-2);

    return true;
  });
  expect(await getHash(page)).toBe("");
  await new Promise((res) => setTimeout(res, 500));
  await expect(page.getByTestId("first-div")).toHaveText(
    new RegExp('{"count":"1"}')
  );

  await page.waitForFunction(() => {
    history.go(2);

    return true;
  });
  expect(await getHash(page)).toBe("#/test/pages/home.html?count=3");
  await new Promise((res) => setTimeout(res, 500));
  await expect(page.getByTestId("first-div")).toHaveText(
    new RegExp('{"count":"3"}')
  );
});

test("Direct access", async ({ page }) => {
  await page.goto(
    "http://localhost:3348/libs/router/test/router-test.html#/test/pages/home.html?count=501"
  );

  await new Promise((res) => setTimeout(res, 500));
  await expect(page.getByTestId("first-div")).toHaveText(
    new RegExp('{"count":"501"}')
  );
});
