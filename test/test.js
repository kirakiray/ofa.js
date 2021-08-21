const tester1 = expect(6, "created,ready and attached runned");

(() => {
    let tester = expect(2, 'Component test');

    load("comp/test-comp -p").then(() => {
        tester.ok($("test-comp").val == "I am val", "data binding ok");
        tester.ok($("test-comp").getA() == "aaa", "proto binding ok");
    })
})();

(() => {
    let tester = expect(2, 'Page test');

    $("#testpage").watchUntil("status == 'loaded'").then(() => {
        // 加载完成
        tester.ok($("o-page").val == "test page", "data binding ok");
        tester.ok($("o-page").haha == "hhh", "proto binding ok");
    });
})();

(() => {
    let tester = expect(9, 'App test');

    nexter(() => {
        return $("o-app o-page").watchUntil("status == 'loaded'").then(() => {
            tester.ok(!$("o-app o-page").shadow.$(".backbtn"), "no back btn in first");
        })
    }, 300)
        .nexter(() => {
            // 跳转p1
            $("o-app o-page").shadow.$(".p2btn").click();
        }, 100)
        .nexter(() => {
            let page = $.all("o-app o-page")[1];
            return page.watchUntil("status == 'loaded'").then(() => {
                tester.ok(page.shadow.$(".stext").text === "I am p2", "render page ok 1");
                tester.ok(page.shadow.$(".numtext").text === "num => 1", "get query ok 1");

                // 跳到二级
                page.shadow.$(".to_p2").click();
            });
        })
        .nexter(() => {
            let page = $.all("o-app o-page")[2];
            return page.watchUntil("status == 'loaded'").then(() => {
                tester.ok(page.shadow.$(".numtext").text === "num => 2", "get query ok 2");

                // 返回首页
                $("o-app").router = [$("o-app").router[0]];
            });
        })
        .nexter(() => {
            tester.ok($.all("o-app o-page").length == 1, "page length ok");

            $("o-app o-page").shadow.$(".p3btn").click();
        }, 800)
        .nexter(() => {
            let page = $.all("o-app o-page")[1];
            return page.watchUntil("status == 'loaded'").then(() => {
                tester.ok(page.shadow.$(".stext").text === "I am p3", "render page ok 2");
                tester.ok(page.shadow.$(".numtext").text === "snum => 1", "get state ok 1");

                // 跳到二级
                page.shadow.$(".to_p3").click();
            });
        })
        .nexter(() => {
            let page = $.all("o-app o-page")[2];
            return page.watchUntil("status == 'loaded'").then(() => {
                tester.ok(page.shadow.$(".numtext").text === "snum => 2", "get state ok 2");

                // 返回首页
                $("o-app").router = [$("o-app").router[0]];
            });
        })
        .nexter(() => {
            $("o-app o-page").shadow.$(".inpage").shadow.$("button").click();
        }, 400)
        .nexter(() => {
            let page = $.all("o-app o-page")[1];

            tester.ok(page.shadow.$(".backbtn"), "has back");
        });
})();