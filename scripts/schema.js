const fs = require('fs')
const Ajv = require('ajv').default
const {writeFileSync, readdirSync} = require('fs')
const {join, relative, dirname, basename} = require('path')
const standaloneCode = require('ajv/dist/standalone').default

const BASE = join(__dirname, '../src/schema')
const OUTPUT = join(BASE, 'validators.cjs')
const TS_OUTPUT = join(BASE, 'validators.d.ts')
const MD_OUTPUT = join(BASE, 'schema.md')

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

/**
 * @typedef {{json: any, relative: string}} Input
 * @typedef {{name: string, type: string[], required?: boolean, description?: string, title?: string}} Member
 * @typedef {{name: string, members: Member[], source: string, description?: string, title?: string}} Interface
 * @typedef {{interfaces: Interface[], input: Input}} Group
 */

function generateSchemas () {
    /** @type {Input[]} */
    const inputs = []

    for (let filepath of schemas) {
        const text = fs.readFileSync(filepath, 'utf8')
        const json = JSON.parse(text)
        console.log('✅ %s', relative(process.cwd(), filepath))
        inputs.push({json, relative: relative(process.cwd(), filepath)})
    }

    /**
     * @param {object} args;
     * @param {Record<string, any>} args.value;
     * @param {string} args.propName;
     * @param {string} args.ident;
     * @param {Input} args.input;
     * @param {string} args.parentName;
     * @param {string} args.topName;
     * @param {string[]} [args.localRefs]
     * @param {string} [args.identPrefix]
     * @returns {Member[]}
     */
    function processObject (args) {
        const {value, propName, ident, input, identPrefix, localRefs, topName} = args
        const members = []
        switch (value.type) {
        case 'string': {
            if (value.const) {
                members.push({
                    name: propName,
                    type: [JSON.stringify(value.const)],
                    title: value.title,
                    description: value.description
                })
            } else if (value.enum) {
                members.push({
                    name: propName,
                    type: [value.enum.map(x => JSON.stringify(x)).join(' | ')],
                    title: value.title,
                    description: value.description
                })
            } else { // base case
                members.push({
                    name: propName,
                    type: ['string'],
                    title: value.title,
                    description: value.description
                })
            }
            break
        }
        case 'number': {
            members.push({name: propName, type: ['number']})
            break
        }
        case 'boolean': {
            members.push({name: propName, type: ['boolean']})
            break
        }
        case 'object': {
            if (Array.isArray(value.oneOf)) {
                const unionMembers = []
                for (const oneOfElement of value.oneOf) {
                    if (oneOfElement?.$ref) {
                        const name = oneOfElement.$ref.slice(14)
                        unionMembers.push(name)
                    } else {
                        console.log('not Supported', value.oneOf)
                    }
                }
                members.push({name: propName, type: [formatUnionMembers(unionMembers)], description: value.description})
            } else {
                if (ident) {
                    members.push({name: propName, type: [ident]})
                    processOne({json: value, input: input, topName})
                } else {
                    if (propName === 'success') {
                        processOne({json: value, input: input, topName})
                    } else {
                        console.log('missing props', value)
                    }
                }
            }
            break
        }
        case 'array': {
            const arrayMembers = []
            if (value.items?.$ref) {
                const name = value.items?.$ref.slice(14)
                arrayMembers.push(name)
            } else {
                arrayMembers.push('any')
            }
            members.push({name: propName, type: [formatArrayMembers(arrayMembers)]})
        }
        }

        if (!value.type) {
            if (value?.$ref) {
                let name = identName(value.$ref)
                if (localRefs?.includes(name)) {
                    name = args.parentName + name
                }
                members.push({name: propName, type: [name]})
            } else {
                console.log('object property without type or ref', value)
            }
        }

        return members

        /**
         * @param {string} value
         * @returns {string}
         */
        function identName (value) {
            const name = value.slice(14)
            if (identPrefix) {
                return identPrefix + name
            }
            return name
        }
    }

    /**
     * @param {object} args
     * @param {Input} args.input
     * @param {Record<string, any>} args.json
     * @param {string} args.topName
     * @param {string} [args.knownId]
     * @param {string} [args.identPrefix]
     * @param {string[]} [args.localRefs]
     * @returns {Interface[]}
     */
    /** @type {Interface[]} */
    let interfaces = []

    function processOne (args) {
        const {json, input, knownId, identPrefix, localRefs, topName} = args
        if (!json.$id && !knownId) {
            console.log('no json.$id or knownId', json)
            return interfaces
        }
        if (!knownId && !json.$id.startsWith('#/definitions/')) {
            console.log('cannot find name')
            return interfaces
        }
        const parentName = knownId || json.$id?.slice(14)
        if (!parentName) {
            throw new Error('unreachable name should exist')
        }
        /** @type {Member[]} */
        const members = []
        const hasProps = Boolean(json.properties)
        const isObject = json.type === 'object'
        if (hasProps) {
            for (let [propName, value] of Object.entries(json.properties || {})) {
                const required = json.required?.includes(propName)
                const thisId = value?.$id?.slice(14)
                const inner = processObject({
                    value: value,
                    propName: propName,
                    ident: thisId,
                    input: input,
                    identPrefix,
                    localRefs,
                    parentName,
                    topName
                })
                members.push(...inner.map(x => ({...x, required})))
            }
        } else {
            if (isObject) {
                if (json.additionalProperties) {
                    if (typeof json.additionalProperties === 'boolean') {
                        members.push({name: `[index: string]`, type: ['unknown'], required: true})
                    } else {
                        if (json.additionalProperties.$ref) {
                            // members.push()
                            let topName = json.additionalProperties.$ref?.slice(14)
                            if (identPrefix) {
                                topName = identPrefix + topName
                            }
                            members.push({name: `[index: string]`, type: [topName], required: true})
                        }
                    }
                }
            }
        }
        if (json.definitions) {
            for (let [defName, defValue] of Object.entries(json.definitions)) {
                const ident = parentName + defName
                processOne({json: defValue, input: input, knownId: ident, identPrefix: parentName, localRefs, topName})
            }
        }
        interfaces.push({
            name: parentName,
            members,
            source: input.relative,
            description: json.description,
            title: parentName !== json.title ? json.title : undefined
        })
    }

    /** @type {Group[]} */
    const groups = []

    for (let input of inputs) {
        const topRefs = Object.keys(input.json.definitions || {})
        const topName = input.json.$id?.slice(14)
        if (!topName) {
            throw new Error('unreachable')
        }
        processOne({json: input.json, input: input, localRefs: topRefs, topName})
        groups.push({input, interfaces: interfaces.slice().reverse()})
        interfaces = []
    }

    const ajv = new Ajv({schemas: inputs.map(x => x.json), code: {source: true}})
    let moduleCode = standaloneCode(ajv)

    writeFileSync(OUTPUT, '// @ts-nocheck\n' + moduleCode)
    writeFileSync(TS_OUTPUT, printGroups(groups))
    writeFileSync(MD_OUTPUT, printGroupsMd(grouped(groups)))
}

