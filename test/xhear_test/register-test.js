(() => {
    let tester = expect(10, 'register test');

    let testEle = $("#register_test");

    $.register({
        tag: "reg-sub-ele",
        data: {
            itext: "default itext",
            icolor: "#aaa"
        },
        temp: `
        <div>
            <br>
            <input type="text" xv-tar="dInput" xv-model="itext" />
            <br>
        </div>
        `,
        watch: {
            icolor(e, val) {
                this.$dInput.style["color"] = val;
            }
        }

    });

    $.register({
        tag: "reg-ele",
        data: {
            size: 16,
            imgwidth: 20,
            imgheight: 10,
            weight: "700",
            color: "#9999ff",
            titleName: "default",
            tarimg: "https://www.baidu.com/img/baidu_jgylogo3.gif"
        },
        temp: `
        <div xv-tar="mtitle">reg-ele-title -- {{titleName}}</div>
        <img :src="tarimg" :width="imgwidth" :height="imgheight" />
        <reg-sub-ele xv-tar="sub1" :#itext="titleName" :icolor="color"></reg-sub-ele>
        <reg-sub-ele xv-tar="sub2"></reg-sub-ele>
        <slot></slot>
        `,
        proto: {
            getTitle() {
                return this.$mtitle.text;
            },
            get titletext() {
                return this.$mtitle.text;
            }
        },
        watch: {
            size(e, val) {
                this.$mtitle.style.fontSize = val + "px";
            },
            weight(e, val) {
                this.$mtitle.style.fontWeight = val;

            },
            color(e, val) {
                this.$mtitle.style.color = val;
            }
        },
        inited() {
            tester.ok(true, "init ok");
        },
        attached() {
            tester.ok(true, "attached ok");
        }
    });

    testEle.push({
        tag: "reg-ele",
        text: "test reg ele"
    });

    let regele = $("reg-ele");

    setTimeout(() => {
        tester.ok(regele.getTitle() === "reg-ele-title -- default", "getTitle ok");
        tester.ok(regele.titletext === "reg-ele-title -- default", "titletext ok");
        tester.ok(regele.$sub1.icolor === regele.color, "binding color ok");
        tester.ok(regele.$sub1.itext === regele.titleName, "binding titleName ok");
        tester.ok(regele.$sub2.icolor != regele.color, "no binding color ok");
        tester.ok(regele.$sub2.itext != regele.titleName, "no binding titleName ok");

        // :attr 单向绑定的数据，只能父组件传给子组件
        regele.color = "#aabbcc";

        // :#attr 双向绑定的数据，子组件也能传给父组件
        regele.$sub1.itext = "change itext";
        setTimeout(() => {
            tester.ok(regele.$sub1.icolor == "#aabbcc", ':attr binding change ok');
            tester.ok(regele.titleName == "change itext", ':#attr binding change ok');
        }, 300);
    }, 300);
})();