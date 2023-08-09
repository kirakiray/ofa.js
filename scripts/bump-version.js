const fs = require("fs");
const args = process.argv.slice(2);

function incrementPackageVersion() {
  // 读取 package.json 文件
  const packageJson = JSON.parse(fs.readFileSync("package.json"));

  // 获取当前版本号和递增后的版本号
  let oldVersion = packageJson.version;
  let newVersion;

  if (args.includes("-m")) {
    newVersion = incrementMiddleVersion(oldVersion);
  } else {
    newVersion = incrementLastVersion(oldVersion);
  }

  // 将递增后的版本号写回 package.json 文件
  packageJson.version = newVersion;
  fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));

  console.log(`Version number has been updated from ${oldVersion} to ${newVersion}`);
}

function incrementLastVersion(versionString) {
  const parts = versionString.split(".");
  const lastPartIndex = parts.length - 1;
  parts[lastPartIndex] = String(Number(parts[lastPartIndex]) + 1);
  return parts.join(".");
}

function incrementMiddleVersion(versionString) {
  const parts = versionString.split(".");
  const middlePartIndex = Math.floor(parts.length / 2);
  let newParts = parts.slice(0, middlePartIndex + 1);
  newParts[middlePartIndex] = String(Number(newParts[middlePartIndex]) + 1);
  for (let i = middlePartIndex + 1; i < parts.length; i++) {
    newParts.push("0");
  }
  return newParts.join(".");
}

incrementPackageVersion();
