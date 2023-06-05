export const processor = {};

export const use = (name, handler) => {
  if (name instanceof Function) {
    handler = name;
    name = ["js", "mjs"];
  }

  if (name instanceof Array) {
    name.forEach((name) => {
      const tasks = processor[name] || (processor[name] = []);
      tasks.push(handler);
    });
    return;
  }

  const tasks = processor[name] || (processor[name] = []);
  tasks.push(handler);
};

use(["mjs", "js"], ({ url, params }) => {
  const d = new URL(url);
  if (params.includes("-direct")) {
    return import(url);
  }
  return import(`${d.origin}${d.pathname}`);
});

use(["txt", "html"], ({ url }) => {
  return fetch(url).then((e) => e.text());
});

use("json", async ({ url }) => {
  return fetch(url).then((e) => e.json());
});

use("wasm", async ({ url }) => {
  const data = await fetch(url).then((e) => e.arrayBuffer());

  const module = await WebAssembly.compile(data);
  const instance = new WebAssembly.Instance(module);

  return instance.exports;
});
