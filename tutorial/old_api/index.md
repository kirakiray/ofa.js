# API 介绍

以下是 ofa.js API 的概览，你可以先浏览一遍，以备将来需要时再来查阅详细文档：

## 实例相关

- [$](./instance/dollar.md)：主要用于获取实例的方法
- [all](./instance/all.md)：获取所有相关实例
- [prev](./instance/prev.md)：获取目标元素的前一个实例
- [prevs](./instance/prevs.md)：获取目标元素前面的所有实例
- [next](./instance/next.md)：获取目标元素的后一个实例
- [nexts](./instance/nexts.md)：获取目标元素后面的所有实例
- [siblings](./instance/siblings.md)：获取目标元素的所有相邻元素实例
- [parent](./instance/parent.md)：获取父元素实例
- [parents](./instance/parents.md)：获取所有父元素的实例集
- [clone](./instance/clone.md)：克隆实例的方法
- [ele](./instance/ele.md)：获取实例的实际原生元素
- [shadow](./instance/shadow.md)：获取自定义组件的影子根节点
- [root](./instance/root.md)：获取目标实例的根节点
- [子元素](./instance/children.md)：通过数字直接获取子元素
- [host](./instance/host.md)：获取目标的 app 元素实例

## 节点操作

- [添加或删除子节点](./operation/array-like.md)
- [before](./operation/before.md)：在目标实例的前面添加元素
- [after](./operation/after.md)：在目标实例的后面添加元素
- [remove](./operation/remove.md)：删除目标元素
- [wrap](./operation/wrap.md)：将目标元素上包裹一层元素
- [unwrap](./operation/unwrap.md)：将目标元素去除包裹的元素

## 属性操作

- [text](./props/text.md)：获取或设置目标元素的文本
- [html](./props/html.md)：获取或设置目标元素的 HTML 代码
- [attr](./props/attr.md)：获取或设置目标元素的 [attributes](https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes)
- [css](./props/css.md)：获取或设置目标元素的样式
- [style](./props/style.md)：获取目标元素的原生样式
- [classList](./props/class-list.md)：获取目标元素的原生 class 列表
- [data](./props/data.md)：获取目标元素的原生数据集

## 事件相关

- [on](./event/on.md)：绑定事件到目标元素
- [one](./event/one.md)：一次性绑定事件到目标元素
- [emit](./event/emit.md)：主动触发事件
- [off](./event/off.md)：解除绑定的事件

## 模板语法

- [文本渲染](./temp-syntax/text-render.md)：快速在模板文件上渲染文本
- [class](./temp-syntax/class.md)：快速在模板文件上渲染类名
- [sync](./temp-syntax/sync.md)：快速同步数据到模板文件
- [条件渲染](./temp-syntax/condition.md)：按需在模板文件上渲染内容
- [列表渲染](./temp-syntax/fill.md)：在模板文件上快速渲染数组数据

## 生命周期
- [created](./life-cycle/created.md)：组件被创建，但未渲染内容时触发
- [ready](./life-cycle/ready.md)：组件被创建，内容被渲染后触发
- [watch](./life-cycle/watch.md)：组件初始化完成后和值被改变后触发
- [loaded](./life-cycle/loaded.md)：组件内嵌资源被加载完成后触发
- [attached](./life-cycle/attached.md)：组件被添加到 document 后触发
- [detached](./life-cycle/detached.md)： 组件从 document 被移除后触发
- [routerChange](./life-cycle/router-change.md)：内嵌的父页面在应用路由改变时触发

## 其他

- [盒模型](./others/box.md)：获取目标元素的所有尺寸相关的数据
- [formData](./others/form-data.md)：方便地绑定和获取表单数据
- [tag](./others/tag.md)：获取目标的标签名
- [index](./others/index.md)：获取目标元素在其父元素下的排序
- [is](./others/is.md)：判断目标元素是否匹配 CSS 选择器表达式
- [refresh](./others/refresh.md)：主动刷新组件的界面
- [PATH](./others/path.md)：获取组件或页面的注册文件地址
- [extend](./others/extend.md)：扩展实例的数据或方法；扩展 ofa.js 底层的数据或方法；
- [version](./others/version.md)：获取当前引入的 ofa.js 的版本号
- [实例数据特征](./others/stanz.md)：介绍实例数据的子对象数据特性，如何监听数据的变动