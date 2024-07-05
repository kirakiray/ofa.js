// const error_origin = "http://127.0.0.1:5793/errors";
const error_origin = "https://ofajs.github.io/ofa-errors/errors";

// 存放错误信息的数据对象
const errors = {};

if (globalThis.navigator && navigator.language) {
  fetch(`${error_origin}/${navigator.language.toLowerCase()}.json`)
    .catch(() => {
      return fetch(`${error_origin}/default.json`);
    })
    .then((e) => e.json())
    .catch((err) => {
      console.error(err);
      return {};
    })
    .then((data) => {
      Object.assign(errors, data);
    });
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
  const desc = getErrDesc(key, options);

  let errObj;
  if (error) {
    errObj = new Error(desc, { cause: error });
  } else {
    errObj = new Error(desc);
  }
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
