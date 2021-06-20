task(async(load, data) => {
    let { d1, d2 } = data;
    let d = await new Promise((res) => {
        setTimeout(() => {
            res(d1 + d2);
        }, 1000);
    });
    return d;
});