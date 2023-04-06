import { generate } from '../password/index.js'
import rules from '../password/rules.json'

window.__pw_generate = (params) => {
    return generate({
        rules,
        ...params
    })
}
