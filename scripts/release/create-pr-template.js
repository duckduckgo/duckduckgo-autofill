const {readFileSync} = require('fs')
const {join} = require('path')
const {replaceInFile} = require('./release-utils.js')
const cwd = join(__dirname, '..')
const filepath = (...path) => join(cwd, ...path)

const platform = process.argv[2]

const description = process.env.DESCRIPTION || ''

function createPRTemplate (platform) {
    const templatePath = filepath(`../${platform}/.github/PULL_REQUEST_TEMPLATE.md`)
    const descriptionRegex = new RegExp(/\{\{ description }}/)
    const template = readFileSync(templatePath, 'utf8')
    const updatedTemplate = replaceInFile(template, descriptionRegex, description)
    return updatedTemplate
}

// The log is needed to read the value from the bash context
console.log(createPRTemplate(platform))
