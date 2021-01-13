Component(async (load) => {

    return {
        tag: "t-comp",
        temp: true,
        attrs: {
            pageNum: null
        },
        data: {
            val: "I am val",
            arr: []
        }
    };
});