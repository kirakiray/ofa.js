var g2 = expect(2, '两次task01运行');

task(async (load, data, {
    FILE
}) => {

    let d1 = await load('./define/define01');
    ok(d1.val == "I am define01", "relative path");

    var [n1, n2] = data;
    g2.ok(1, "task01");

    ok(FILE.search("js/task01.js") > -1, "FILE(task01) is ok");

    data = await new Promise((res, rej) => {
        setTimeout(() => {
            res(n1 + n2);
        }, 500);
    });
    return data;
});


once(1, 'load task01 ok');