/**
 * @param {string[]} members
 * @returns {string|*}
 */
function formatUnionMembers (members) {
    if (members.length === 0) return 'unknown'
    return members.join(' | ')
}

/**
 * @param {string[]} members
 * @returns {string}
 */
function formatArrayMembers (members) {
    if (members.length === 0) return 'any[]'
    if (members.length === 1) return `${members[0]}[]`
    return `(${members.join('|')})[]`
}

/**
 * @param {Group[]} groups
 * @returns {string}
 */
function printGroups (groups) {
    let output = '// Do not edit, this was created by `scripts/schema.js`\n'
    output += `namespace Schema {\n`

    for (let group of groups) {
        let toIndent = ''
        const linkImportText = `import("./${basename(group.input.relative)}")`
        for (let int of group.interfaces) {
            const printed = printInterface(int, {linkImportText})
            toIndent += printed
            toIndent += '\n'
        }
        output += indent(toIndent)
    }
    output += `\n}`
    return output
}

function intComment (int, linkImportText) {
    let commentLines = []
    if (int.title) {
        commentLines.push(int.title)
    }
    if (int.description) {
        if (commentLines.length) commentLines.push('')
        commentLines.push(...int.description.split('\n'))
    }
    if (commentLines.length) commentLines.push('')
    commentLines.push(`@link {${linkImportText}}`)
    const printedComment = commentLines.length > 0 ? printComments(commentLines) + '\n' : '\n'
    return printedComment
}

function memberComment (mem) {
    let commentLines = []
    if (mem.title) {
        commentLines.push(mem.title)
    }
    if (mem.description) {
        commentLines.push(mem.description)
    }
    const printedComment = commentLines.length > 0 ? printComments(commentLines) + '\n' : ''
    return printedComment
}

/**
 * @param {Interface} int
 * @param {object} args
 * @param {string} args.linkImportText
 */
