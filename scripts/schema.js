const fs = require("fs")
const Ajv = require("ajv").default
const {writeFileSync, readdirSync} = require('fs')
const {join, relative} = require('path')
const standaloneCode = require("ajv/dist/standalone").default

const BASE = join(__dirname, "../src/settings");
const OUTPUT = join(BASE, "settings.validate.cjs");

const dir = readdirSync(join(BASE));
const schemas = dir
    .filter(dir => dir.endsWith("schema.json"))
    .map(dir => join(BASE, dir));

function generateSchemas () {
    const inputs = [];
    for (let filepath of schemas) {
        const text = fs.readFileSync(filepath, 'utf8');
        const json = JSON.parse(text);
        console.log("✅ %s", relative(process.cwd(), filepath))
        inputs.push(json);
    }
    const ajv = new Ajv({schemas: inputs, code: {source: true}})
    let moduleCode = standaloneCode(ajv)

    writeFileSync(OUTPUT, "// @ts-nocheck\n" + moduleCode);
}

generateSchemas()
