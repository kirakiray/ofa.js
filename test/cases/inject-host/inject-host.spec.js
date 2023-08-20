import { test, expect } from "@playwright/test";

const getColor = (page, testid) => {
  return page.$eval(`[data-testid='${testid}']`, (el) => {
    const style = window.getComputedStyle(el);
    return style.color;
  });
};

test("host link and style", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/inject-host/test-host-link.html");

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
