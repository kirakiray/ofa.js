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

  // Fix the relative path of referenced resources
  Array.from(template.content.querySelectorAll("l-m,load-module")).forEach(
    (el) => el.setAttribute("relate-path", path)
  );

  return template.innerHTML;
}
