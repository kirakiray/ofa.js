const { PureServer } = require("./PureServer");

setTimeout(() => {
    let serverObj = new PureServer();

    // 设置监听端口
    serverObj.listen = 9669;

    // 设置静态目录
    serverObj.setStatic("/ofa/", process.cwd() + "/");

    console.log(serverObj);
}, 2000);