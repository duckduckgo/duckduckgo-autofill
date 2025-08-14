/* eslint-disable prefer-const */
const DDG_DOMAIN_REGEX = /^https:\/\/(([a-z0-9-_]+?)\.)?duckduckgo\.com\/email/;

/**
 * This is a centralised place to contain all string/variable replacements
 *
 * @param {Partial<GlobalConfig>} [overrides]
 * @returns {GlobalConfig}
 */
function createGlobalConfig(overrides) {
    let isApp = false;
    let isTopFrame = false;
    let supportsTopFrame = false;
    // Do not remove -- Apple devices change this when they support modern webkit messaging
    //! INJECT isApp HERE
    //! INJECT isTopFrame HERE
    //! INJECT supportsTopFrame HERE

    let isWindows = false;
    //! INJECT isWindows HERE

    let isDDGTestMode = false;
    //! INJECT isDDGTestMode HERE

    /** @type {import('@duckduckgo/content-scope-scripts/injected/src/utils').RemoteConfig | null} */
    let contentScope = null;
    let userUnprotectedDomains = [];
    /** @type {Record<string, any> | null} */
    let userPreferences = null;
    //! INJECT contentScope HERE
    //! INJECT userUnprotectedDomains HERE
    //! INJECT userPreferences HERE

    /** @type {Record<string, any> | null} */
    let availableInputTypes = null;
    //! INJECT availableInputTypes HERE

    // @ts-ignore
    const isAndroid = userPreferences?.platform.name === 'android';

    // @ts-ignore
    const isIOS = userPreferences?.platform.name === 'ios';

    // @ts-ignore
    const isDDGApp = ['ios', 'android', 'macos', 'windows'].includes(userPreferences?.platform.name) || isWindows;

    // @ts-ignore
    const isMobileApp = ['ios', 'android'].includes(userPreferences?.platform.name);
    const isFirefox = navigator.userAgent.includes('Firefox');
    const isDDGDomain = Boolean(window.location.href.match(DDG_DOMAIN_REGEX));
    const isExtension = false;

    const config = {
        isApp,
        isDDGApp,
        isAndroid,
        isIOS,
        isFirefox,
        isMobileApp,
        isExtension,
        isTopFrame,
        isWindows,
        supportsTopFrame,
        contentScope,
        userUnprotectedDomains,
        userPreferences,
        isDDGTestMode,
        isDDGDomain,
        availableInputTypes,
        ...overrides,
    };

    return config;
}

export { createGlobalConfig, DDG_DOMAIN_REGEX };
