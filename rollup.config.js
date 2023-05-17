const path = require("path");
const CWD = process.cwd();
const PACKAGE = require(path.join(CWD, "package.json"));

const banner = `//! ${PACKAGE.name} - v${PACKAGE.version} ${
  PACKAGE.homepage
}  (c) ${PACKAGE.startyear}-${new Date().getFullYear()} ${PACKAGE.author.name}`;

module.exports = {
  input: "packages/ofa/base.mjs",
  output: [
    {
      file: "dist/ofa.mjs",
      format: "es",
      banner,
    },
    {
      file: "dist/ofa.js",
      format: "umd",
      name: "$",
      banner,
    },
  ],
  plugins: [],
};
