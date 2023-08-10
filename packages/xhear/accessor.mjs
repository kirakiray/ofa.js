import { eleX } from "./util.mjs";
import { handler as stanzHandler } from "../stanz/accessor.mjs";

export const handler = {
  set(target, key, value, receiver) {
    if (!/\D/.test(String(key))) {
      return Reflect.set(target, key, value, receiver);
    }

    return stanzHandler.set(target, key, value, receiver);
  },
  get(target, key, receiver) {
    if (!/\D/.test(String(key))) {
      return eleX(target.ele.children[key]);
    }

    return Reflect.get(target, key, receiver);
  },
  ownKeys(target) {
    let keys = Reflect.ownKeys(target);
    let len = target.ele.children.length;
    for (let i = 0; i < len; i++) {
      keys.push(String(i));
    }
    return keys;
  },
  getOwnPropertyDescriptor(target, key) {
    if (typeof key === "string" && !/\D/.test(key)) {
      return {
        enumerable: true,
        configurable: true,
      };
    }
    return Reflect.getOwnPropertyDescriptor(target, key);
  },
};
