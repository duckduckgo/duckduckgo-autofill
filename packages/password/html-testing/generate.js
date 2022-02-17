/**
 *
 * This file is used to generate the table of inputs inside `index.html`
 *
 * You can run this any time that `../rules.json` has changed, or after
 * adding any manual entries to `manualEntries` below.
 *
 */
const {readFileSync, writeFileSync} = require('fs')
const {join} = require('path')
const rules = require('../rules.json')
const filePath = join(__dirname, 'index.html')
const html = readFileSync(filePath, 'utf8')

let s = ''

const manualEntries = {
    // this is just to test the use of chars that need escaping
    '" test': { 'password-rules': `minlength: 6; required: lower, upper; required: digit; required: ["]` }
}

const joined = [...Object.entries(manualEntries), ...Object.entries(rules)]

for (let [domain, value] of joined) {
    const rules = value['password-rules']
    if (domain && rules) {
        s += `
<tr>
    <td>
        <button type="button" data-pw="${escapeXML(rules)}">${domain}</button>
    </td>
    <td>
        <pre><code>${escapeXML(rules)}</code></pre>
    </td>
</tr>
        `
    }
}

const markerStart = '<table id="table">'
const start = html.indexOf(markerStart) + markerStart.length
const end = html.indexOf('</table>')

const newHtml = html.slice(0, start) + s + html.slice(end)

writeFileSync(filePath, newHtml)

/**
 * Escapes any occurrences of &, ", <, > or / with XML entities.
 * @param {string} str The string to escape.
 * @return {string} The escaped string.
 */
function escapeXML (str) {
    const replacements = { '&': '&amp;', '"': '&quot;', "'": '&apos;', '<': '&lt;', '>': '&gt;', '/': '&#x2F;' }
    return String(str).replace(/[&"'<>/]/g, m => replacements[m])
}
