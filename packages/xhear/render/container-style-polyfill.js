











/**
 * 检测浏览器是否原生支持 @container style 查询
 * @returns {boolean} 返回是否支持
 */
function supportsContainerStyleQueries() {
  // 如果已经检测过，直接返回缓存结果
  if (supportsContainerStyleQueries.cached !== undefined) {
    return supportsContainerStyleQueries.cached;
  }

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
          #container-style-test-child {
            font-family: "container-style-test";
          }
        }
      `;

    // 组装DOM结构
    container.id = "container-style-test-container";
    child.id = "container-style-test-child";
    container.appendChild(child);
    document.body.appendChild(style);
    document.body.appendChild(container);

    // 检测是否应用了样式
    const isSupported = window
      .getComputedStyle(child)
      .fontFamily.includes("container-style-test");

    // 清理测试元素
    document.body.removeChild(style);
    document.body.removeChild(container);

    // 缓存结果
    supportsContainerStyleQueries.cached = isSupported;

    return isSupported;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export const supportStyleQueries = supportsContainerStyleQueries();
