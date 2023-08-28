import { nextTick } from "../stanz/public.mjs";
import { searchEle } from "../xhear/public.mjs";

export function resolvePath(moduleName, baseURI) {
  const [url, ...params] = moduleName.split(" ");

  const baseURL = baseURI ? new URL(baseURI, location.href) : location.href;

  if (
    // moduleName.startsWith("/") ||
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  const moduleURL = new URL(url, baseURL);

  if (params.length) {
    return `${moduleURL.href} ${params.join(" ")}`;
  }

  return moduleURL.href;
}

export function fixRelate(ele, path) {
  searchEle(ele, "[href],[src]").forEach((el) => {
    ["href", "src"].forEach((name) => {
      const val = el.getAttribute(name);

      if (/^#/.test(val)) {
        return;
      }

      if (val && !/^(https?:)?\/\/\S+/.test(val)) {
        el.setAttribute(name, resolvePath(val, path));
      }
    });
  });
}

export function fixRelatePathContent(content, path) {
  const template = document.createElement("template");
  template.innerHTML = content;

  fixRelate(template.content, path);

  // fix Resource references within style
  searchEle(template.content, "style").forEach((styleEl) => {
    const html = styleEl.innerHTML;

    styleEl.innerHTML = html.replace(/url\((.+)\)/g, (original, adapted) => {
      return `url(${resolvePath(adapted, path)})`;
    });
  });

  return template.innerHTML;
}

export const wrapErrorCall = async (callback, { self, desc, ...rest }) => {
  try {
    await callback();
  } catch (error) {
    const err = new Error(`${desc}\n  ${error.stack}`);
    err.error = error;
    self.emit("error", { data: { error: err, ...rest } });
    throw err;
  }
};

export const ISERROR = Symbol("loadError");

export const getPagesData = async (src) => {
  const load = lm({
    url: src,
  });
  const pagesData = [];
  let defaults;
  let pageSrc = src;
  let beforeSrc;
  let errorObj;

  while (true) {
    try {
      defaults = await load(pageSrc);
    } catch (error) {
      if (beforeSrc) {
        const err = new Error(
          `${beforeSrc} request to parent page(${pageSrc}) fails; \n  ${error.stack}`
        );
        err.error = error;

        errorObj = err;
      } else {
        errorObj = error;
      }

      console.error(errorObj);
    }

    if (errorObj) {
      pagesData.unshift({
        src,
        ISERROR,
        error: errorObj,
      });
      break;
    }

    pagesData.unshift({
      src: pageSrc,
      defaults,
    });

    if (!defaults.parent) {
      break;
    }

    beforeSrc = pageSrc;
    pageSrc = new URL(defaults.parent, pageSrc).href;
  }

  return pagesData;
};

export const createPage = (src, defaults) => {
  // The $generated elements are not initialized immediately, so they need to be rendered in a normal container.
  const tempCon = document.createElement("div");

  tempCon.innerHTML = `<o-page src="${src}" style="display:block;"></o-page>`;

  const targetPage = $(tempCon.children[0]);
  targetPage._pause_init = 1;

  nextTick(() => {
    targetPage._renderDefault(defaults);

    delete targetPage._pause_init;
  });

  return targetPage;
};

export async function getHash(str, algorithm = "SHA-256") {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
