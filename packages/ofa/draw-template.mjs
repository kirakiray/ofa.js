const strToBase64DataURI = (str) => `data:application/json;base64,${btoa(str)}`;

// In the actual logical code, the generated code and the source code actually use the exact same logic, with only a change in line numbers. Therefore, it is only necessary to map the generated valid code back to the corresponding line numbers in the source file.
const getSourcemapUrl = (filePath, originContent, startLine) => {
  const originLineArr = originContent.split("\n");

  let mappings = "";

  for (let i = 0; i <= startLine; i++) {
    mappings += ";";
  }

  // Determine the starting line number of the source file.
  let originStarRowIndex = originLineArr.findIndex(
    (lineContent) => lineContent.trim() === "<script>"
  );
  // Since the valid code starts from the next line, increment the starting line number by one.
  originStarRowIndex++;

  // Determine the ending line number of the source file.
  let originEndRowIndex = originLineArr.findIndex(
    (lineContent) => lineContent.trim() === "</script>"
  );
  // Since the line with the script tag is not valid code, decrease the ending line number by one.
  originEndRowIndex--;

  // Calculate the actual count of valid code lines.
  let usefullLineCount = originEndRowIndex - originStarRowIndex;

  mappings += `AA${vlcEncode(originStarRowIndex)}A;`;

  while (usefullLineCount) {
    mappings += `AACA;`;
    usefullLineCount--;
  }

  const str = `{"version": 3,
    "file": "${filePath.replace(/.+\/(.+?)/, "$1").replace(".html", ".js")}",
    "sources": ["${filePath}"],
    "mappings": "${mappings}"}`;

  return strToBase64DataURI(str);
};

const cacheLink = {};

export function getContentInfo(content, url, isPage = true) {
  if (cacheLink[url]) {
    return cacheLink[url];
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

  const sourcemapStr = `//# sourceMappingURL=${getSourcemapUrl(
    url,
    content,
    beforeContent.split("\n").length
  )}`;

  const finalContent = `${fileContent}\n${sourcemapStr}`;

  const file = new File(
    [finalContent],
    location.pathname.replace(/.+\/(.+)/, "$1"),
    { type: "text/javascript" }
  );

  return (cacheLink[url] = URL.createObjectURL(file));
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
