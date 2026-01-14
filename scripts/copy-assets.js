const { readFileSync, writeFileSync, copyFileSync, readdirSync } = require('fs');
const { join } = require('path');
const cwd = join(__dirname, '..');
const filepath = (...path) => join(cwd, ...path);
const fs = require('fs');

const srcPath = 'src';
const distPath = 'dist';

// Check if DEBUG_UI environment variable is set
const isDebugUI = process.env.DEBUG_UI === 'true';

copyAutofillCSS();
copyAutofillScript();
// Note: TopAutofill.html is now built by build-top-autofill.mjs with inlined design tokens
copySharedCredentials();

// Only copy image assets when in debug UI mode
if (isDebugUI) {
    copyImageAssets();
}

function copyAutofillCSS() {
    const stylesPath = filepath(distPath, 'autofill.css');
    copyFileSync(stylesPath, filepath('integration-test', 'extension', 'public', 'css', 'autofill.css'));

    const hostStylesPath = filepath(srcPath, 'UI', 'styles', 'autofill-host-styles.css');
    copyFileSync(hostStylesPath, filepath(distPath, 'autofill-host-styles_chrome.css'));
    copyFirefoxCSSFile(hostStylesPath, filepath(distPath, 'autofill-host-styles_firefox.css'));
    copyFileSync(hostStylesPath, filepath('integration-test', 'extension', 'public', 'css', 'autofill-host-styles_chrome.css'));
}

// Note: copyAutofillHTML has been removed.
// TopAutofill.html is now built by build-top-autofill.mjs with inlined design tokens.

function copySharedCredentials() {
    const sharedCredsFilePath = filepath('packages', 'password', 'shared-credentials.json');
    copyFileSync(sharedCredsFilePath, filepath(distPath, 'shared-credentials.json'));
}

function copyFirefoxCSSFile(pathIn, pathOut) {
    let css = readFileSync(pathIn, 'utf8');

    // Firefox and Chrome treat relative url differently in injected scripts. This fixes it.
    const chromePublicDir = 'chrome-extension://__MSG_@@extension_id__/public/';
    css = css.replaceAll(chromePublicDir, '../');

    writeFileSync(pathOut, css);
}

function copyAutofillScript() {
    const scriptFileName = 'autofill.js';
    const debugScriptFileName = 'autofill-debug.js';
    const source = '// INJECT isDDGTestMode HERE';
    const replacement = 'isDDGTestMode = true;';

    // read both source files
    const autofill = readFileSync(filepath(distPath, scriptFileName), 'utf8');
    const autofillDebug = readFileSync(filepath(distPath, debugScriptFileName), 'utf8');

    if (!autofill.includes(source)) {
        throw new Error('cannot find source for replacement, expected: ' + source);
    }

    // replace the variables in both scripts
    const replaced = autofill.replace(source, replacement);
    const replacedDebug = autofillDebug.replace(source, replacement);

    // also overwrite the regular dist/autofill-debug.js to ensure all consumers of 'debug' also get isDDGTestMode=true
    writeFileSync(filepath(distPath, debugScriptFileName), replacedDebug);

    // extension output of integration-test/extension/autofill.js
    writeFileSync(filepath('integration-test', 'extension', scriptFileName), replaced);

    // extension output of integration-test/extension/autofill-debug.js
    writeFileSync(filepath('integration-test', 'extension', debugScriptFileName), replacedDebug);
}

/**
 * Copy image assets for debug UI
 * This function is only called when the DEBUG_UI environment variable is set to 'true'
 */
function copyImageAssets() {
    const imgSrcPath = filepath(srcPath, 'UI', 'img');
    const imgRootPath = filepath('img');

    // Ensure the destination directory exists
    if (!fs.existsSync(imgRootPath)) {
        fs.mkdirSync(imgRootPath, { recursive: true });
    }

    console.log(`Copying debug-ui assets to img folder`);
    const images = readdirSync(imgSrcPath);
    images.forEach((image) => {
        const srcImagePath = join(imgSrcPath, image);
        const rootImagePath = join(imgRootPath, image);
        copyFileSync(srcImagePath, rootImagePath);
        console.log(`✅ Copied ${image} to ${rootImagePath}`);
    });
}
