const path = require("path");
const syncDirectory = require("sync-directory");

const watchDirs = [
  {
    name: "drill.js",
    source: path.resolve(__dirname, "../../drill.js/src"),
  },
  {
    name: "stanz",
    source: path.resolve(__dirname, "../../stanz/src"),
  },
  {
    name: "Xhear",
    source: path.resolve(__dirname, "../../Xhear/packages/xhear/src"),
  },
];

watchDirs.forEach((e) => {
  const { name, source, test } = e;

  syncDirectory(source, path.resolve(__dirname, `../packages/${name}`), {
    watch: true,
  });

  console.log(`Listening to ${name} source files : ${source} and ${test}`);
});
