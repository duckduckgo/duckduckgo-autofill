const {readFileSync, writeFileSync, copyFileSync} = require('fs')
const {join} = require('path')
const cwd = join(__dirname, '..')
const filepath = (path) => join(cwd, path)

copyAutofillCSS()
copyAutofillScriptToExtension()

function copyAutofillCSS () {
    copyFileSync(filepath('src/UI/styles/autofill-tooltip-styles.css'), filepath('dist/autofill.css'))
    copyFileSync(filepath('src/UI/styles/autofill-tooltip-styles.css'), filepath('integration-test/extension/public/css/autofill.css'))

    copyFileSync(filepath('src/UI/styles/autofill-host-styles.css'), filepath('dist/autofill-host-styles_chrome.css'))
    copyFirefoxCSSFile(filepath('src/UI/styles/autofill-host-styles.css'), filepath('dist/autofill-host-styles_firefox.css'))
}

function copyFirefoxCSSFile (pathIn, pathOut) {
    let css = readFileSync(pathIn, 'utf8')

    // Firefox and Chrome treat relative url differently in injected scripts. This fixes it.
    const chromePublicDir = 'chrome-extension://__MSG_@@extension_id__/public/'
    css = css.replaceAll(chromePublicDir, '../')

    writeFileSync(pathOut, css)
}

function copyAutofillScriptToExtension () {
    const source = '// INJECT isDDGTestMode HERE'
    const replacement = 'isDDGTestMode = true;'
    const autofill = readFileSync(filepath('dist/autofill.js'), 'utf8')
    if (!autofill.includes(source)) {
        throw new Error('cannot find source for replacement, expected: ' + source)
    }
    const replaced = autofill.replace(source, replacement)
    writeFileSync(filepath('integration-test/extension/autofill.js'), replaced)
}
