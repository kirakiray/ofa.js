// const error_origin = "http://127.0.0.1:5793/errors";
const error_origin = "https://ofajs.github.io/ofa-errors/errors";

// 存放错误信息的数据对象
const errors = {};

if (globalThis.navigator && navigator.language) {
  let langFirst = navigator.language.toLowerCase().split("-")[0];

  if (langFirst === "zh" && navigator.language.toLowerCase() !== "zh-cn") {
    langFirst = "zhft";
  }

  (async () => {
    if (typeof localStorage !== "undefined") {
      if (localStorage["ofa-errors"]) {
        const targetLangErrors = JSON.parse(localStorage["ofa-errors"]);
        Object.assign(errors, targetLangErrors);
      }

      const errCacheTime = localStorage["ofa-errors-time"];

      if (!errCacheTime || Date.now() > Number(errCacheTime) + 5 * 60 * 1000) {
        const targetLangErrors = await fetch(
          `${error_origin}/${langFirst}.json`
        )
          .then((e) => e.json())
          .catch(() => null);

        if (targetLangErrors) {
          localStorage["ofa-errors"] = JSON.stringify(targetLangErrors);
          localStorage["ofa-errors-time"] = Date.now();
        } else {
          targetLangErrors = await fetch(`${error_origin}/en.json`)
            .then((e) => e.json())
            .catch((error) => {
              console.error(error);
              return null;
            });
        }

        Object.assign(errors, targetLangErrors);
      }
    }
  })();
}

let isSafari = false;
if (globalThis.navigator) {
  isSafari =
    navigator.userAgent.includes("Safari") &&
    !navigator.userAgent.includes("Chrome");
}

/**
 * 根据键、选项和错误对象生成错误对象。
 *
 * @param {string} key - 错误描述的键。
 * @param {Object} [options] - 映射相关值的选项对象。
 * @param {Error} [error] - 原始错误对象。
 * @returns {Error} 生成的错误对象。
 */
export const getErr = (key, options, error) => {
  let desc = getErrDesc(key, options);

  let errObj;
  if (error) {
    if (isSafari) {
      desc += `\nCaused by: ${error.toString()}\n`;

      if (error.stack) {
        desc += `  ${error.stack.replace(/\n/g, "\n    ")}`;
      }
    }
    errObj = new Error(desc, { cause: error });
  } else {
    errObj = new Error(desc);
  }
  errObj.code = key;
  return errObj;
};

/**
 * 根据键、选项生成错误描述
 *
 * @param {string} key - 错误描述的键。
 * @param {Object} [options] - 映射相关值的选项对象。
 * @returns {string} 生成的错误描述。
 */
export const getErrDesc = (key, options) => {
  if (!errors[key]) {
    return `Error code: "${key}", please go to https://github.com/ofajs/ofa-errors to view the corresponding error information`;
  }

  let desc = errors[key];

  // 映射相关值
  if (options) {
    for (let k in options) {
      desc = desc.replace(new RegExp(`{${k}}`, "g"), options[k]);
    }
  }

  return desc;
};
