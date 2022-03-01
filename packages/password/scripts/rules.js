const {join} = require('path')
const {writeFileSync} = require('fs')
const outputPath = join(__dirname, '..', 'rules.json')
const REMOTE_URL = 'https://raw.githubusercontent.com/apple/password-manager-resources/main/quirks/password-rules.json'

/**
 * This file contains utilities for keeping our password rules in sync.
 */

/**
 * @param {typeof import("../rules.json")} prev
 * @param {typeof import("../rules.json")} next
 * @returns {string[]}
 */
function summary (prev, next) {
    const lines = []

    for (let [domain, value] of Object.entries(prev)) {
        if (domain in next) {
            if (value['password-rules'] !== next[domain]['password-rules']) {
                lines.push(`${domain} rules differ`)
                lines.push(`\tcurrent: ${value['password-rules']}`)
                lines.push(`\tremote:  ${next[domain]['password-rules']}`)
            }
        } else {
            lines.push(`${domain} no longer in remote`)
        }
    }

    for (let [domain, value] of Object.entries(next)) {
        if (!(domain in prev)) {
            lines.push(`${domain} not present in current`)
            lines.push(`\trules: ${value['password-rules']}`)
        }
    }

    return lines
}

/**
 * @param {typeof import("../rules.json")} rules
 */
function update (rules) {
    writeFileSync(outputPath, JSON.stringify(rules, null, 2))
}

/**
 * @returns {Promise<typeof import("../rules.json")>}
 */
function download () {
    const https = require('https')
    return new Promise((resolve, reject) => {
        const chunks = []
        https.get(REMOTE_URL, (res) => {
            res.on('data', (d) => {
                chunks.push(d.toString())
            })
        }).on('error', (e) => {
            reject(e)
        }).on('close', () => {
            resolve(JSON.parse(chunks.join('')))
        })
    })
}

if (process.argv.includes('--write-rules-json')) {
    download()
        .then((remoteRules) => {
            const current = require("../rules.json");
            const lines = summary(current, remoteRules)
            if (lines.length) {
                update(remoteRules)
                console.log('rules updated')
            } else {
                console.log("nothing to update")
            }
        }).catch(e => {
            console.error(e)
            process.exit(1)
        })
}

module.exports.update = update
module.exports.summary = summary
module.exports.download = download
module.exports.REMOTE_URL = REMOTE_URL
