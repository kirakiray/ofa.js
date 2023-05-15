(() => {
    const runNexter = (nexter) => {
        let target = nexter.eves.shift();
        target && setTimeout(() => {
            let pms = target.func();

            if (pms instanceof Promise) {
                pms.then(e => {
                    runNexter(nexter);
                })
            } else {
                runNexter(nexter);
            }
        }, target.time);
    }

    class Nexter {
        constructor(par) {
            this.par = par;

            if (!par) {
                this.isroot = true;
                this.eves = [];

                // 点火
                setTimeout(() => {
                    runNexter(this);
                }, 1);
            }
        }

        get root() {
            let root = this;
            while (root.par) {
                root = root.par;
            }
            return root;
        }

        nexter(func, time = 100) {
            this.root.eves.push({
                func, time
            });
            return new Nexter(this);
        }
    }

    window.nexter = (func, time) => {
        return new Nexter().nexter(func, time);
    }
})();