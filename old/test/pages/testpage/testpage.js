Page(async ({ load }) => {
    return {
        data: {
            val: "test page"
        },
        proto: {
            get haha() {
                return "hhh";
            }
        },
        created() {
            tester1.ok(1, `create page ok (${this.src})`);
        },
        ready() {
            tester1.ok(1, `ready page ok (${this.src})`);
        },
        attached() {
            tester1.ok(1, `attached page ok (${this.src})`);
        }
    };
});
