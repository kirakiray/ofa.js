import { searchEle } from "../xhear/public.mjs";

export function resolvePath(moduleName, baseURI) {
  const [url, ...params] = moduleName.split(" ");

  const baseURL = new URL(baseURI || location.href);
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
