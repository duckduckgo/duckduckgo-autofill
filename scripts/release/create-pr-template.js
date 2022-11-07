const {readFileSync} = require('fs')
const {join} = require('path')
const {replaceAllInString} = require('./release-utils.js')
const cwd = join(__dirname, '..')
const filepath = (...path) => join(cwd, ...path)

/**
 * @typedef {{
 *   releaseNotesRaw: string,
 *   bskPrUrl: string,
 *   asanaOutputRaw: string,
 *   releaseUrl: string,
 *   version: string
 * }} CreatePRTemplateData
 * @typedef {'android' | 'extensions' | 'bsk' | 'ios' | 'macos' | 'windows'} ReleasePlatform
 */

const platform = /** @type {ReleasePlatform} */ (process.argv[2])

/** @type {CreatePRTemplateData} */
const data = {
    version: process.env.VERSION || '',
    releaseUrl: process.env.RELEASE_URL || '',
    releaseNotesRaw: process.env.RELEASE_NOTES || '',
    bskPrUrl: process.env.BSK_PR_URL || '',
    asanaOutputRaw: process.env.ASANA_OUTPUT || '{}'
}

/**
 * Outputs the PR template populated with data
 * @param {ReleasePlatform} platform
 * @param {CreatePRTemplateData} data
 * @returns {string}
 */
export function createPRTemplate (platform, data) {
    const asanaOutput = JSON.parse(data.asanaOutputRaw)
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
        extraContent = `BSK PR: ${data.bskPrUrl}`
    }

    const updatedTemplate = replaceAllInString(template, [
        [asanaUrlRegex, asanaUrl],
        [autofillReleaseUrlRegex, data.releaseUrl],
        [extraContentRegex, extraContent],
        [versionRegex, data.version],
        [descriptionRegex, data.releaseNotesRaw]
    ])
    return updatedTemplate
}

// The log is needed to read the value from the bash context
console.log(createPRTemplate(platform, data))
