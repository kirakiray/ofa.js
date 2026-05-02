const shell = require("shelljs");
const path = require("path");
const fs = require("fs");

const skillsDir = path.join(__dirname, "..", "skills");
const ofajsDocsDir = path.join(skillsDir, "ofajs-docs");
const outputFile = path.join(skillsDir, "ofajs-docs.zip");

if (!fs.existsSync(ofajsDocsDir)) {
  console.error(`Error: Source directory ${ofajsDocsDir} does not exist`);
  process.exit(1);
}

if (fs.existsSync(outputFile)) {
  fs.unlinkSync(outputFile);
  console.log(`Removed existing ${outputFile}`);
}

const currentDir = process.cwd();
process.chdir(skillsDir);

const result = shell.exec(`zip -r "${outputFile}" ofajs-docs`, {
  silent: false,
});

process.chdir(currentDir);

if (result.code !== 0) {
  console.error(`Error: Failed to create zip file`);
  process.exit(1);
}

const stats = fs.statSync(outputFile);
const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
console.log(`Successfully created ${outputFile}`);
console.log(`File size: ${sizeInMB} MB`);
