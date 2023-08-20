import $ from "../xhear/base.mjs";
import { eleX } from "../xhear/util.mjs";
import { getHash } from "./public.mjs";

$.register({
  tag: "inject-host",
  temp: `<slot></slot>`,
  data: {},
  proto: {
    init() {
      if (!this.ele.isConnected) {
        return;
      }

      this.forEach((e) => this._init(e));
    },

    _init(e) {
      if (e.ele.__inited) {
        return;
      }

      switch (e.tag) {
        case "link":
          this._initLink(e);
          break;
        case "style":
          this._initStyle(e);
          break;
        case "x-if":
        case "x-else-if":
        case "x-else":
        case "x-fill":
          // Components of a rendered nature do not need to be alerted
          break;
        default:
          console.log(
            `This element will be invalidated within the inject-host`,
            e
          );
      }
    },

    _initLink(e) {
      const href = e.attr("href");

      // 替换掉原来的 link ，防止污染自身的
      const replaceLink = $(`<link href="${href}" rel="host" />`);

      const ele = replaceLink.ele;

      ele.__inited = true;

      ele._revoke = () => {
        revokeLink(ele);
        ele._revoke = null;
      };

      e.before(replaceLink);
      e.remove();

      initLink(this, href, () => e.clone(), ele);
    },
    async _initStyle(e) {
      // 仅用 style 内文本，防止污染自身
      const com = new Comment(e.html);
      com.__inited = com;

      com._revoke = () => {
        revokeLink(e.ele);
        delete com.__inited;
        delete e.ele.__inited;
        com._revoke = null;
        e.ele._revoke = null;
      };

      e.html = "";
      e.push(com);
      e.ele.__inited = true;
      e.ele._revoke = com._revoke;

      const hash = await getHash(com.data);

      initLink(this, hash, () => $(`<style>${com.data}</style>`), e.ele);
    },
  },
  attached() {
    // 创建 MutationObserver 实例
    const observer = (this._obs = new MutationObserver((mutationsList) => {
      console.log("mutationsList:", mutationsList);
      for (let mutation of mutationsList) {
        if (mutation.type === "attributes") {
          if (mutation.attributeName === "x-bind-data") {
            // x component render
            continue;
          }

          // Logic for handling attribute changes
          debugger;
        } else if (mutation.type === "childList") {
          mutation.removedNodes.forEach((e) => {
            if (e.__inited) {
              e._revoke();
            }
          });

          mutation.addedNodes.forEach((e) => {
            if (!e.__inited) {
              if (e instanceof Text) {
                if (e.parentElement.tagName === "STYLE") {
                  // change style text
                  this.init(e.parentNode);
                }
              }

              if (e.__inited) {
                // Don't get involved if you've been initialized.
                return;
              }

              if (e instanceof Text || e instanceof Comment) {
                // Invalid content
                return;
              }

              this._init(eleX(e));
            }
          });
          // 子节点变化
        } else if (mutation.type === "characterData") {
          // 应该不会跑到这里
          debugger;
        }
      }
    }));

    const config = { attributes: true, childList: true, subtree: true };

    // 开始观察目标元素
    observer.observe(this.ele, config);

    this.init();
  },
  detached() {
    this.forEach((e) => revokeLink(e.ele));

    this._obs.disconnect();
  },
});

// 将 link 添加到 host 上
function initLink(injectEl, mark, cloneFunc, item) {
  const hostRoot = injectEl.host.root;

  let clink = hostRoot.$(`[inject-host="${mark}"]`);

  if (clink) {
    clink.ele.__items.add(item);
    item.__host_link = clink;
    return;
  }

  clink = cloneFunc();

  clink.attr("inject-host", mark);

  clink.ele.__items = new Set([item]);
  item.__host_link = clink;
  injectEl.host.root.push(clink);
}

function revokeLink(item) {
  if (item.__inited) {
    const items = item.__host_link.ele.__items;
    items.delete(item);

    if (!items.size) {
      item.__host_link.remove();
    }

    delete item.__inited;
  }
}
