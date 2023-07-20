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

export function fixRelateSource(content, path) {
  const template = document.createElement("template");
  template.innerHTML = content;

  searchEle(template.content, "[href],[src]").forEach((el) => {
    ["href", "src"].forEach((name) => {
      let val = el.getAttribute(name);
      if (val) {
        el.setAttribute(name, resolvePath(val, path));
      }
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
    self.emit("error", { error: err, ...rest });
    throw err;
  }
};

export const ISERROR = Symbol("loadError");

export const getPagesData = async (src) => {
  const load = lm();
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
        // throw err;
      } else {
        errorObj = error;
        // throw error;
      }
    }

    if (errorObj) {
      pagesData.unshift({
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
  tempCon.innerHTML = `<o-page src="${src}" style="position:absolute;left:0;top:0;width:100%;height:100%;"></o-page>`;

  const targetPage = $(tempCon.children[0]);

  targetPage._renderDefault(defaults);

  return targetPage;
};
