import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SKILLS_DIR = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(SKILLS_DIR, 'ofajs-docs');
const TARGET_DIR = path.join(SKILLS_DIR, 'ofajs-docs-full');

const ASSETS_PATTERN = /-\s+\[([^\]]+)\]\((assets\/[^\)]+\.html)\):\s*(.+)/g;
const REFS_LIST_PATTERN = /-\s+\[([^\]]+)\]\((references\/[^\)]+\.md)\)/g;
const REFS_INLINE_PATTERN = /\[([^\]]+)\]\((references\/[^\)]+\.md)\)/g;

function processMarkdown(content, sourceDir) {
    const assetBlocks = [];
    const refBlocks = [];

    const processedContent = content
        .replace(ASSETS_PATTERN, (match, title, assetPath, description) => {
            assetBlocks.push({ assetPath, title, description: description.trim() });
            return `- ${assetPath}: ${description}`;
        })
        .replace(REFS_LIST_PATTERN, (match, title, refPath) => {
            refBlocks.push({ refPath, title });
            return `**${title}**`;
        })
        .replace(REFS_INLINE_PATTERN, (match, title, refPath) => {
            const alreadyProcessed = refBlocks.some(r => r.refPath === refPath);
            if (!alreadyProcessed) {
                refBlocks.push({ refPath, title });
            }
            return `**${title}**`;
        });

    let endContent = processedContent;

    for (const { assetPath, title, description } of assetBlocks) {
        const fullPath = path.join(sourceDir, assetPath);
        let fileContent = '';
        if (fs.existsSync(fullPath)) {
            fileContent = fs.readFileSync(fullPath, 'utf-8');
        }

        endContent += `

---

**${assetPath}**
\`\`\`html
${fileContent}
\`\`\``;
    }

    for (const { refPath, title } of refBlocks) {
        const fullPath = path.join(sourceDir, refPath);
        let fileContent = '';
        if (fs.existsSync(fullPath)) {
            fileContent = fs.readFileSync(fullPath, 'utf-8');
        }

        endContent += `

---

${fileContent}`;
    }

    return endContent;
}

const sourceFile = path.join(SOURCE_DIR, 'SKILL_cn.md');
const targetFile = path.join(TARGET_DIR, 'SKILL_cn.md');

if (!fs.existsSync(sourceFile)) {
    console.error(`Source file not found: ${sourceFile}`);
    process.exit(1);
}

const content = fs.readFileSync(sourceFile, 'utf-8');
const processed = processMarkdown(content, SOURCE_DIR);

if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

fs.writeFileSync(targetFile, processed, 'utf-8');
console.log(`Processed file written to: ${targetFile}`);