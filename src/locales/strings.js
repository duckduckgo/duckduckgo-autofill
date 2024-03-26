// TODO(sjbarag): read from JS module generated from JSON files, probably.
const translations = {
    en: {
        'hello': {
            title: 'Hello world',
            note: 'Static text for testing.'
        },
        'lipsum': {
            title: 'Lorem ipsum dolor sit amet, {foo} {bar}',
            note: 'Placeholder text.'
        },
        'usePersonalDuckAddr': {
            title: 'Use {email}',
            note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
        },
        'blockEmailTrackers': {
            title: 'Block email trackers',
            note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
        }
    },
    xa: {
        'hello': {
            title: 'H33ll00 wºrrld',
            note: 'Static text for testing.'
        },
        'lipsum': {
            title: 'Lºrr3e3m 1p$$$um d00l1loor s!t @@mett, {foo} {bar}',
            note: 'Placeholder text.'
        },
        'usePersonalDuckAddr': {
            title: 'Ü55££ {email}',
            note: 'Shown when a user can choose their personal @duck.com address.'
        },
        'blockEmailTrackers': {
            title: 'Bl000ck €m@@@i1il1l träáåck33rr55',
            note: 'Shown when a user can choose their personal @duck.com address on native platforms.'
        }
    }
}

/**
 * @callback TranslateFn
 * Translates a string with the provided ID to the current language, replacing
 * each placeholder with a key present in `opts` with the corresponding value.
 *
 * @param {string} id - the string ID to look up
 * @param {Record<string, string>} [opts] - a set of optional replacements to perform
 * @returns {string} the string with ID `id`, translated to the current language
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
 * @typedef {object} Translation
 * @prop {string} title - the translated string
 * @prop {string} note - a description of `title` used to aid translators
 */

/**
 * Looks up the string with the provided `id` in a `library`, performing
 * key-value replacements on the translated string. If no string with ID `id` is
 * found, `id` is returned unmodified.
 * @param {Record<string, Translation>} library - a map of string IDs to translation
 * @param {string} id - the string ID to translate
 * @param {Record<string, string>} [opts] - a set of optional replacements to perform
 * @returns {string} the string with ID `id`, translated to the current language
 */
function translateImpl (library, id, opts) {
    const msg = library[id]
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
