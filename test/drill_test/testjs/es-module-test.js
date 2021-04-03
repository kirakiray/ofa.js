(async () => {
    let mjs1 = await load("esmodule/m1.mjs");

    esModuleTest.ok(mjs1.output() === "I am m1", "es module ok 1");

    let mjs2 = await load("esmodule/m2 -mjs");

    esModuleTest.ok(mjs2.default.val == "I am m2.js", "es module ok 2");
})();