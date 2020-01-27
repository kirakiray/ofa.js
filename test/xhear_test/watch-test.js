(() => {
    let tester = expect(9, 'watch test');

    $.register({
        tag: "w-test",
        temp: `
        <div style="color:red;font-size:10px;">selected:{{selected}}</div>
        <div xv-content style="font-size:12px;"></div>
        `,
        attrs: ['selected'],
        data: {
            selected: 0
        }
    });

    let d = $("#watch_test");

    // 等渲染完毕
    setTimeout(() => {
        window.cloneDObj = $.xdata(d.object);
        cloneDObj.sync(d);

        // watch监听
        d.watch(e => {
            tester.ok(e.trends.length == 4, 'trends length ok');
            tester.ok(e.trends[0].name === "push", 'trends name ok 1');
            tester.ok(e.trends[1].name == "setData", 'trends name ok 2');
        });

        // 直接设置多个元素
        d.push({
            tag: "w-test",
            text: "t2-1"
        }, {
                tag: "w-test",
                0: {
                    tag: "w-test",
                    text: "t2-2-1"
                },
                1: {
                    tag: "w-test",
                    0: {
                        tag: "w-test",
                        text: "t2-2-2-1",
                    },
                    1: {
                        tag: "w-test",
                        text: "t2-2-2-2",
                    }
                }
            }, {
                tag: "w-test",
                text: "t2-3"
            });

        // 监听 selected=1 的
        let cid = 0;
        d.watch('[selected=1]', (e) => {
            if (cid > 0) {
                tester.ok(e.val.length == 1, "[selected=1] ok 1");
                tester.ok(e.val[0].ele === d[1].ele, "[selected=1] ok 2");
            }
            cid++;
        }, true);

        // 判断是否push成功
        tester.ok(d.length == 3, 'length ok');
        tester.ok(d[1][0].text.trim() == "t2-2-1", 'push ok');

        // 替换元素
        d[0] = {
            tag: "w-test",
            text: "change t2-1",
            selected: 1
        };

        d[0].selected = 0;
        d[1].selected = 1;

        tester.ok(d[0].text.trim() == "change t2-1", 'replace ok');

        setTimeout(() => {
            tester.ok(cloneDObj[1].selected == 1, 'sync ok');
        }, 500);

    }, 100);
})();