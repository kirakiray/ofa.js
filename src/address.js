let initedAddressApp = false;

// 对地址栏的监听
const initAddress = (app) => {
    if (initedAddressApp) {
        throw {
            desc: "the existing app is initialized globally",
            target: initedAddressApp
        };
    }

    initedAddressApp = app;
}