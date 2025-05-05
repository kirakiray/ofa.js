import $ from "../xhear/base.mjs";

$.register({
  tag: "match-var",
  temp: `<style>:host{display:none !important; }</style>`,
  data: {},
  proto: {
    updateStyle() {
      if (!this.__style) {
        this.__style = $("<style></style>");
        this.before(this.__style);
      }

      // 获取style内容后，清除内容
      const styleContent = this.$("style").text;

      // 获取属性值
      const attrs = Array.from(this.ele.attributes);

      this.__style.html = `@container ${attrs
        .map((attr) => `style(--${attr.name}: ${attr.value})`)
        .join(" and ")} {${styleContent}}`;

      // this.__style.html = `@container style(--${attrs[0].name}:${attrs[0].value}){${styleContent}}`;

      // 清空内容
      this.html = "";
    },
  },
  attached() {
    this.updateStyle();
  },
  detached() {
    if (this.__style) {
      this.__style.remove();
      this.__style = null;
    }
  },
});

/**
 * 检测浏览器是否原生支持 @container style 查询
 * @returns {boolean} 返回是否支持
 */
function supportsContainerStyleQueries() {
  try {
    // 创建测试用的DOM元素
    const container = document.createElement("div");
    const child = document.createElement("div");

    // 设置容器和子元素的样式
    container.style.cssText = `
          container-type: style;
          position: absolute;
          left: -9px;
          width: 1px;
          height: 1px;
          overflow: hidden;
          --test-prop: true;
        `;

    child.style.cssText = `
          position: absolute;
        `;

    // 添加测试样式
    const style = document.createElement("style");
    style.textContent = `
          @container style(--test-prop: true) {
            #match-var-test-child {
              font-family: "match-var-test";
            }
          }
        `;

    // 组装DOM结构
    container.id = "match-var-test-container";
    child.id = "match-var-test-child";
    container.appendChild(child);
    document.body.appendChild(style);
    document.body.appendChild(container);

    // 检测是否应用了样式
    const isSupported = window
      .getComputedStyle(child)
      .fontFamily.includes("match-var-test");

    // 清理测试元素
    document.body.removeChild(style);
    document.body.removeChild(container);

    return isSupported;
  } catch (err) {
    console.error(err);
    return false;
  }
}

const supportStyleQueries = supportsContainerStyleQueries();
