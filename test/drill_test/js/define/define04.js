define(async (load, exports) => {
    var [d2, d1] = await load('./define02', './define01');

    exports.d1 = d1;
    exports.d2 = d2;

    var d3 = await load('./define03');
    exports.d3 = d3;

    exports.val = "I am define04";

    once(1, 'load define04 ok');
}, "d4");