setTimeout(() => {
    let aaa = $("t-comp");
    aaa.arr = [{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }];
    window.aaa = aaa;
    console.log(aaa);
}, 500);