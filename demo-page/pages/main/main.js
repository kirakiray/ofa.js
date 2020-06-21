Page(async (load) => {
    await load("@ofa/o-link -p");

    return {
        temp: true,
        data: {
            mainText: "I am main text"
        }
    }
})