import { processor, use } from "./use.mjs";

const createLoad = (meta) => {
  if (!meta) {
    meta = {
      url: document.location.href,
    };
  }
  const load = (url) => {
    let reurl = "";
    if (meta.resolve) {
      reurl = meta.resolve(url);
    } else {
      const currentUrl = new URL(meta.url);
      const resolvedUrl = new URL(url, currentUrl);
      reurl = resolvedUrl.href;
    }

    return agent(reurl);
  };
  return load;
};

export const agent = async (url, opts) => {
  const urldata = new URL(url);
  const { pathname } = urldata;

  const type = pathname.slice(((pathname.lastIndexOf(".") - 1) >>> 0) + 2);

  let data;

  const tasks = processor[type];

  if (tasks) {
    for (let f of tasks) {
      const temp = await f({
        url,
        data,
        ...opts,
      });

      temp !== undefined && (data = temp);
    }
  } else {
    data = fetch(url);
  }

  return data;
};

export default function lm(meta) {
  return createLoad(meta);
}

Object.assign(lm, {
  use,
});
