(() => {
    $.register({
        tag: "model-tester",
        data: {
            v: 10
        },
        temp: `
        {{v}}
        <br>
        <input type="text" xv-model="v" />
        <br>
        <textarea xv-model="v"></textarea>
        `
    });

    $.register({
        tag: "model-tester2",
        data: {
            n: 2
        },
        temp: `
        {{n}}
        <select xv-model="n">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
        </select>
        <input type="number" step="1" min="1" max="5" xv-model="n" />
        `
    });

    $.register({
        tag: "model-tester3",
        data: {
            iChecked: false,
            ichecks: [],
            ichecksStr: "",
            iradio: ""
        },
        watch: {
            ichecks(e, val) {
                this.ichecksStr = val.string;
            }
        },
        temp: `
        <div>
            <label for="icheckebox">{{iChecked}}</label> -- <input type="checkbox" xv-model="iChecked" id="icheckebox" />
        </div>
        <br>
        <div>
            {{ichecksStr}} -- 
            <div>
                <label for="red">red</label>
                <input type="checkbox" xv-model="ichecks" value="red" id="red" /> 
            </div>
            <div>
                <label for="blue">blue</label>
                <input type="checkbox" xv-model="ichecks" value="blue" id="blue" /> 
            </div>
            <div>
                <label for="green">green</label>
                <input type="checkbox" xv-model="ichecks" value="green" id="green" /> 
            </div>
        </div>
        <br>
        <div>
            {{iradio}} -- 
            <div>
                <label for="s_10000">10000</label>
                <input type="radio" id="s_10000" value="10000" xv-model="iradio" />
            </div>
            <div>
                <label for="s_20000">20000</label>
                <input type="radio" id="s_20000" value="20000" xv-model="iradio" />
            </div>
            <div>
                <label for="s_30000">30000</label>
                <input type="radio" id="s_30000" value="30000" xv-model="iradio" />
            </div>
        </div>
        `
    });
})();