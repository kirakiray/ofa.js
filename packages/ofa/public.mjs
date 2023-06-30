import { searchEle } from "../xhear/public.mjs";

export function resolvePath(moduleName, baseURI) {
  const baseURL = new URL(baseURI || location.href);
  if (
    // moduleName.startsWith("/") ||
    moduleName.startsWith("http://") ||
    moduleName.startsWith("https://")
  ) {
    return moduleName;
  }

  const moduleURL = new URL(moduleName, baseURL);
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

export const wrapErrorCall = async (callback, { self, desc }) => {
  try {
    await callback();
  } catch (error) {
    const err = new Error(`${desc}\n  ${error.stack}`);
    err.error = error;
    self.emit("error", { error: err });
    throw err;
  }
};
