Page(async (load) => {
    return {
        data: {
            val: "I am p2"
        },
        ready() {
            let a = this.query;
        },
        proto: {
            toHome() {
                this.app.router.splice(1);
            }
        }
    };
})