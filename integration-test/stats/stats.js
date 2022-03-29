import { readFileSync } from 'fs'
import { join } from 'path'

const __dirname = new URL('.', import.meta.url).pathname

const originals = JSON.parse(readFileSync(join(__dirname, 'scan-original.json'), 'utf8'))
const memo = JSON.parse(readFileSync(join(__dirname, 'scan-memo.json'), 'utf8'))

const items = []

originals.forEach((original, index) => {
    if (memo[index]?.url === original.url) {
        const curr = memo[index]
        const diff = (original.duration - curr.duration).toFixed(2)
        items.push({
            url: original.url,
            original: original.duration,
            after: curr.duration,
            diffstr: diff > 0 ? `✅ -${diff}` : `❌ +${Math.abs(diff)}`,
            p: (100 - ((curr.duration / original.duration) * 100)).toFixed(2) + '% faster',
            diff
        })
    }
})

console.table(
    items.sort((a, b) => b.diff - a.diff)
)

// (101 / 141) x 100 = 71.63121%
