drill.config({
    paths: {
        "^\\$/": "https://kirakiray.github.io/XDFrame/lib/"
    }
});

// 配置全局变量
glo.XDFrame = {
    drill,
    $,
    version: 10000
};