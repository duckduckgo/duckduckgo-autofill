const {readFileSync, writeFileSync, copyFileSync} = require('fs')
const {join} = require('path')
const cwd = join(__dirname, '..')
const filepath = (path) => join(cwd, path)

copyAutofillCSS()
copyAutofillScriptToExtension()

function copyAutofillCSS () {
    const css = require('../src/UI/styles/autofill-tooltip-styles.js')
    writeFileSync(filepath('dist/autofill.css'), css.trim() + '\n')
    writeFileSync(filepath('integration-test/extension/public/css/autofill.css'), css.trim() + '\n')
    copyFileSync(filepath('src/UI/styles/autofill-host-styles.css'), filepath('dist/autofill-host-styles_chrome.css'))
    copyFileSync(filepath('src/UI/styles/autofill-host-styles.css'), filepath('dist/autofill-host-styles_firefox.css'))
}

function copyAutofillScriptToExtension () {
    const source = 'let isDDGTestMode = false'
    const replacement = 'let isDDGTestMode = true'
    const autofill = readFileSync(filepath('dist/autofill.js'), 'utf8')
    if (!autofill.includes(source)) {
        throw new Error('cannot find source for replacement, expected: ' + source)
    }
    const replaced = autofill.replace(source, replacement)
    writeFileSync(filepath('integration-test/extension/autofill.js'), replaced)
}
