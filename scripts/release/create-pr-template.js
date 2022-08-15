const {readFileSync} = require('fs')
const {join} = require('path')
const cwd = join(__dirname, '..')
const filepath = (...path) => join(cwd, ...path)

const platform = process.argv[2]

const description = process.env.DESCRIPTION || ''

function createPRTemplate (platform) {
    const templatePath = filepath(`../${platform}/.github/PULL_REQUEST_TEMPLATE.md`)
    const descriptionRegex = new RegExp(/\{\{ description }}/)
    const template = readFileSync(templatePath, 'utf8')

    if (!descriptionRegex.test(template)) {
        const errorMsg = 'The template file does not seem to contain the expected vars. Check the file and the regex'
        console.log(errorMsg)
        console.log(template)
        throw new Error(errorMsg)
    }
    const updatedTemplate = template.replace(descriptionRegex, description)
    // The log is needed to read the value from the bash context
    console.log(updatedTemplate)
    return updatedTemplate
}

createPRTemplate(platform)
