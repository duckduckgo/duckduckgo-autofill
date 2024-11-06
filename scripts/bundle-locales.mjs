// Originally copied from duckduckgo/duckduckgo-privacy-extension:
// https://github.com/duckduckgo/duckduckgo-privacy-extension/blob/b5ec76c03f8b833c9e1a26418ea47490148bbc99/scripts/bundleLocales.mjs

// Combines translation namespaces into a single file in src/locales/translations.js.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const imports = [];
const localeObjects = {};
const localesDir = fileURLToPath(new URL('../src/locales/', import.meta.url));
const locales = fs
    .readdirSync(localesDir, { encoding: 'utf-8', withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('.'))
    .map((dirent) => dirent.name);

locales.forEach((lang) => {
    const namespaces = fs
        .readdirSync(path.join(localesDir, lang))
        .filter((f) => !f.startsWith('.'))
        .map((f) => f.slice(0, f.length - 5));
    const resources = namespaces
        .map((ns) => {
            const importName = `${lang}${ns[0].toUpperCase()}${ns.slice(1)}`;
            imports.push(`import ${importName} from './${lang}/${ns}.json'`);
            return `${ns}: ${importName}`;
        })
        .join(', ');
    localeObjects[lang] = `{ ${resources} }`;
});

const translationsJs = `/**
 * This file is auto-generated by scripts/bundle-locales.mjs, based on the contents of the src/locales/ directory.
 * Any manual changes in here will be overwritten on build!
 */
${imports.join('\n')}

export default {
    ${Object.keys(localeObjects)
        .map((lang) => `${lang}: ${localeObjects[lang]}`)
        .join(',\n    ')}
}
`;
fs.writeFileSync(path.join(localesDir, 'translations.js'), translationsJs, 'utf-8');
