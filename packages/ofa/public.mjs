import { nextTick } from "../stanz/public.mjs";
import { searchEle } from "../xhear/public.mjs";
import { path } from "../drill.js/config.mjs";
import { eleX } from "../xhear/util.mjs";

export const resolvePath = path;

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

  searchEle(ele, "template").forEach((el) => {
    fixRelate(el.content, path);
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
    const err = new Error(`${desc}\n  ${error.stack}`, { cause: error });
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
      let lastSrc = pageSrc;
      const [realPageSrc] = pageSrc.split(" ");
      const pageSrcObj = new URL(realPageSrc);
      if (/\/$/.test(pageSrcObj.pathname)) {
        lastSrc += " .html";
      }

      defaults = await load(lastSrc);
    } catch (error) {
      let err;
      if (beforeSrc) {
        err = new Error(
          `${beforeSrc} request to parent page(${pageSrc}) fails; \n  ${error.stack}`,
          {
            cause: error,
          }
        );
      } else {
        err = new Error(
          `Request for ${pageSrc} page failed; \n  ${error.stack}`,
          {
            cause: error,
          }
        );
      }
      errorObj = err;

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
    pageSrc = resolvePath(defaults.parent, pageSrc);
  }

  return pagesData;
};

export const createPage = (src, defaults) => {
  // The $generated elements are not initialized immediately, so they need to be rendered in a normal container.
  const tempCon = document.createElement("div");

  tempCon.innerHTML = `<o-page src="${src}" data-pause-init="1"></o-page>`;

  const targetPage = eleX(tempCon.children[0]);

  nextTick(async () => {
    if (!targetPage._renderDefault) {
      await waitPageReaded(targetPage);
    }

    targetPage._renderDefault(defaults);
    targetPage.attr("data-pause-init", null);
  });

  return targetPage;
};

// In the firefox environment, there will be a problem that the page component is not initialized, but the routing starts to be initialized in advance, resulting in an error. Therefore, wait for the page component to be initialized before continuing with the subsequent operations.
export const waitPageReaded = (page) => {
  if (page._rendered) {
    return;
  }

  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (page._rendered) {
        clearInterval(timer);
        resolve();
      }
    }, 500);
  });
};
