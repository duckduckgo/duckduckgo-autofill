const https = require('https');
const prev = require("../rules.json");

module.exports = async ({github, context}) => {
    const res = [];
    const remote = await fetchRemote();
    for (let [domain, value] of Object.entries(prev)) {
        if (!remote[domain]) {
            res.push(`local, not in remote: ${domain}`)
        } else {
            if (remote[domain]['password-rules'] !== value['password-rules']) {
                res.push(`DIFF ${domain}: `);
                res.push(`\tlocal: ${value['password-rules']}`)
                res.push(`\tremote: ${remote[domain]['password-rules']}`)
            }
        }
    }
    for (let [domain, value] of Object.entries(remote)) {
        if (!prev[domain]) {

            res.push(`in remote, not in local: ${domain}`)
            res.push(`\trules: ${value['password-rules']}`);
        }
    }
    return res.join('\n');
}

function fetchRemote() {
    return new Promise((resolve, error) => {
        const chunks = [];
        https.get('https://raw.githubusercontent.com/apple/password-manager-resources/main/quirks/password-rules.json', (res) => {
            if (res.statusCode !== 200) {
                return error(new Error(`none-200 response: ${res.statusCode}`))
            }

            res.on('data', (d) => {
                chunks.push(d.toString());
            });
        }).on('error', (e) => {
            console.error(e);
            error(e);
        }).on('close', () => {
            resolve(JSON.parse(chunks.join("")))
        })
    })
}
