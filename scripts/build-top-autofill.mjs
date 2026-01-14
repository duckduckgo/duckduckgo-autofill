import { readFileSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import esbuild from 'esbuild';
import { cwd } from './utils.mjs';

const CWD = cwd(import.meta.url);
const ROOT = join(CWD, '..');

/**
 * Builds TopAutofill.html with design tokens inlined.
 *
 * The tokens CSS from @duckduckgo/design-tokens is bundled and injected
 * into the HTML template. This allows the overlay (macOS/Windows) to have
 * access to the design tokens while keeping them out of autofill.js.
 */
export async function buildTopAutofill() {
    // Bundle the tokens CSS
    const tokensResult = await esbuild.build({
        entryPoints: [join(ROOT, 'node_modules/@duckduckgo/design-tokens/build/desktop-browsers/tokens.css')],
        bundle: true,
        write: false,
        loader: { '.css': 'css' },
    });

    const tokensCss = tokensResult.outputFiles[0].text;

    // Read the HTML template
    const htmlTemplate = readFileSync(join(ROOT, 'src/TopAutofill.html'), 'utf-8');

    // Inject tokens CSS
    const outputHtml = htmlTemplate.replace('<!-- $TOKENS_CSS$ -->', `<style>\n${tokensCss}</style>`);

    writeFileSync(join(ROOT, 'dist/TopAutofill.html'), outputHtml);
    console.log('✅', relative(ROOT, 'dist/TopAutofill.html'));
}

// Run if called directly
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
    buildTopAutofill();
}
