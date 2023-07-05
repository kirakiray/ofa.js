import Onion from "./onion.mjs";

export const processor = {};

const addHandler = (name, handler) => {
  const oni = processor[name] || (processor[name] = new Onion());
  oni.use(handler);
};

export const use = (name, handler) => {
  if (name instanceof Function) {
    handler = name;
    name = ["js", "mjs"];
  }

  if (name instanceof Array) {
    name.forEach((name) => {
      addHandler(name, handler);
    });
    return;
  }

  addHandler(name, handler);
};

use(["mjs", "js"], async (ctx, next) => {
  if (!ctx.result) {
    const { url, params } = ctx;
    const d = new URL(url);
    if (params.includes("-direct")) {
      ctx.result = await import(url);
    }
    ctx.result = await import(`${d.origin}${d.pathname}`);
  }

  await next();
});

use(["txt", "html"], async (ctx, next) => {
  if (!ctx.result) {
    const { url } = ctx;
    ctx.result = await fetch(url).then((e) => e.text());
  }

  await next();
});

use("json", async (ctx, next) => {
  if (!ctx.result) {
    const { url } = ctx;

    ctx.result = await fetch(url).then((e) => e.json());
  }

  await next();
});

use("wasm", async (ctx, next) => {
  if (!ctx.result) {
    const { url } = ctx;

    const data = await fetch(url).then((e) => e.arrayBuffer());

    const module = await WebAssembly.compile(data);
    const instance = new WebAssembly.Instance(module);

    ctx.result = instance.exports;
  }

  await next();
});
