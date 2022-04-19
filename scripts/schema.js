const fs = require('fs')
const Ajv = require('ajv').default
const {writeFileSync, readdirSync} = require('fs')
const {join, relative, dirname} = require('path')
const standaloneCode = require('ajv/dist/standalone').default

const BASE = join(__dirname, '../src/schema')
const OUTPUT = join(BASE, 'validators.cjs')

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
    const inputs = []
    for (let filepath of schemas) {
        const text = fs.readFileSync(filepath, 'utf8')
        const json = JSON.parse(text)
        console.log('✅ %s', relative(process.cwd(), filepath))
        inputs.push(json)
    }
    const ajv = new Ajv({schemas: inputs, code: {source: true}})
    let moduleCode = standaloneCode(ajv)

    writeFileSync(OUTPUT, '// @ts-nocheck\n' + moduleCode)
}

generateSchemas()
