const {readFileSync} = require('fs')
const {join} = require('path')
const {replaceAllInString} = require('./release-utils.js')
const cwd = join(__dirname, '..')
const filepath = (...path) => join(cwd, ...path)

const platform = process.argv[2]

const version = process.env.VERSION
const releaseUrl = process.env.RELEASE_URL
const releaseNotesRaw = process.env.RELEASE_NOTES
const bskPrUrl = process.env.BSK_PR_URL || ''
const asanaOutputRaw = process.env.ASANA_OUTPUT || '{}'
const asanaOutput = JSON.parse(asanaOutputRaw)

function createPRTemplate (platform) {
    const templatePath = filepath(`./release/clients_pr_template.md`)
    const template = readFileSync(templatePath, 'utf8')

    const asanaUrlRegex = /\[\[asana_url]]/
    const autofillReleaseUrlRegex = /\[\[autofill_release_url]]/
    const extraContentRegex = /\[\[extra_content]]/
    const versionRegex = /\[\[version]]/
    const descriptionRegex = /\[\[description]]/

    let extraContent = ''

    let asanaUrl = asanaOutput[platform]?.taskUrl

    if (['ios', 'macos'].includes(platform)) {
        asanaUrl = asanaOutput.bsk?.taskUrl
        extraContent = `**BSK PR:** ${bskPrUrl}`
    }

    const updatedTemplate = replaceAllInString(template, [
        [asanaUrlRegex, asanaUrl],
        [autofillReleaseUrlRegex, releaseUrl],
        [extraContentRegex, extraContent],
        [versionRegex, version],
        [descriptionRegex, releaseNotesRaw]
    ])
    return updatedTemplate
}

// The log is needed to read the value from the bash context
console.log(createPRTemplate(platform))
