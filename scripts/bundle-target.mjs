import { join, relative, basename, dirname } from 'path';
import esbuild from 'esbuild';
import { cwd } from './utils.mjs';
import { cssPlugin, zodReplacerPlugin } from './bundle.mjs';
import { existsSync, readFileSync, writeFileSync } from 'fs';
const CWD = cwd(import.meta.url);
const ROOT = join(CWD, '..');
const ACTIVATION = join(ROOT, 'src/activation.js');
const MATCHER = `'use bundle';`;

export async function bundleTarget(target, _targetConfig) {
    /** @type {import("esbuild").BuildOptions} */
    const config = {
        entryPoints: [join(ROOT, 'src/autofill.js')],
        target: 'es2021',
        bundle: true,
        format: 'esm',
        legalComments: 'inline',
        outfile: join(ROOT, 'dist/autofill.js'),
        metafile: true,
        write: false,
        plugins: [zodReplacerPlugin(), cssPlugin(), targetOverridesPlugin(target)],
    };

    const buildOutput = await esbuild.build(config).catch((err) => console.log(err));
    const files = buildOutput.outputFiles?.map((outputFile) => {
        const content = outputFile.text;
        return {
            original: content,
            replaced: content.replace(/\/\/! INJECT/g, '// INJECT'),
            path: outputFile.path,
        };
    });
    const file = files[0];
    const wrapper = readFileSync(ACTIVATION, 'utf8').toString();
    if (wrapper.indexOf(MATCHER) === -1) {
        throw new Error('Bundle target not found.');
    }
    // replacer function, so `$&` sequences in the bundle are not treated as patterns
    const embedded = wrapper.replace(MATCHER, () => file.replaced);
    const named = basename(file.path, '.js');
    const dir = dirname(file.path);
    const filename = join(dir, `${named}.${target}.js`);
    writeFileSync(filename, embedded);
    console.log('✅', relative(ROOT, filename));
}

/**
 * Swaps `x.js` for a sibling `x.<target>.js` when one exists, e.g. `transports.js` -> `transports.ios.js`
 * @param {string} target
 * @return {import("esbuild").Plugin}
 */
function targetOverridesPlugin(target) {
    return {
        name: 'target-overrides',
        setup(build) {
            build.onResolve({ filter: /^urlpattern-polyfill$/ }, () => {
                const override = join(ROOT, 'src', `urlpattern-polyfill.${target}.js`);
                return existsSync(override) ? { path: override } : undefined;
            });
            build.onResolve({ filter: /^\.\.?\/.*\.js$/ }, (args) => {
                const override = join(args.resolveDir, args.path.replace(/\.js$/, `.${target}.js`));
                return existsSync(override) ? { path: override } : undefined;
            });
        },
    };
}
