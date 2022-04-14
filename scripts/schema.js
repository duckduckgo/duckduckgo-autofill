const {spawnSync} = require('child_process')
const {readFileSync, writeFileSync} = require('fs')

const schemas = {
    settings: {
        src: 'src/settings/settings.schema.json',
        dest: 'src/settings/settings.validate.cjs'
    }
}

function generateSchemas () {
    const avjArgs = ['compile']
    for (let [name, value] of Object.entries(schemas)) {
        console.log('compiling schema for %s', name)

        const h = spawnSync('ajv', avjArgs.concat('-s', value.src, '-o', value.dest))
        console.log(h.stdout.toString())

        if (h.status !== 0) {
            throw new Error(h.stderr.toString())
        }

        console.log('✅ written to %s', value.dest)

        // the following part adds `ts-nocheck` to the generated files.
        // todo(Shane): Find out if there's a better way to do this.
        const result = readFileSync(value.dest, 'utf8')
        if (result.startsWith('// @ts-nocheck')) {
            break
        }
        writeFileSync(value.dest, '// @ts-nocheck\n' + result)
    }
}

generateSchemas()
