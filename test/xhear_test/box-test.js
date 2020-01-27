(() => {
    let tester = expect(4, 'box test');

    let boxtar = $('#box_test');

    tester.ok(boxtar.height == 50, "height ok");

    tester.ok(boxtar.innerHeight == 70, "innerHeight ok");

    tester.ok(boxtar.offsetHeight == 80, "offsetHeight ok");

    tester.ok(boxtar.outerHeight == 120, "outerHeight ok");
})();