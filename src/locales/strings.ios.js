import en from './en/autofill.json';

/** @type {typeof import('./strings.js').getTranslator} */
export const getTranslator = () => (namespacedId, opts) => {
    const [namespace, id] = namespacedId.split(':', 2);
    const msg = namespace === 'autofill' ? en[id] : undefined;
    if (!msg) return id;
    let out = msg.title;
    for (const [name, value] of Object.entries(opts ?? {})) {
        out = out.replaceAll(`{${name}}`, value);
    }
    return out;
};
