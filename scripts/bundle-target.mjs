import { join, relative } from 'path';
import esbuild from 'esbuild';
import { cwd } from './utils.mjs';
import { cssPlugin, zodReplacerPlugin } from './bundle.mjs';
import { readFileSync, writeFileSync } from 'fs';
const CWD = cwd(import.meta.url);
const ROOT = join(CWD, '..');

/**
 * Bundles Autofill with deferred activation - eg: a script can check
 * if we're in a blank frame (or any other check)
 *
 * Output is like this:
 *
 * ```js
 * 'use strict';
 * {
 *     const ddgAutofill = () => {
 *         // bundle code here
 *     };
 *     // contents of the target's activation file, which calls ddgAutofill()
 * }
 * ```
 *
 * @param {string} target
 * @param {import('./manifest.mjs').TargetConfig} targetConfig
 * @param {{dev?: boolean}} [options]
 */
export async function bundleTarget(target, targetConfig, { dev = false } = {}) {
    const tokens = {
        // esm output has no "use strict" (modules are strict by default), but the
        // wrapped bundle runs as a classic script, so restore it to match the iife builds
        strict: "'use strict';",
        blockStart: '{',
        closureStart: '    const ddgAutofill = () => {',
        closureEnd: '    };',
        activation: readFileSync(join(ROOT, targetConfig.activation), 'utf8'),
        blockEnd: '}',
    };

    /** @type {import("esbuild").BuildOptions} */
    const config = {
        entryPoints: [join(ROOT, 'src/autofill.js')],
        target: 'es2021',
        bundle: true,
        format: 'esm',
        legalComments: 'inline',
        outfile: join(ROOT, `dist/autofill.${target}.js`),
        metafile: true,
        write: false,
        sourcemap: dev ? 'inline' : false,
        banner: { js: [tokens.strict, tokens.blockStart, tokens.closureStart].join('\n') },
        footer: { js: [tokens.closureEnd, tokens.activation, tokens.blockEnd].join('\n') },
        plugins: [zodReplacerPlugin(), cssPlugin()],
    };

    const buildOutput = await esbuild.build(config);
    for (const outputFile of buildOutput.outputFiles) {
        // see the note on `//! INJECT` in bundle.mjs
        writeFileSync(outputFile.path, outputFile.text.replace(/\/\/! INJECT/g, '// INJECT'));
        console.log('✅', relative(ROOT, outputFile.path));
    }
}
