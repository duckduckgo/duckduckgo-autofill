const {readFileSync, writeFileSync, copyFileSync} = require('fs')
const {join} = require('path')
const cwd = join(__dirname, '..')
const filepath = (...path) => join(cwd, ...path)
const srcPath = 'src'
const distPath = 'dist'
const appleDistPath = join('swift-package', 'Resources', 'assets')

copyAutofillCSS()
copyAutofillScript()
copyAutofillHTML()

function copyAutofillCSS () {
    const stylesPath = filepath(srcPath, 'UI', 'styles', 'autofill-tooltip-styles.css')
    copyFileSync(stylesPath, filepath(distPath, 'autofill.css'))
    copyFileSync(stylesPath, filepath(appleDistPath, 'autofill.css'))
    copyFileSync(stylesPath, filepath('integration-test', 'extension', 'public', 'css', 'autofill.css'))

    const hostStylesPath = filepath(srcPath, 'UI', 'styles', 'autofill-host-styles.css')
    copyFileSync(hostStylesPath, filepath(distPath, 'autofill-host-styles_chrome.css'))
    copyFirefoxCSSFile(hostStylesPath, filepath(distPath, 'autofill-host-styles_firefox.css'))
}

function copyAutofillHTML () {
    const htmlFileName = 'TopAutofill.html'
    copyFileSync(filepath(srcPath, htmlFileName), filepath(appleDistPath, htmlFileName))
}

function copyFirefoxCSSFile (pathIn, pathOut) {
    let css = readFileSync(pathIn, 'utf8')

    // Firefox and Chrome treat relative url differently in injected scripts. This fixes it.
    const chromePublicDir = 'chrome-extension://__MSG_@@extension_id__/public/'
    css = css.replaceAll(chromePublicDir, '../')

    writeFileSync(pathOut, css)
}

function copyAutofillScript () {
    const scriptFileName = 'autofill.js'
    const debugScriptFileName = 'autofill-debug.js'
    const source = '// INJECT isDDGTestMode HERE'
    const replacement = 'isDDGTestMode = true;'
    const autofill = readFileSync(filepath(distPath, scriptFileName), 'utf8')
    if (!autofill.includes(source)) {
        throw new Error('cannot find source for replacement, expected: ' + source)
    }
    writeFileSync(filepath(appleDistPath, scriptFileName), autofill)
    writeFileSync(filepath(appleDistPath, debugScriptFileName), autofill)

    const replaced = autofill.replace(source, replacement)
    writeFileSync(filepath('integration-test', 'extension', scriptFileName), replaced)
    writeFileSync(filepath('integration-test', 'extension', debugScriptFileName), replaced)
}
