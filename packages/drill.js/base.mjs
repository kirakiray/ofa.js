import lm from "./main.mjs";
import "./component.mjs";
import config from "./config.mjs";
lm.config = config;
Object.freeze(lm);

window.lm = lm;

export default lm;
