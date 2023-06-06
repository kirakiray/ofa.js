const { server, home } = require("./static-server");
const shell = require("shelljs");

shell.exec(`npm run playwright`, function (code, stdout, stderr) {
  console.log("Exit code:", code);
  console.log("Program output:", stdout);
  console.log("Program stderr:", stderr);
  server.close();
  if (code !== 0) {
    throw "run error";
  }
});
