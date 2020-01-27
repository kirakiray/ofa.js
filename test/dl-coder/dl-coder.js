Component(async (load) => {
    await load("./dl-block");

    return {
        tag: "dl-coder",
        temp: true,
        data: {
            // 放置文件的目录
            dirs: [],
            dirroot: "./"
        },
        watch: {
            dirs(e, val) {
                // debugger
            }
        },
        // use: ["./dl-block"]
    };
});