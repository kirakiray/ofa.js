import { test, expect } from "@playwright/test";

test("load component", async ({ page }) => {
  await page.goto("http://localhost:3348/test/test-component.html");
  await page.getByPlaceholder("Enter something...").click();
  await page.getByPlaceholder("Enter something...").fill("test value");

  const result = await page.waitForFunction(async () => {
    return $("t-input").value;
  });

  await expect(result._preview).toBe("test value");

  await expect(page.getByTestId("outer")).toHaveText("test value");
});

const getColor = (page, testid) => {
  return page.$eval(`[data-testid='${testid}']`, (el) => {
    const style = window.getComputedStyle(el);
    return style.color;
  });
};

test("host link and host style", async ({ page }) => {
  await page.goto("http://localhost:3348/test/test-host-link.html");

  await new Promise((res) => setTimeout(res, 100));
  expect(await getColor(page, "interfered-element")).toBe("rgb(255, 0, 0)");
  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 128, 0)");

  await page.getByTestId("removelast-btn").click();
  await new Promise((res) => setTimeout(res, 100));
  expect(await getColor(page, "interfered-element")).toBe("rgb(255, 0, 0)");
  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 128, 0)");

  await page.getByTestId("removeall-btn").click();
  await new Promise((res) => setTimeout(res, 100));
  expect(await getColor(page, "interfered-element")).toBe("rgb(0, 0, 0)");
  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 0, 0)");

  await page.getByTestId("additem-btn").click();
  await new Promise((res) => setTimeout(res, 100));
  expect(await getColor(page, "interfered-element")).toBe("rgb(255, 0, 0)");
  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 128, 0)");

  await page.getByTestId("removelast-btn").click();
  await new Promise((res) => setTimeout(res, 100));
  expect(await getColor(page, "interfered-element")).toBe("rgb(0, 0, 0)");
  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 0, 0)");
});
