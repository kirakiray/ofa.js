(() => {
    let tester = expect(7, 'event test');

    let a = $('#a');

    a.on('haha', (e, data) => {
        tester.ok(data.val == "test data", "event ok");
        tester.ok(JSON.stringify(e.keys) == "[0,1]", "keys ok");
    });

    a[0][1].emit('haha', {
        val: "test data"
    });

    let testEle = $('#event_test');

    testEle.one('update', (e, data) => {
        tester.ok(JSON.stringify(e.keys) == "[0]", "update keys ok");
        tester.ok(e.modify.args[0] == 1, "update modify key ok");
    });

    testEle[0][1] = {
        tag: "div",
        text: "bbb1_2",
        class: "bbb1_2"
    };

    // // 模拟 selector 测试
    let selector = ".a_con";
    testEle.on('ka', selector, (e) => {
        tester.ok(1, 'selector ok 1');
        tester.ok(e.selector === selector, 'selector ok 2');
        tester.ok(e.delegateTarget.is(selector), 'selector ok 3');
    });

    $('.b_con_child').emit('ka');
    $('#a1_2').emit('ka');
})();