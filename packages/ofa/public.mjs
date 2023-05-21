import { searchEle } from "../xhear/public.mjs";

export function resolvePath(moduleName, baseURI) {
  const baseURL = new URL(baseURI);
  // 如果是绝对路径，则直接返回
  if (
    moduleName.startsWith("/") ||
    moduleName.startsWith("http://") ||
    moduleName.startsWith("https://")
  ) {
    return moduleName;
  }

  // 如果是相对路径，则计算出绝对路径
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
