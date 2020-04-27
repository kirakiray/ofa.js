const fs = require('fs');
const util = require('util');
const jsbeautify = require('js-beautify').js;
const UglifyJS = require("uglify-es");

const readFile = util.promisify(fs.readFile);

let count = 1;

let beforeCode = "";

// 包信息
let pgjson;
// 读取package信息
readFile(process.cwd() + "/package.json").then(e => {
    pgjson = JSON.parse(e);
    console.log("pgjson =>", pgjson);
})

const getversionCode = () => {
    if (pgjson.versionCode) {
        return pgjson.versionCode;
    } else if (pgjson.version) {
        return parseInt(pgjson.version.split(".").map(e => {
            return e.padStart(3, 0)
        }).join(""))
    }
}

const noJSEnd = name => name.replace(/\.js$/, "");

let mainFun = async () => {
    // 头文件信息
    let lib_infos = `/*!
* ${pgjson.name} v${pgjson.version}
* ${pgjson.homepage}
* 
* (c) ${pgjson.watchjs.startyear || 2018}-${new Date().getFullYear()} ${pgjson.author.name}
* Released under the ${pgjson.license} License.
*/`;

    // 打开主体base文件
    let basefile = await readFile('src/base.js', 'utf8');

    // 正则匹配文件名标记
    await Promise.all(basefile.match(/\/\/<\!--(.+?)-->/g).map(async (e) => {
        // 获取文件名
        let f = e.match(/\/\/<\!--(.+?)-->/);
        if (f && (1 in f)) {
            f = f[1];
        } else {
            return;
        }
        let code = "";
        if (/^\.\.\//.test(f)) {
            code = await readFile(`${f}.js`, 'utf8');
        } else {
            // 读取文件
            code = await readFile(`src/${f}.js`, 'utf8');
        }

        // 替换记录部分
        basefile = basefile.replace(`//<!--${f}-->`, e => code);
    }));

    // 修正versionCode等信息
    basefile = basefile.replace(/"\{\{versionCode\}\}"/, getversionCode());
    basefile = basefile.replace(/"\{\{version\}\}"/, `"${pgjson.version}"`);

    if (beforeCode == basefile) {
        return;
    }

    beforeCode = basefile;

    // 加上库信息
    basefile = lib_infos + basefile;

    // 格式化代码
    basefile = jsbeautify(basefile);

    // 写入最终文件
    fs.writeFile(`dist/${noJSEnd(pgjson.name)}.js`, basefile, 'utf8', (err) => {
        if (err) throw err;
        console.log(`write ${pgjson.name} succeed ${count++}`);
    });

    // 写入混淆压缩文件
    var result = UglifyJS.minify(basefile, {});
    if (result && result.code) {
        fs.writeFile(`dist/${noJSEnd(pgjson.name)}.min.js`, lib_infos + result.code, "utf8", err => {
            if (err) throw err;
            console.log("output uglify file succeed");
        });
    } else {
        console.warn("uglify error =>", result);
    }

    // 是否有其他文件输出
    let otherFiles = basefile.match(/<o:start--.+-->/g);
    otherFiles && otherFiles.forEach(str => {
        // 获取输出文件名
        let match_arr = str.match(/<o:start--(.+)-->/);
        if (match_arr && match_arr.length == 2) {
            let filename = match_arr[1];

            // 新匹配内容
            let match_text_arr = basefile.match(new RegExp(`<o:start--${filename}-->([\\d\\D]+)//<o:end--${filename}-->`));
            if (match_text_arr && match_text_arr.length == 2) {
                let target_file_text = match_text_arr[1];
                fs.writeFile(`dist/${filename}`, jsbeautify(target_file_text), 'utf8', err => {
                    if (err) throw err;
                    console.log(`write ${filename} succeed ${count++}`);
                });
            }
        }
    });
}

let readFileTimer;

fs.watch('src/', async (err, file) => {
    clearTimeout(readFileTimer);
    readFileTimer = setTimeout(mainFun, 1000);
});