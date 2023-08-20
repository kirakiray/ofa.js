import { test, expect } from "@playwright/test";

const getColor = (page, testid) => {
  return page.$eval(`[data-testid='${testid}']`, (el) => {
    const style = window.getComputedStyle(el);
    return style.color;
  });
};

test("host link and style", async ({ page }) => {
  await page.goto(
    "http://localhost:3348/test/cases/inject-host/test-host-link.html"
  );

  await new Promise((res) => setTimeout(res, 50));
  expect(await getColor(page, "interfered-element")).toBe("rgb(255, 0, 0)");
  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 128, 0)");

  await page.getByTestId("removelast-btn").click();
  await new Promise((res) => setTimeout(res, 50));
  expect(await getColor(page, "interfered-element")).toBe("rgb(255, 0, 0)");
  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 128, 0)");

  await page.getByTestId("removeall-btn").click();
  await new Promise((res) => setTimeout(res, 50));
  expect(await getColor(page, "interfered-element")).toBe("rgb(0, 0, 0)");
  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 0, 0)");

  await page.getByTestId("additem-btn").click();
  await new Promise((res) => setTimeout(res, 50));
  expect(await getColor(page, "interfered-element")).toBe("rgb(255, 0, 0)");
  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 128, 0)");

  await page.getByTestId("removelast-btn").click();
  await new Promise((res) => setTimeout(res, 50));
  expect(await getColor(page, "interfered-element")).toBe("rgb(0, 0, 0)");
  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 0, 0)");
});

test("host link change href", async ({ page }) => {
  await page.goto(
    "http://localhost:3348/test/cases/inject-host/test-host-link.html"
  );

  await page.getByTestId("removeall-btn").click();
  await new Promise((res) => setTimeout(res, 50));

  await page.getByTestId("additem-btn").click();
  await new Promise((res) => setTimeout(res, 50));

  expect(await getColor(page, "interfered-element")).toBe("rgb(255, 0, 0)");

  await page.getByRole("button", { name: "Switch link" }).click();
  await new Promise((res) => setTimeout(res, 50));

  expect(await getColor(page, "interfered-element")).toBe("rgb(255, 0, 179)");

  await page.getByRole("button", { name: "Switch link" }).click();
  await new Promise((res) => setTimeout(res, 50));

  expect(await getColor(page, "interfered-element")).toBe("rgb(255, 0, 0)");

  await page.getByRole("button", { name: "remove link" }).click();
  await new Promise((res) => setTimeout(res, 50));

  expect(await getColor(page, "interfered-element")).toBe("rgb(0, 0, 0)");
});

test("host style change text", async ({ page }) => {
  await page.goto(
    "http://localhost:3348/test/cases/inject-host/test-host-link.html"
  );

  await page.getByTestId("removeall-btn").click();
  await new Promise((res) => setTimeout(res, 50));

  await page.getByTestId("additem-btn").click();
  await new Promise((res) => setTimeout(res, 50));

  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 128, 0)");
  expect(await getColor(page, "interfered-element-3")).toBe("rgb(0, 0, 0)");

  await page.getByRole("button", { name: "Switch style" }).click();
  await new Promise((res) => setTimeout(res, 50));

  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 128, 0)");
  expect(await getColor(page, "interfered-element-3")).toBe(
    "rgb(138, 151, 52)"
  );

  await page.getByRole("button", { name: "Switch style" }).click();
  await new Promise((res) => setTimeout(res, 50));

  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 128, 0)");
  expect(await getColor(page, "interfered-element-3")).toBe("rgb(0, 0, 0)");

  await page.getByRole("button", { name: "Switch style" }).click();
  await new Promise((res) => setTimeout(res, 50));

  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 128, 0)");
  expect(await getColor(page, "interfered-element-3")).toBe(
    "rgb(138, 151, 52)"
  );

  await page.getByRole("button", { name: "remove style" }).click();
  await new Promise((res) => setTimeout(res, 50));

  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 0, 0)");
  expect(await getColor(page, "interfered-element-3")).toBe(
    "rgb(138, 151, 52)"
  );

  await page.getByRole("button", { name: "remove style" }).click();
  await new Promise((res) => setTimeout(res, 50));

  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 0, 0)");
  expect(await getColor(page, "interfered-element-3")).toBe("rgb(0, 0, 0)");
});

