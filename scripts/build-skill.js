const shell = require("shelljs");
const path = require("path");
const fs = require("fs");

const skillsDir = path.join(__dirname, "..", "skills");

function createZip(sourceDir, zipName) {
  const sourcePath = path.join(skillsDir, sourceDir);
  const outputPath = path.join(skillsDir, zipName);

  if (!fs.existsSync(sourcePath)) {
    console.error(`Error: Source directory ${sourcePath} does not exist`);
    return false;
  }

  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
    console.log(`Removed existing ${outputPath}`);
  }

  const currentDir = process.cwd();
  process.chdir(skillsDir);

  const result = shell.exec(`zip -r "${outputPath}" ${sourceDir}`, {
    silent: false,
  });

  process.chdir(currentDir);

  if (result.code !== 0) {
    console.error(`Error: Failed to create zip file for ${sourceDir}`);
    return false;
  }

  const stats = fs.statSync(outputPath);
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`Successfully created ${outputPath}`);
  console.log(`File size: ${sizeInMB} MB`);
  return true;
}

const success1 = createZip("ofajs-docs", "ofajs-docs.zip");
const success2 = createZip("ofajs-docs-en", "ofajs-docs-en.zip");

if (!success1 || !success2) {
  process.exit(1);
}
