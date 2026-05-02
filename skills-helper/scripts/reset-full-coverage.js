import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const assetsDir = '/Users/yao/Documents/GitHub/ofa.js/skills/ofajs-docs/assets/full-coverage';
const targetFile = '/Users/yao/Documents/GitHub/ofa.js/skills/ofajs-docs/references/full-coverage.md';

async function main() {
  const files = await readdir(assetsDir);
  
  const fileContents = [];
  
  for (const file of files) {
    const filePath = join(assetsDir, file);
    const content = await readFile(filePath, 'utf-8');
    fileContents.push(`<!-- ${file} -->\n${content}`);
  }
  
  const newContent = fileContents.join('\n\n');
  
  const mdContent = await readFile(targetFile, 'utf-8');
  
  const startMarker = '<!-- 源文件内容start -->';
  const endMarker = '<!-- 源文件内容end -->';
  
  const startIndex = mdContent.indexOf(startMarker);
  const endIndex = mdContent.indexOf(endMarker);
  
  if (startIndex === -1 || endIndex === -1) {
    throw new Error('无法找到标记注释');
  }
  
  const before = mdContent.substring(0, startIndex + startMarker.length);
  const after = mdContent.substring(endIndex);
  
  const updatedContent = `${before}\n\n\`\`\`html\n${newContent}\n\`\`\`\n\n${after}`;
  
  await writeFile(targetFile, updatedContent, 'utf-8');
  
  console.log('文件内容已成功更新');
}

main().catch(console.error);
