import { test, expect } from "@playwright/test";

test("provider and consumer attributes", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/context/normal.html");

  const c1_a = await page.evaluate(async () => {
    return $("#con1").customA;
  });

  const c1_a_attr = await page.evaluate(async () => {
    return $("#con1").ele.getAttribute("custom-a");
  });
  const c1_b_attr = await page.evaluate(async () => {
    return $("#con1").ele.getAttribute("custom-b");
  });

  await expect(c1_a).toBe("I am A");
  await expect(c1_a_attr).toBe(null);
  await expect(c1_b_attr).toBe(null);

  const c2_a = await page.evaluate(async () => {
    return $("#con2").customA;
  });

  const c2_a_attr = await page.evaluate(async () => {
    return $("#con2").ele.getAttribute("custom-a");
  });

  const c2_b_attr = await page.evaluate(async () => {
    return $("#con2").ele.getAttribute("custom-b");
  });

  await expect(c2_a).toBe("I am A");
  await expect(c2_a_attr).toBe("I am A");
  await expect(c2_b_attr).toBe(null);

  await new Promise((res) => setTimeout(res, 500));

  const c3_a = await page.evaluate(async () => {
    return $("#con3").customA;
  });

  const c3_a_attr = await page.evaluate(async () => {
    return $("#con3").ele.getAttribute("custom-a");
  });
  const c3_b_attr = await page.evaluate(async () => {
    return $("#con3").ele.getAttribute("custom-b");
  });

  await expect(c3_a).toBe("I am A");
  await expect(c3_a_attr).toBe(null);
  await expect(c3_b_attr).toBe("I am B");
});

test("change provider props", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/context/normal.html");

  await expect(await page.evaluate(() => $("#con1").customA)).toBe("I am A");
  await expect(await page.evaluate(() => $("#con2").customA)).toBe("I am A");

  await page.evaluate(() => {
    $("o-provider").customA = "change A";
    $("o-provider").customB = "change B";
  });

  await expect(await page.evaluate(() => $("#con1").customA)).toBe("change A");
  await expect(await page.evaluate(() => $("#con2").customA)).toBe("change A");
  await expect(await page.evaluate(() => $("#con1").customB)).toBe("change B");
  await expect(await page.evaluate(() => $("#con2").customB)).toBe("change B");

  await new Promise((res) => setTimeout(res, 500));

  await expect(await page.evaluate(() => $("#con3").customA)).toBe("change A");
  await expect(await page.evaluate(() => $("#con3").customB)).toBe("change B");
});

test("change consumer in shadow", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/context/normal.html");

  await new Promise((res) => setTimeout(res, 10));

  await expect(await page.evaluate(() => $("comp-two").ca)).toBe("I am A");

  await page.evaluate(() => {
    $("o-provider").customA = "change A";
  });

  await expect(await page.evaluate(() => $("comp-two").ca)).toBe("change A");
});

test("change provider in shadow", async ({ page }) => {
  await page.goto(
    "http://localhost:3348/test/cases/context/provider-in-shadow.html"
  );

  await new Promise((res) => setTimeout(res, 10));

  await expect(
    await page.evaluate(() => {
      return $("o-provider").consumers.length;
    })
  ).toBe(0);
  await expect(
    await page.evaluate(() => {
      return $("comp-one").shadow.$("o-provider").consumers.length;
    })
  ).toBe(3);

  await expect(await page.evaluate(() => $("#con5").customA)).toBe("A in One");
  await expect(await page.evaluate(() => $("#con5").customB)).toBe(null);
  await expect(await page.evaluate(() => $("#con5").customC)).toBe("C in One");

  await expect(
    await page.evaluate(() => $("comp-two").shadow.$("o-consumer").customA)
  ).toBe("A in One");
  await expect(
    await page.evaluate(() => $("comp-two").shadow.$("o-consumer").customB)
  ).toBe(null);
  await expect(
    await page.evaluate(() => $("comp-two").shadow.$("o-consumer").customC)
  ).toBe("C in One");

  await expect(await page.evaluate(() => $("#con6").customA)).toBe("A in One");
  await expect(await page.evaluate(() => $("#con6").customB)).toBe(null);
  await expect(await page.evaluate(() => $("#con6").customC)).toBe("C in One");

  await page.evaluate(() => {
    return ($("comp-one").shadow.$("o-provider").customA = "change A in One");
  });

  await expect(await page.evaluate(() => $("#con5").customA)).toBe(
    "change A in One"
  );
  await expect(
    await page.evaluate(() => $("comp-two").shadow.$("o-consumer").customA)
  ).toBe("change A in One");
  await expect(await page.evaluate(() => $("#con6").customA)).toBe(
    "change A in One"
  );
});
