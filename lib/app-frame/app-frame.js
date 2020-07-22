Component({
    tag: "app-frame",
    temp: true,
    attrs: {
        src: ""
    },
    proto: {
        back() {
            this.$appframe.ele.contentWindow.history.back();
        },
        forward() {
            this.$appframe.ele.contentWindow.history.forward();
        }
    }
});