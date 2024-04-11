import { resolvePath } from "./public.mjs";
import $ from "../xhear/base.mjs";

const cachesURL = new Map();

const strToBase64DataURI = async (str, type, isb64 = true) => {
  if (cachesURL.has(str)) {
    return cachesURL.get(str);
  }

  const mime = type === "js" ? "text/javascript" : "application/json";

  const file = new File([str], "genfile", { type: mime });

  let finallyUrl = "";

  if (!isb64) {
    finallyUrl = URL.createObjectURL(file);
  } else {
    finallyUrl = await new Promise((resolve) => {
      const fr = new FileReader();

      fr.onload = (e) => {
        resolve(e.target.result);
      };

      fr.readAsDataURL(file);
    });
  }

  cachesURL.set(str, finallyUrl);

  return finallyUrl;
};

// In the actual logical code, the generated code and the source code actually use the exact same logic, with only a change in line numbers. Therefore, it is only necessary to map the generated valid code back to the corresponding line numbers in the source file.
const getSourcemapUrl = async (filePath, originContent, startLine) => {
  const originLineArr = originContent.split("\n");

  let mappings = "";

  for (let i = 0; i <= startLine; i++) {
    mappings += ";";
  }

  // Determine the starting line number of the source file.
  const originStarRowIndex = originLineArr.findIndex(
    (lineContent) => lineContent.trim() === "<script>"
  );

  // Determine the ending line number of the source file.
  const originEndRowIndex = originLineArr.findIndex(
    (lineContent) => lineContent.trim() === "</script>"
  );

  let beforeRowIndex = 0;
  let beforeColIndex = 0;

  for (let rowId = originStarRowIndex + 1; rowId < originEndRowIndex; rowId++) {
    const target = originLineArr[rowId];

    let rowStr = "";

    Array.from(target).forEach((e, colId) => {
      const currentStr = `AA${vlcEncode(rowId - beforeRowIndex)}${vlcEncode(
        colId - beforeColIndex
      )}`;

      if (!rowStr) {
        rowStr = currentStr;
      } else {
        rowStr += `,${currentStr}`;
      }

      beforeRowIndex = rowId;
      beforeColIndex = colId;
    });

    mappings += `${rowStr};`;
  }

  const sourcesContent = JSON.stringify([originContent])
    .replace(/^\[/, "")
    .replace(/\]$/, "");

  const str = `{"version": 3,
    "file": "${filePath
      .replace(/\?.+/, "")
      .replace(/.+\/(.+?)/, "$1")
      .replace(".html", ".js")}",
    "sources": ["${filePath.replace(/\?.+/, "")}"],
    "sourcesContent":[${sourcesContent}],
    "mappings": "${mappings}"}`;

  return await strToBase64DataURI(str, null);
};

let drawWithBlob = false;
if (document.currentScript) {
  drawWithBlob =
    document.currentScript.attributes.hasOwnProperty("draw-with-blob") !== null;
}

const cacheLink = new Map();

export async function drawUrl(content, url, isPage = true) {
  let targetUrl = cacheLink.get(url);
  if (targetUrl) {
    return targetUrl;
  }

  let isDebug = true;

  if ($.hasOwnProperty("debugMode")) {
    isDebug = $.debugMode;
  }

  const tempEl = $("<template></template>");
  tempEl.html = content;
  const titleEl = tempEl.$("title");

  const targetTemp = tempEl.$(`template[${isPage ? "page" : "component"}]`);
  const scriptEl = targetTemp.$("script");

  scriptEl && scriptEl.remove();

  // If there is no content other than the <script>, then the shadow root is not set.
  const hasTemp = !!targetTemp.html
    .replace(/\<\!\-\-[\s\S]*?\-\-\>/g, "")
    .trim();
  let temp = "";

  if (hasTemp) {
    temp =
      "<style>*:not(:defined){display:none;}</style>" +
      targetTemp.html
        .replace(/\s+$/, "")
        .replace(/`/g, "\\`")
        .replace(/\$\{/g, "\\${");
  }

  const beforeContent = `
  export const type = ${isPage ? "ofa.PAGE" : "ofa.COMP"};
  ${isPage && titleEl ? `export const title = '${titleEl.text}';` : ""}
  export const temp = \`${temp}\`;`;

  let scriptContent = "";
  if (scriptEl) {
    scriptContent = scriptEl.html
      .split(/;/g)
      .map((content) => {
        const t_content = content.trim();
        // Confirm it is an import reference and correct the address
        if (/^import[ \{'"]/.test(t_content)) {
          // Update address string directly
          return content.replace(/['"]([\s\S]+)['"]/, (arg0, pathStr) => {
            return `"${resolvePath(pathStr, url)}"`;
          });
        }
        return content;
      })
      .join(";");
  }

  const fileContent = `${beforeContent};
${scriptContent}`;

  let sourcemapStr = "";

  if (isDebug) {
    sourcemapStr = `//# sourceMappingURL=${await getSourcemapUrl(
      url,
      content,
      beforeContent.split("\n").length
    )}`;
  }

  const finalContent = `${fileContent}\n${sourcemapStr}`;

  const isFirefox = navigator.userAgent.includes("Firefox");

  targetUrl = strToBase64DataURI(
    finalContent,
    "js",
    isFirefox || drawWithBlob ? false : true
  );

  cacheLink.set(url, targetUrl);

  return targetUrl;
}

const base64 =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function toVLQSigned(value) {
  return value < 0 ? (-value << 1) + 1 : (value << 1) + 0;
}

function vlcEncode(value) {
  let encoded = "";
  let vlq = toVLQSigned(value);

  do {
    let digit = vlq & 0b11111;
    vlq >>>= 5;
    if (vlq > 0) {
      digit |= 0b100000;
    }
    encoded += base64[digit];
  } while (vlq > 0);

  return encoded;
}
