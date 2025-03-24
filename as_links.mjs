import { readdirSync } from 'node:fs';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const d = readdirSync(`test-forms`, { withFileTypes: true });
const sets = d
    .filter((x) => {
        return x.name.endsWith('.html');
    })
    .map((x) => {
        const content = readFileSync(join(x.parentPath, x.name), 'utf-8');
        return {
            name: x.name,
            content,
        };
    });

writeFileSync('all.json', JSON.stringify(sets));
