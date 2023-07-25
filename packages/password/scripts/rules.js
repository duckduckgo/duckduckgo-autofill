const {join} = require('path')
const {writeFileSync} = require('fs')
const { createHash } = require('node:crypto')
const outputPathRules = join(__dirname, '..', 'rules.json')
const outputPathSharedCreds = join(__dirname, '..', 'shared-credentials.json')
const BASE_URL = 'https://raw.githubusercontent.com/apple/password-manager-resources/main/quirks/'
const SHARED_CREDENTIALS_URL = BASE_URL + 'shared-credentials.json'
const PASSWORD_RULES_URL = BASE_URL + 'password-rules.json'

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
 * @param {import("fs").PathOrFileDescriptor} outputPath
 * @param {typeof import("../rules.json") | typeof import("../shared-credentials.json")} contents
 */
function update (outputPath, contents) {
    writeFileSync(outputPath, JSON.stringify(contents, null, 2))
}

/**
 * @param {string} url
 * @returns {Promise<any>}
 */
function download (url) {
    const https = require('https')
    return new Promise((resolve, reject) => {
        const chunks = []
        https.get(url, (res) => {
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

/**
 * @returns {Promise<typeof import("../rules.json")>}
 */
function downloadRules () {
    return download(PASSWORD_RULES_URL)
}

/**
 * @returns {Promise<typeof import("../shared-credentials.json")>}
 */
function downloadSharedCreds () {
    return download(SHARED_CREDENTIALS_URL)
}

/**
 * Creates a hash of a string using node:crypto
 * @param {string} content
 * @param {string} algo
 * @returns {string}
 * @source https://stackoverflow.com/a/74933512/1948947
 */
function hashText (content, algo = 'sha256') {
    const hashFunc = createHash(algo)
    hashFunc.update(content)
    return hashFunc.digest('hex')
}

if (process.argv.includes('--write-json-files')) {
    downloadRules()
        .then((remoteRules) => {
            const current = require('../rules.json')
            const lines = summary(current, remoteRules)
            if (lines.length) {
                update(outputPathRules, remoteRules)
                console.log('rules updated')
            } else {
                console.log('rules already up to date')
            }
        }).catch(e => {
            console.error(e)
            process.exit(1)
        })

    downloadSharedCreds()
        .then((remoteSharedCreds) => {
            const localSharedCreds = require('../shared-credentials.json')
            const localSha256 = hashText(JSON.stringify(localSharedCreds))
            const remoteSha256 = hashText(JSON.stringify(remoteSharedCreds))
            if (localSha256 !== remoteSha256) {
                update(outputPathSharedCreds, remoteSharedCreds)
                console.log('shared credentials updated')
            } else {
                console.log('shared credentials already up to date')
            }
        }).catch(e => {
            console.error(e)
            process.exit(1)
        })
}
