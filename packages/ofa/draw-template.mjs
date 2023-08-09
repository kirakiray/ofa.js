const strToBase64DataURI = async (str, type) => {
  const mime = type === "js" ? "text/javascript" : "application/json";

  const file = new File([str], "test", { type: mime });

  const result = await new Promise((resolve) => {
    const fr = new FileReader();

    fr.onload = (e) => {
      resolve(e.target.result);
    };

    fr.readAsDataURL(file);
  });

  return result;
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

    let rowStr = `AA${vlcEncode(rowId - beforeRowIndex)}A`;

    mappings += `${rowStr};`;
    beforeRowIndex = rowId;
  }

  console.log("mappings => ", mappings);

  const str = `{"version": 3,
    "file": "${filePath.replace(/.+\/(.+?)/, "$1").replace(".html", ".js")}",
    "sources": ["${filePath}"],
    "mappings": "${mappings}"}`;

  return await strToBase64DataURI(str);
};

const cacheLink = new Map();

export async function getContentInfo(content, url, isPage = true) {
  let targetUrl = cacheLink.get(url);
  if (targetUrl) {
    return targetUrl;
  }

  const tempEl = $("<template></template>");
  tempEl.html = content;
  const titleEl = tempEl.$("title");

  const targetTemp = tempEl.$(`template[${isPage ? "page" : "component"}]`);
  const scriptEl = targetTemp.$("script");

  scriptEl && scriptEl.remove();

  const beforeContent = `
  export const type = ${isPage ? "$.PAGE" : "$.COMP"};
  export const PATH = '${url}';
  ${isPage && titleEl ? `export const title = '${titleEl.text}';` : ""}
  export const temp = \`${targetTemp.html.replace(/\s+$/, "")}\`;`;

  const fileContent = `${beforeContent};
${scriptEl ? scriptEl.html : ""}`;

  const sourcemapStr = `//# sourceMappingURL=${await getSourcemapUrl(
    url,
    content,
    beforeContent.split("\n").length
  )}`;

  const finalContent = `${fileContent}\n${sourcemapStr}`;

  targetUrl = strToBase64DataURI(finalContent, "js");

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
