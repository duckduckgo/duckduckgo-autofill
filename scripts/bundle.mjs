import esbuild from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import { cwd } from './utils.mjs';
const CWD = cwd(import.meta.url);
const ROOT = join(CWD, '..');
const SHOW_METAFILE = process.argv.some((string) => string === '--metafile');

/**
 * Deliberately not try-catching around these operations.
 * Node's errors around paths etc. are descriptive and anything that
 * fails here should fail the process.
 */
(async () => {
    // default build
    Promise.all([
        bundle({}),
        bundle({
            plugins: [cssPlugin(false)],
            outfile: join(ROOT, 'dist/autofill-debug.js'),
        }),
        uiPreview(),
    ]);
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
        plugins: [
            zodReplacerPlugin(),
            cssPlugin(),
        ],
        ...buildOptions,
    };

    const buildOutput = await esbuild.build(config);

    //
    const files = buildOutput.outputFiles?.map((outputFile) => {
        const content = Buffer.from(outputFile.contents).toString('utf-8');
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
            path: outputFile.path,
        };
    });

    for (const file of files || []) {
        writeFileSync(file.path, file.replaced);
        console.log('✅', relative(ROOT, file.path));
    }

    if (SHOW_METAFILE && 'metafile' in buildOutput && buildOutput.metafile) {
        console.log(await esbuild.analyzeMetafile(buildOutput.metafile));
    }
}

async function uiPreview() {
    /** @type {import("esbuild").BuildOptions} */
    const config = {
        entryPoints: [join(ROOT, 'debug/ui-debug.js')],
        target: 'es2021',
        bundle: true,
        format: 'iife',
        legalComments: 'inline',
        outfile: join(ROOT, 'debug/dist/ui-debug.js'),
        metafile: true,
        loader: {
            '.css': 'text',
        },
    };
    await esbuild.build(config);
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
            build.onResolve({ filter: /\.zod\.js$/ }, (args) => {
                return {
                    path: args.path,
                    namespace: 'zod-replacers',
                    pluginData: {
                        resolveDir: args.resolveDir,
                    },
                };
            });
            build.onLoad({ filter: /.*/, namespace: 'zod-replacers' }, (args) => {
                const file = readFileSync(join(args.pluginData.resolveDir, args.path), 'utf-8');
                const replaced = replaceConstExports(file);
                return {
                    contents: replaced,
                    loader: 'js',
                };
            });
        },
    };
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
export function replaceConstExports(fileAsString) {
    // Break up the incoming file into lines that contain const exports.
    const asLines = fileAsString.split('\n').filter((x) => x.startsWith('export const'));

    // now convert `export const x = z...` into `export const x = null`
    const asNames = asLines
        .map((x) => {
            const [, , ident] = x.split(' ');
            return `export const ` + ident + ` = null;`;
        })
        .flat();

    return asNames.join('\n');
}

/**
 * Plugin to handle CSS files and transform url() calls into data URLs
 * @param {boolean} [transformUrls=true] - Whether to transform url() calls into data URLs
 */
function cssPlugin(transformUrls = true) {
    return {
        name: 'css-plugin',
        setup(build) {
            build.onResolve({ filter: /\.css$/ }, (args) => {
                return {
                    path: args.path,
                    namespace: 'css-plugin',
                    pluginData: {
                        resolveDir: args.resolveDir,
                        transformUrls,
                    },
                };
            });

            build.onLoad({ filter: /.*/, namespace: 'css-plugin' }, async (args) => {
                const filePath = join(args.pluginData.resolveDir, args.path);
                const cssContent = readFileSync(filePath, 'utf-8');
                
                // Only transform URLs if transformUrls is true
                const transformedContent = args.pluginData.transformUrls 
                    ? await transformCssUrls(cssContent, filePath)
                    : cssContent;
                
                return {
                    contents: transformedContent,
                    loader: 'text',
                };
            });
        },
    };
}

/**
 * Transforms CSS url() calls into data URLs
 * @param {string} cssContent - The CSS content to transform
 * @param {string} cssFilePath - The absolute path to the CSS file
 * @returns {Promise<string>} - The transformed CSS content
 */
async function transformCssUrls(cssContent, cssFilePath) {
    const urlRegex = /url\(['"]?([^'"()]+)['"]?\)/g;
    let transformedContent = cssContent;
    
    // Find all url() calls
    const matches = [...cssContent.matchAll(urlRegex)];
    
    for (const match of matches) {
        const url = match[1];
        // Skip data URLs and absolute URLs
        if (url.startsWith('data:') || url.startsWith('http') || url.startsWith('//')) {
            continue;
        }
        
        try {
            // Get the directory of the CSS file
            const cssDir = join(cssFilePath, '..');
            // Resolve the URL relative to the CSS file's directory
            const absolutePath = join(cssDir, url);
            
            const fileContent = readFileSync(absolutePath);
            const base64 = fileContent.toString('base64');
            const mimeType = getMimeType(url);
            const dataUrl = `url(data:${mimeType};base64,${base64})`;
            
            transformedContent = transformedContent.replace(match[0], dataUrl);
        } catch (error) {
            console.warn(`Failed to transform URL in CSS: ${url}`, error);
        }
    }
    
    return transformedContent;
}

/**
 * Gets the MIME type based on file extension
 * @param {string} url - The URL to get MIME type for
 * @returns {string} - The MIME type
 */
function getMimeType(url) {
    const extension = url.split('.').pop()?.toLowerCase();
    const mimeTypes = {
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'woff': 'font/woff',
        'woff2': 'font/woff2',
        'ttf': 'font/ttf',
        'eot': 'application/vnd.ms-fontobject',
    };
    
    return mimeTypes[extension] || 'application/octet-stream';
}
