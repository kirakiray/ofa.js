import $ from "../xhear/base.mjs";
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

      this.forEach(async (e) => {
        if (e.ele.__inited) {
          return;
        }

        switch (e.tag) {
          case "link":
            const href = e.attr("href");

            // 替换掉原来的 link ，防止污染自身的
            const replaceLink = $(`<link href="${href}" rel="host" />`);

            replaceLink.ele.__inited = true;

            e.before(replaceLink);
            e.remove();

            initLink(this, href, () => e.clone(), replaceLink.ele);
            break;
          case "style":
            // 仅用 style 内文本，防止污染自身
            const com = new Comment(e.html);
            com.__inited = com;
            e.html = "";
            e.push(com);
            e.ele.__inited = true;

            const hash = await getHash(com.data);

            initLink(this, hash, () => $(`<style>${com.data}</style>`), e.ele);
            break;
          default:
            console.log(
              `The following elements are not valid within the object-host component and will be deleted`,
              e
            );

            e.remove();
        }
      });
    },
  },
  attached() {
    // 创建 MutationObserver 实例
    const observer = (this._obs = new MutationObserver(
      (mutationsList, observer) => {
        console.log("mutationsList:", mutationsList);
        for (let mutation of mutationsList) {
          if (mutation.type === "attributes") {
            // 属性变化的处理逻辑
          } else if (mutation.type === "childList") {
            mutation.removedNodes.forEach((e) => {
              if (e.__inited) {
                // 回收元素
                debugger;
              }
            });

            mutation.addedNodes.forEach((e) => {
              if (!e.__inited) {
                debugger;
              }
            });
            // 子节点变化
          } else if (mutation.type === "characterData") {
            // 文本内容变化的处理逻辑
            // 应该不会跑到这里
            debugger;
          }
        }
      }
    ));

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
  if (item.__inited && item.__host_link) {
    const items = item.__host_link.ele.__items;
    items.delete(item);

    if (!items.size) {
      item.__host_link.remove();
    }
  }
}
