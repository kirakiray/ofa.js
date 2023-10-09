import { processor, use } from "./use.mjs";
import { aliasMap } from "./config.mjs";
export const LOADED = Symbol("loaded");

const createLoad = (meta) => {
  if (!meta) {
    meta = {
      url: document.location.href,
    };
  }
  const load = (ourl) => {
    let reurl = "";
    let [url, ...params] = ourl.split(" ");

    // Determine and splice the address of the alias
    const urlMathcs = url.split("/");
    if (/^@.+/.test(urlMathcs[0])) {
      if (aliasMap[urlMathcs[0]]) {
        urlMathcs[0] = aliasMap[urlMathcs[0]];
        url = urlMathcs.join("/");
      } else {
        throw `Can't find an alias address: '${urlMathcs[0]}'`;
      }
    }

    if (meta.resolve) {
      reurl = meta.resolve(url);
    } else {
      const currentUrl = new URL(meta.url);
      const resolvedUrl = new URL(url, currentUrl);
      reurl = resolvedUrl.href;
    }

    return agent(reurl, { params });
  };
  return load;
};

export const agent = async (url, opts) => {
  const urldata = new URL(url);
  const { pathname } = urldata;

  let type;
  let realUrl = null;

  opts.params &&
    opts.params.forEach((e) => {
      if (/^\..+/.test(e)) {
        type = e.replace(/^\.(.+)/, "$1");
      } else if (/^\-\-real/.test(e)) {
        realUrl = e.replace(/^\-\-real\:/, "");
      }
    });

  if (!type) {
    type = pathname.slice(((pathname.lastIndexOf(".") - 1) >>> 0) + 2);
  }

  const ctx = {
    url,
    result: null,
    realUrl,
    ...opts,
  };

  const oni = processor[type];

  if (oni) {
    await oni.run(ctx);
  } else {
    ctx.result = fetch(url);
  }

  if (opts && opts.element) {
    const { element } = opts;
    element[LOADED] = true;
    const event = new Event("load");
    element.dispatchEvent(event);
  }

  if (opts.params && opts.params.includes("-ctx")) {
    return ctx;
  }

  return ctx.result;
};

export default function lm(meta) {
  return createLoad(meta);
}

Object.assign(lm, {
  use,
});