function printInterface (int, args) {
    const {linkImportText} = args

    const printedComment = intComment(int, linkImportText)
    let output = ''
    output += printedComment
    output += `interface ${int.name} {\n`
    for (let member of int.members) {
        const memComment = memberComment(member)
        output += indent(memComment)
        output += indent(printMember(member), '') + `\n`
    }
    output += `}`
    return output
}

function printMember (member) {
    return `${member.name}${member.required ? '' : '?'}: ${member.type.join('|')}`
}

function indent (source, indent = '    ') {
    return source.split('\n').map(x => indent + x).join('\n')
}

function printComments (lines) {
    return `
/**
${lines.map(x => ' * ' + x).join('\n')}
 */`
}

generateSchemas()

/**
 * @typedef {object} NamedEntry
 * @property {Group|null} request
 * @property {Group|null} response
 * @property {Group[]} other
 * @property {string} name
 */

/**
 * @typedef {Record<string, NamedEntry>} Grouped
 */

/**
 * @param {Group[]} groups
 * @returns {Grouped}
 */
function grouped (groups) {
    /** @type {Record<string, NamedEntry>} */
    let named = {}
    for (let group of groups) {
        let file = basename(group.input.relative)
        let [type, name] = file.split(/\./g)
        if (type === 'request' || type === 'response') {
            if (!named[name]) named[name] = {request: null, response: null, other: [], name}
            named[name][type] = group
        } else {
            if (!named[type]) named[type] = {request: null, response: null, other: [], name: type}
            named[type].other.push(group)
        }
    }
    return named
}

/**
 * @param {Grouped} grouped
 */
function printGroupsMd (grouped) {
    const ordered = orderGroups(grouped)
    const blocks = []
    for (let orderedElement of ordered) {
        const inner = []
        const group = grouped[orderedElement]
        inner.push(blockTitle(group))
        if (group.request) {
            inner.push(requestTitle(group.request))
            inner.push(detailsSummary(group.request))
            for (let int of group.request.interfaces) {
                inner.push(tsInterfaceDesc(int))
                inner.push(tsCodeFence(printInterface(int, {linkImportText: `./${basename(group.request.input.relative)}`})))
            }
        }
        if (group.response) {
            inner.push(responseTitle(group.response))
            inner.push(detailsSummary(group.response))
            for (let int of group.response.interfaces) {
                inner.push(tsInterfaceDesc(int))
                inner.push(tsCodeFence(printInterface(int, {linkImportText: `./${basename(group.response.input.relative)}`})))
            }
        }
        for (let otherElement of group.other) {
            inner.push(detailsSummary(otherElement))
            for (let int of otherElement.interfaces) {
                inner.push(tsInterfaceDesc(int))
                inner.push(tsCodeFence(printInterface(int, {linkImportText: `./${basename(otherElement.input.relative)}`})))
            }
        }
        blocks.push(inner.join('\n\n'))
    }
    return blocks.join('\n\n---\n')
}

/** @param {NamedEntry} entry */
function blockTitle (entry) {
    return `## \`${entry.name}\``
}

/** @param {Group} _group */
function requestTitle (_group) {
    return `**request**`
}

/** @param {Group} _group */
function responseTitle (_group) {
    return `**response**`
}

/**
 * @param {Group} group
 */
function detailsSummary (group) {
    return `
<details>
<summary><code>${basename(group.input.relative)}</code></summary>
<br/>

[./${basename(group.input.relative)}](./${basename(group.input.relative)})

\`\`\`json
${JSON.stringify(group.input.json, null, 2)}
\`\`\`

</details>
  `
}

/**
 * @param {string} input
 */
function tsCodeFence (input) {
    return `

\`\`\`ts
${input}
\`\`\`
`
}

/**
 * @param {Interface} int
 */
function tsInterfaceDesc (int) {
    const lines = []
    lines.push(`### ` + int.name)
    // lines.push(int.title);
    // lines.push('');
    // lines.push(int.description);
    return lines.join('\n')
}

/**
 * @param {Grouped} grouped
 * @return {(keyof Grouped)[]}
 */
function orderGroups (grouped) {
    return Object.keys(grouped)
        .sort((a, b) => {
            let _a = 0
            let _b = 0
            if (grouped[a].request) _a += 1
            if (grouped[a].response) _a += 1

            if (grouped[b].request) _b += 1
            if (grouped[b].response) _b += 1
            return _b - _a
        })
}