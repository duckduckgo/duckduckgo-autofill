const {join} = require('path')
const {writeFileSync} = require('fs')
const outputPath = join(__dirname, '..', 'rules.json')
const REMOTE_URL = 'https://raw.githubusercontent.com/apple/password-manager-resources/main/quirks/password-rules.json'

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

function update (rules) {
    writeFileSync(outputPath, JSON.stringify(rules, null, 2))
}

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

if (!require.main) {
    download()
        .then((rules) => update(rules))
        .then(() => {
            console.log('rules updated')
        }).catch(e => {
            console.error(e)
            process.exit(1)
        })
}

module.exports.update = update
module.exports.summary = summary
module.exports.download = download
module.exports.REMOTE_URL = REMOTE_URL
