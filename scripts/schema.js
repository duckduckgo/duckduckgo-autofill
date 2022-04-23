const fs = require('fs')
const Ajv = require('ajv').default
const {writeFileSync, readdirSync} = require('fs')
const {join, relative, dirname, basename} = require('path')
const standaloneCode = require('ajv/dist/standalone').default

const BASE = join(__dirname, '../src/schema')
const OUTPUT = join(BASE, 'validators.cjs')
const TS_OUTPUT = join(BASE, 'validators.d.ts')

const contentScopeDir = require.resolve('@duckduckgo/content-scope-scripts')
const contentScopeSchema = join(dirname(contentScopeDir), 'src/schema/runtime-configuration.schema.json')
const contentSchemaJson = join(BASE, 'runtime-configuration.schema.json')

// copy content-scope-scripts into place
fs.copyFileSync(contentScopeSchema, contentSchemaJson)

console.log('✅ COPY %s -> %s',
    relative(process.cwd(), contentScopeSchema),
    relative(process.cwd(), contentSchemaJson)
)

const dir = readdirSync(join(BASE))
const schemas = dir
    .filter(dir => dir.endsWith('schema.json'))
    .map(dir => join(BASE, dir))

function generateSchemas () {
    /** @type {{json: any, relative: string}[]} */
    const inputs = []

    for (let filepath of schemas) {
        const text = fs.readFileSync(filepath, 'utf8')
        const json = JSON.parse(text)
        console.log('✅ %s', relative(process.cwd(), filepath))
        inputs.push({json, relative: relative(process.cwd(), filepath)});
    }
    const interfaces = [];
    for (let input of inputs) {
        const json = input.json;
        if (json['$id']) {
            if (json['$id'].startsWith('#/definitions/')) {
                const members = [];
                const name = json['$id'].slice(14);
                // const hasProps = Boolean(json.properties);
                // const isObject = json.type === "object";
                for (let [propName, value] of Object.entries(json.properties || {})) {
                    const required = json.required?.includes(propName);
                    switch (value.type) {
                    case "string": {
                        members.push({ name: propName, type: ["string"], required})
                        break;
                    }
                    case "number": {
                        members.push({name: propName, type: ["number"], required})
                        break;
                    }
                    case "boolean": {
                        members.push({name: propName, type: ["boolean"], required})
                        break;
                    }
                    }
                }
                interfaces.push({name, members, source: input.relative})
            } else {
                console.log('did not start with definitions');
            }
        } else {
            console.log('no id');
        }
    }

    const ajv = new Ajv({schemas: inputs.map(x => x.json), code: {source: true}})
    let moduleCode = standaloneCode(ajv)

    writeFileSync(OUTPUT, '// @ts-nocheck\n' + moduleCode)
    writeFileSync(TS_OUTPUT, printTs(interfaces))
}

function printTs(interfaces) {
    let output = '// Do not edit, this was created by `scripts/schema.js`\n'
    output += `namespace Schema {\n`;
    output += interfaces.map(x => print(x).split('\n').map(x => `  ${x}`).join('\n')).join('\n');
    output += `\n}`;
    return output;
}

function print(int) {
    let output = '';
    output += `/** @link {import("./${basename(int.source)}")} */\n`
    output += `interface ${int.name} {\n`
    for (let member of int.members) {
        output += `  ${member.name}${member.required ? '' : '?'}: ${member.type.join('|')}\n`
    }
    output += `}`
    return output;
}

generateSchemas()
