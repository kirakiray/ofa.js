import { getType } from "../stanz/public.mjs";

export const isFunction = (val) => getType(val).includes("function");

export const hyphenToUpperCase = (str) =>
  str.replace(/-([a-z])/g, (match, p1) => {
    return p1.toUpperCase();
  });

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const isArrayEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0, len = arr1.length; i < len; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};

export const toDashCase = (str) => {
  return str.replace(/[A-Z]/g, function (match) {
    return "-" + match.toLowerCase();
  });
};

// Determine if an element is eligible
export const meetsEle = (ele, expr) => {
  const temp = document.createElement("template");
  temp.content.append(ele.cloneNode());
  return !!temp.content.querySelector(expr);
};

export function isEmptyObject(obj) {
  if (!obj) {
    return false;
  }
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

export function moveArrayValue(arr, oldValue, newIndex) {
  const oldIndex = arr.indexOf(oldValue);

  if (oldIndex === -1) {
    throw new Error("Value not found in array");
  }

  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr;
}

export const removeArrayValue = (arr, target) => {
  const index = arr.indexOf(target);
  if (index > -1) {
    arr.splice(index, 1);
  }
};

export const searchEle = (el, expr) => {
  if (el instanceof HTMLTemplateElement) {
    return Array.from(el.content.querySelectorAll(expr));
  }
  return Array.from(el.querySelectorAll(expr));
};
