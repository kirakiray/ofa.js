drill.init(async (load, data) => {
    let redata = {
        first: "are you init01?"
    };
    
    g4.ok(redata.first === data, 'init ok');

    return redata;
});