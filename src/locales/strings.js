import translations from './translations.js'

/** @typedef {`autofill:${keyof typeof translations["en"]["autofill"]}`} AutofillKeys */

/**
 * @callback TranslateFn
 * Translates a string with the provided namespaced ID to the current language,
 * replacing each placeholder with a key present in `opts` with the
 * corresponding value.
 *
 * @param {AutofillKeys} id - the namespaced string ID to look up
 * @param {Record<string, string>} [opts] - a set of optional replacements to perform
 * @returns {string} the string with namespaced ID `id`, translated to the current language
 */

/**
 * Builds a reusable translation function bound to the language provided by
 * `settings`. That language isn't read until the first translation is
 * requested, so it's safe to use this statically and assign `settings.language`
 * later.
 *
 * @param {{ language: string }} settings - a settings object containing the current language
 * @returns {TranslateFn} a translation function
 */
export function getTranslator (settings) {
    /** @type typeof translations["en"] */
    let library

    return function t (id, opts) {
        // Retrieve the library when the first string is translated, to allow
        // InterfacePrototype.t() to be statically initialized.
        if (!library) {
            const { language } = settings
            library = translations[language]
            if (!library) {
                console.warn(`Received unsupported locale '${language}'. Falling back to 'en'.`)
                library = translations.en
            }
        }

        return translateImpl(library, id, opts)
    }
}

/**
 * Looks up the string with the provided `id` in a `library`, performing
 * key-value replacements on the translated string. If no string with ID `id` is
 * found, `id` is returned unmodified.
 * @param {typeof translations["en"]} library - a map of string IDs to translation
 * @param {AutofillKeys} namespacedId - the namespaced string ID to translate (e.g. "autofill:hello")
 * @param {Record<string, string>} [opts] - a set of optional replacements to perform
 * @returns {string} the string with ID `id`, translated to the current language
 */
function translateImpl (library, namespacedId, opts) {
    const [namespace, id] = namespacedId.split(':', 2)
    const namespacedLibrary = library[namespace]

    // Fall back to the message ID if an unsupported namespace is provided.
    if (!namespacedLibrary) { return id }

    const msg = namespacedLibrary[id]
    // Fall back to the message ID if an unsupported message is provided.
    if (!msg) { return id }

    // Fast path: don't loop over opts if no replacements are provided.
    if (!opts) { return msg.title }

    // Repeatedly replace all instances of '{SOME_REPLACEMENT_NAME}' with the
    // corresponding value.
    let out = msg.title
    for (const [ name, value ] of Object.entries(opts)) {
        out = out.replaceAll(`{${name}}`, value)
    }
    return out
}
