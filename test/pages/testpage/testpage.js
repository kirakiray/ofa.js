Page(async ({ load }) => {
    return {
        data: {
            val: "test page"
        },
        proto: {
            get haha() {
                return "hhhhhhhhh";
            }
        }
    };
});
