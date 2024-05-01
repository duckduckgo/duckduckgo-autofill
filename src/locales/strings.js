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
        },
        'passwordForUrl': {
            title: 'Password for {url}',
            note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
        },
        'generatedPassword': {
            title: 'Generated password',
            note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
        },
        'passwordWillBeSaved': {
            title: 'Password will be saved for this website',
            note: 'Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted'
        },
        'bitwardenIsLocked': {
            title: 'Bitwarden is locked',
            note: 'Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked'
        },
        'unlockYourVault': {
            title: 'Unlock your vault to access credentials or generate passwords',
            note: 'Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords'
        },
        'generatePrivateDuckAddr': {
            title: 'Generate Private Duck Address',
            note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form.'
        },
        'hideEmailAndBlockTrackers': {
            title: 'Hide your email and block trackers',
            note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
        },
        'createUniqueRandomAddr': {
            title: 'Create a unique, random address that also removes hidden trackers and forwards email to your inbox.',
            note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
        },
        'manageFilledItem': {
            title: 'Manage {item}…',
            note: 'Button that when clicked allows users to add, edit, or delete an item. "Manage" is an imperative verb. "item" is one of "identities", "passwords", "credit cards".'
        },
        'generateDuckAddr': {
            title: 'Generate a Private Duck Address',
            note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address.'
        },
        'blockEmailTrackersAndHideAddress': {
            title: 'Block email trackers & hide address',
            note: 'Label (paired with "blockEmailTrackersAndHideAddress") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
        },
        'protectMyEmail': {
            title: 'Protect My Email',
            note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
        },
        'dontShowAgain': {
            title: "Don't Show Again",
            note: 'Button that prevents the DuckDuckGo email protection signup prompt from appearing again.'
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
        },
        'passwordForUrl': {
            title: 'Pa@assw0rdd ffoör {url}',
            note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
        },
        'generatedPassword': {
            title: 'Gen33ratéééd pa@assw0rdd',
            note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
        },
        'passwordWillBeSaved': {
            title: 'Pa@assw0rdd wi11lll ß3 $avvved for thîï$s website',
            note: 'Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted'
        },
        'bitwardenIsLocked': {
            title: 'Bitwarden iiss löøcçk3d∂',
            note: 'Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked'
        },
        'unlockYourVault': {
            title: 'Unlock yo0ur va@uült to acceé$$s crédeññtïåååls or gééneraåte pass55wººrds5',
            note: 'Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords'
        },
        'generatePrivateDuckAddr': {
            title: 'Geññëérååte Priiivate Duck Addddrrreess',
            note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form.'
        },
        'hideEmailAndBlockTrackers': {
            title: 'Hîïíde yo0øur ££m@il an∂∂∂ bllºck tr@cçck3rs',
            note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
        },
        'createUniqueRandomAddr': {
            title: 'ÇÇr3£ate @ üûún11que, r@@nd0øm ad∂dr3s5s that als0º r3mov3s hidd££n tr@cker$5$ and forwards em@@1l to your 1ñb0x.',
            note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
        },
        'manageFilledItem': {
            title: 'Måññág9gé {item}…',
            note: 'Button that when clicked allows users to add, edit, or delete an item. "Manage" is an imperative verb. "item" is one of "identities", "passwords", "credit cards".'
        },
        'generateDuckAddr': {
            title: 'Géééner@te a Prîîîvate DDDuck Addréés$s',
            note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address.'
        },
        'blockEmailTrackersAndHideAddress': {
            title: 'Bloºøck £mååil tr@åack££rs && hïïïdéé ad∂dr33s5s$',
            note: 'Label (paired with "blockEmailTrackersAndHideAddress") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
        },
        'protectMyEmail': {
            title: 'Prºº††£ct M¥¥ Em@@iîl',
            note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
        },
        'dontShowAgain': {
            title: "Doøºnñ't Sh00w Ag@ååîn",
            note: 'Button that prevents the DuckDuckGo email protection signup prompt from appearing again.'
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