test("inject multi style and link", async ({ page }) => {
  await page.goto(
    "http://localhost:3348/test/cases/inject-host/test-host-link.html"
  );
  await new Promise((res) => setTimeout(res, 50));

  expect(await getColor(page, "interfered-element")).toBe("rgb(255, 0, 0)");
  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 128, 0)");
  expect(await getColor(page, "interfered-element-3")).toBe("rgb(0, 0, 0)");

  // await page.getByRole("button", { name: "Switch style" }).click();
  await page
    .locator("test-item")
    .filter({
      hasText:
        "C C-1 C-1-1 interfered-element in item interfered-element-2 in item change e2 ho",
    })
    .getByRole("button", { name: "Switch style" })
    .nth(3)
    .click();
  await new Promise((res) => setTimeout(res, 50));

  expect(await getColor(page, "interfered-element")).toBe("rgb(255, 0, 0)");
  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 128, 0)");
  expect(await getColor(page, "interfered-element-3")).toBe(
    "rgb(138, 151, 52)"
  );

  await page.getByRole("button", { name: "remove last" }).click();
  await new Promise((res) => setTimeout(res, 50));

  expect(await getColor(page, "interfered-element")).toBe("rgb(255, 0, 0)");
  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 128, 0)");
  expect(await getColor(page, "interfered-element-3")).toBe("rgb(0, 0, 0)");

  await page
    .getByRole("button", { name: "change e2 host style" })
    .nth(4)
    .click();
  await new Promise((res) => setTimeout(res, 50));

  expect(await getColor(page, "interfered-element")).toBe("rgb(255, 0, 0)");
  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 0, 255)");
  expect(await getColor(page, "interfered-element-3")).toBe("rgb(0, 0, 0)");

  await page.getByRole("button", { name: "remove last" }).click();
  await new Promise((res) => setTimeout(res, 50));

  expect(await getColor(page, "interfered-element")).toBe("rgb(255, 0, 0)");
  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 128, 0)");
  expect(await getColor(page, "interfered-element-3")).toBe("rgb(0, 0, 0)");

  await page.getByRole("button", { name: "Switch link" }).nth(3).click();
  await new Promise((res) => setTimeout(res, 50));

  expect(await getColor(page, "interfered-element")).toBe("rgb(255, 0, 179)");
  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 128, 0)");
  expect(await getColor(page, "interfered-element-3")).toBe("rgb(0, 0, 0)");

  await page.getByRole("button", { name: "remove last" }).click();
  await new Promise((res) => setTimeout(res, 50));

  expect(await getColor(page, "interfered-element")).toBe("rgb(255, 0, 0)");
  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 128, 0)");
  expect(await getColor(page, "interfered-element-3")).toBe("rgb(0, 0, 0)");

  await page.getByRole("button", { name: "remove last" }).click();
  await new Promise((res) => setTimeout(res, 50));
  await page.getByRole("button", { name: "remove last" }).click();
  await new Promise((res) => setTimeout(res, 50));

  expect(await getColor(page, "interfered-element")).toBe("rgb(255, 0, 0)");
  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 128, 0)");
  expect(await getColor(page, "interfered-element-3")).toBe("rgb(0, 0, 0)");

  await page.getByRole("button", { name: "remove link" }).click();
  await new Promise((res) => setTimeout(res, 50));

  expect(await getColor(page, "interfered-element")).toBe("rgb(0, 0, 0)");
  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 128, 0)");
  expect(await getColor(page, "interfered-element-3")).toBe("rgb(0, 0, 0)");

  await page.getByRole("button", { name: "remove style" }).click();
  await new Promise((res) => setTimeout(res, 50));

  expect(await getColor(page, "interfered-element")).toBe("rgb(0, 0, 0)");
  expect(await getColor(page, "interfered-element-2")).toBe("rgb(0, 0, 0)");
  expect(await getColor(page, "interfered-element-3")).toBe("rgb(0, 0, 0)");
});
