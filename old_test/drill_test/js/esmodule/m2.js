import { output } from "./m1.mjs";

let defaultObj = {
    val: "I am m2.js",
    output
};

(async () => {
    let m1 = await import("./m1.mjs");
    defaultObj.asyncData = m1;
})();

export default defaultObj;