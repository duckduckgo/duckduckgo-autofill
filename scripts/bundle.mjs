import esbuild from 'esbuild';
import { readFileSync, writeFileSync } from "fs";
import { join, relative } from "path";
import { cwd } from "./utils.mjs";
const CWD = cwd(import.meta.url);
const ROOT = join(CWD, '..');
const SHOW_METAFILE = process.argv.some(string => string === '--metafile');

/**
 * Deliberately not try-catching around these operations.
 * Node's errors around paths etc. are descriptive and anything that
 * fails here should fail the process.
 */
(async () => {
    // default build
    await bundle({});

    // debug build
    await bundle({
        plugins: [],
        outfile: join(ROOT, 'dist/autofill-debug.js')
    });
})();

/**
 * @param {import("esbuild").BuildOptions} buildOptions
 */
async function bundle(buildOptions = {}) {
    /** @type {import("esbuild").BuildOptions} */
    const config = {
        entryPoints: [join(ROOT, 'src/autofill.js')],
        target: 'es2021',
        bundle: true,
        format: 'iife',
        legalComments: 'inline',
        outfile: join(ROOT, 'dist/autofill.js'),
        metafile: true,
        write: false,
        loader: {
            // import css files as text
            '.css': 'text'
        },
        plugins: [zodReplacerPlugin()],
        ...buildOptions
    };

    const buildOutput = await esbuild.build(config);

    //
    const files = buildOutput.outputFiles?.map(outputFile => {
        const content = Buffer.from(outputFile.contents).toString('utf-8')
        return {
            original: content,
            /**
             * NOTE: This is here because esbuild strips comments - but it doesn't
             * strip 'legal' comments. In the build output there will be instances of
             *
             * //! INJECT foobar here
             *
             * and we replace it to be this instead:
             *
             * // INJECT foobar here
             *
             */
            replaced: content.replace(/\/\/! INJECT/g, '// INJECT'),
            path: outputFile.path
        }
    })

    for (let file of files||[]) {
        writeFileSync(file.path, file.replaced)
        console.log('✅', relative(ROOT, file.path))
    }

    if (SHOW_METAFILE && 'metafile' in buildOutput && buildOutput.metafile) {
        console.log(await esbuild.analyzeMetafile(buildOutput.metafile))
    }
}

/**
 * This plugin is used to replace all the `export const` lines
 * in the validators with `export const x = null;` This is done
 * to strip `zod` from the final build.
 */
function zodReplacerPlugin() {
    return {
        name: 'zod-replacers',
        setup(build) {
            build.onResolve({ filter: /\.zod\.js$/ }, args => {
                return {
                    path: args.path,
                    namespace: 'zod-replacers',
                    pluginData: {
                        resolveDir: args.resolveDir,
                    }
                };
            });
            build.onLoad({ filter: /.*/, namespace: 'zod-replacers' }, args => {
                const file = readFileSync(join(args.pluginData.resolveDir, args.path), 'utf-8');
                const replaced = replaceConstExports(file);
                return {
                    contents: replaced,
                    loader: 'js'
                }
            })
        }
    }
}

/**
 * This takes any *.zod.js file and replaces all of the `export const` lines
 * with null exports.
 *
 * Eg:
 *   input: `export const mySchema = z.string();`
 *   output: `export const mySchema = null`
 *
 * @param {string} fileAsString
 * @return {string}
 */
export function replaceConstExports (fileAsString) {
    // Break up the incoming file into lines that contain const exports.
    const asLines = fileAsString
        .split('\n')
        .filter(x => x.startsWith('export const'))

    // now convert `export const x = z...` into `export const x = null`
    const asNames = asLines.map(x => {
        const [, , ident] = x.split(' ')
        return `export const ` + ident + ` = null;`
    }).flat()

    return asNames.join('\n')
}
