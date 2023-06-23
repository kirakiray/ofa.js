const path = require("path");
const CWD = process.cwd();
const PACKAGE = require(path.join(CWD, "package.json"));
const terser = require("@rollup/plugin-terser");

const banner = `//! ${PACKAGE.name} - v${PACKAGE.version} ${
  PACKAGE.homepage
}  (c) ${PACKAGE.startyear}-${new Date().getFullYear()} ${PACKAGE.author.name}`;

module.exports = [
  {
    input: "packages/ofa/main.mjs",
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
  },
  {
    input: "packages/ofa/main.mjs",
    output: [
      {
        file: "dist/ofa.min.mjs",
        format: "es",
        banner,
        sourcemap: true,
      },
      {
        file: "dist/ofa.min.js",
        format: "umd",
        name: "$",
        banner,
        sourcemap: true,
      },
    ],
    plugins: [terser()],
  },
  {
    input: "libs/router/router.mjs",
    output: [
      {
        file: "libs/router/dist/router.min.js",
        format: "umd",
        banner,
        sourcemap: true,
      },
    ],
    plugins: [terser()],
  },
];
