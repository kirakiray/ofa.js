define(async(load) => {
    var d1 = await load('./define01');

    once(1, 'load define03 ok');

    return {
        d1: d1,
        val: "I am define03"
    };
});