// Customized Components
drill.ext(({ addProcess }) => {
  addProcess("Component", async ({ respone, record, relativeLoad }) => {
    let result = respone;

    if (isFunction(respone)) {
      result = await respone({
        load: relativeLoad,
        FILE: record.src,
      });
    }

    const defaults = await getDefaults(record, relativeLoad, result);

    // Register Component
    register(defaults);

    record.done(async (pkg) => {});
  });
});

const getDefaults = async (record, relativeLoad, result) => {
  const defaults = {
    // Static template
    temp: "",
    // static template address
    tempsrc: "",
    // The following are the component data that comes with X shear
    // tag: "",
    data: {},
    attrs: {},
    proto: {},
    watch: {},
    // created() { },
    // ready() { },
    // attached() { },
    // detached() { },
  };

  Object.assign(defaults, result);

  let defineName = new URL(record.src).pathname
    .replace(/.*\/(.+)/, "$1")
    .replace(/\.js$/, "");

  // Component name correction
  if (!defaults.tag) {
    defaults.tag = defineName;
  }

  // Get Template
  if (defaults.temp === "") {
    let { tempsrc } = defaults;

    // Get temp of the same name as the module
    let temp = await relativeLoad(tempsrc || `./${defineName}.html`);

    defaults.temp = await fixRelativeSource(temp, relativeLoad);
  }

  return defaults;
};

// Fix the resource address in temp
const fixRelativeSource = async (temp, relativeLoad) => {
  // Fix all resource addresses to include content within the template
  let tempEle = document.createElement("template");
  tempEle.innerHTML = temp;

  // Fix all links
  let hrefEles = tempEle.content.querySelectorAll("[href]");
  let srcEles = tempEle.content.querySelectorAll("[src]");
  let hasStyleEle = tempEle.content.querySelectorAll(`[style*="url("]`);

  // All processes
  const pms = [];

  hrefEles &&
    Array.from(hrefEles).forEach((ele) => {
      pms.push(
        (async () => {
          let relative_href = await relativeLoad(
            `${ele.getAttribute("href")} -link`
          );
          ele.setAttribute("href", relative_href);
        })()
      );
    });

  srcEles &&
    Array.from(srcEles).forEach((ele) => {
      pms.push(
        (async () => {
          let relative_src = await relativeLoad(
            `${ele.getAttribute("src")} -link`
          );
          ele.setAttribute("src", relative_src);
        })()
      );
    });

  // Fix style resource address
  hasStyleEle &&
    Array.from(hasStyleEle).forEach((ele) => {
      pms.push(
        (async () => {
          ele.setAttribute(
            "style",
            await fixStyleUrl(ele.getAttribute("style"), relativeLoad)
          );
        })()
      );
    });

  let styles = tempEle.content.querySelectorAll("style");
  styles &&
    Array.from(styles).forEach((style) => {
      pms.push(
        (async () => {
          style.innerHTML = await fixStyleUrl(style.innerHTML, relativeLoad);
        })()
      );
    });

  await Promise.all(pms);

  return tempEle.innerHTML;
};

// Fix the resource address on the style string
const fixStyleUrl = async (styleStr, relativeLoad) => {
  let m_arr = styleStr.match(/url\(.+?\)/g);

  if (m_arr) {
    await Promise.all(
      m_arr.map(async (url) => {
        let url_str = url.replace(/url\((.+?)\)/, "$1");
        let n_url = await relativeLoad(`${url_str} -link`);

        styleStr = styleStr.replace(url, `url(${n_url})`);
      })
    );
  }

  return styleStr;
};
