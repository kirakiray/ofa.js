import Onion from "./onion.mjs";

export const caches = new Map();
const wrapFetch = async (url) => {
  let fetchObj = caches.get(url);

  if (!fetchObj) {
    fetchObj = fetch(url);
    caches.set(url, fetchObj);
  }

  const resp = await fetchObj;

  return resp.clone();
};

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

    const notHttp = /^blob:/.test(url) || /^data:/.test(url);
    try {
      if (notHttp || params.includes("-direct")) {
        ctx.result = await import(url);
      } else {
        ctx.result = await import(`${d.origin}${d.pathname}`);
      }
    } catch (error) {
      const err = wrapError(
        `Failed to load module ${ctx.realUrl || url}`,
        error
      );

      if (notHttp) {
        console.log("Failed to load module:", ctx);
      }

      throw err;
    }
  }

  await next();
});

use(["txt", "html", "htm"], async (ctx, next) => {
  if (!ctx.result) {
    const { url } = ctx;

    let resp;
    try {
      resp = await wrapFetch(url);
    } catch (error) {
      throw wrapError(`Load ${url} failed`, error);
    }

    if (!/^2.{2}$/.test(resp.status)) {
      throw new Error(`Load ${url} failed: status code ${resp.status}`);
    }

    ctx.result = await resp.text();
  }

  await next();
});

use("json", async (ctx, next) => {
  if (!ctx.result) {
    const { url } = ctx;

    ctx.result = await wrapFetch(url).then((e) => e.json());
  }

  await next();
});

use("wasm", async (ctx, next) => {
  if (!ctx.result) {
    const { url } = ctx;

    const data = await wrapFetch(url).then((e) => e.arrayBuffer());

    const module = await WebAssembly.compile(data);
    const instance = new WebAssembly.Instance(module);

    ctx.result = instance.exports;
  }

  await next();
});

use("css", async (ctx, next) => {
  if (!ctx.result) {
    const { url, element } = ctx;

    if (element) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;

      const root = element.getRootNode();

      if (root === document) {
        root.head.append(link);
      } else {
        root.appendChild(link);
      }

      let f;
      element.addEventListener(
        "disconnected",
        (f = (e) => {
          link.remove();
          element.removeEventListener("disconnected", f);
        })
      );
    } else {
      ctx.result = await wrapFetch(url).then((e) => e.text());
    }
  }

  await next();
});

const wrapError = (desc, error) => {
  const err = new Error(`${desc} \n  ${error.toString()}`);
  err.error = error;
  return err;
};
