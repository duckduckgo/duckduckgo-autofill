const fs = require("fs")
const Ajv = require("ajv").default
const {writeFileSync} = require('fs')
const {join} = require('path')
const standaloneCode = require("ajv/dist/standalone").default

const schemas = [
    // this first batch are all standalone types
    '../src/settings/schema.settings.json',
    '../src/settings/schema.featureToggles.json',
    // todo(Shane): Bring this JSON in dynamically
    '../src/settings/schema.contentScope.json',
    '../src/settings/schema.availableInputTypes.json',

    // these represent message responses
    '../src/settings/response.getRuntimeConfiguration.json',
    '../src/settings/response.getAvailableInputTypes.json',
    '../src/settings/response.getAutofillData.json',
]

function generateSchemas () {
    const inputs = [];
    for (let filepath of schemas) {
        const text = fs.readFileSync(join(__dirname, filepath), 'utf8');
        const json = JSON.parse(text);
        console.log("✅ %s", filepath)
        inputs.push(json);
    }
    const ajv = new Ajv({schemas: inputs, code: {source: true}})
    let moduleCode = standaloneCode(ajv)

    // todo(Shane): Ensure this file name is updated
    writeFileSync(join(__dirname, "../src/settings/settings.validate.cjs"), "// @ts-nocheck\n" + moduleCode);
}

generateSchemas()
