# 路由模块说明

**cacheRouter** 缓存 `o-app` 的 `router` 值的功能，让`o-app`刷新后也不丢失页面数据；

**address** 地址栏监听，并修正路由；依赖**cacheRouter**模块；用于常规浏览器；

**slider** 边缘左侧向右滑动，可以返回上一页（带动画），模仿原生safari的交互体验；默认依赖**cacheRouter**模块；用于 standalone 模式下的移动端safari浏览器；

**auto** 路由自动适配，根据具体情况，进行上面模块的动态载入，以保证最好的体验效果；