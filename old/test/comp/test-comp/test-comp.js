Component(async ({ load }) => {
    return {
        data: {
            val: "I am val",
        },
        proto: {
            getA() {
                return "aaa";
            }
        },
        created() {
            tester1.ok(1, "created component ok");
        },
        ready() {
            tester1.ok(1, "ready component ok");
        },
        attached() {
            tester1.ok(1, "attached component ok");
        }
    };
});