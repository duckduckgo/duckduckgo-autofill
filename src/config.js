const DDG_DOMAIN_REGEX = new RegExp(/^https:\/\/(([a-z0-9-_]+?)\.)?duckduckgo\.com\/email/)

/**
 * This is a centralised place to contain all string/variable replacements
 *
 * @param {Partial<GlobalConfig>} [overrides]
 * @returns {GlobalConfig}
 */
function createGlobalConfig (overrides) {
    let isApp = false
    let isTopFrame = false
    let supportsTopFrame = false
    // Do not remove -- Apple devices change this when they support modern webkit messaging
    let hasModernWebkitAPI = false
    //! INJECT isApp HERE
    //! INJECT isTopFrame HERE
    //! INJECT supportsTopFrame HERE
    //! INJECT hasModernWebkitAPI HERE

    let isWindows = false
    //! INJECT isWindows HERE

    // This will be used when 'hasModernWebkitAPI' is false
    /** @type {string[]} */
    let webkitMessageHandlerNames = []
    //! INJECT webkitMessageHandlerNames HERE

    let isDDGTestMode = false
    //! INJECT isDDGTestMode HERE

    let contentScope = null
    let userUnprotectedDomains = null
    /** @type {Record<string, any> | null} */
    let userPreferences = null
    //! INJECT contentScope HERE
    //! INJECT userUnprotectedDomains HERE
    //! INJECT userPreferences HERE

    /** @type {Record<string, any> | null} */
    let availableInputTypes = null
    //! INJECT availableInputTypes HERE

    // The native layer will inject a randomised secret here and use it to verify the origin
    let secret = 'PLACEHOLDER_SECRET'

    // @ts-ignore
    const isAndroid = userPreferences?.platform.name === 'android'
    // @ts-ignore
    const isDDGApp = ['ios', 'android', 'macos', 'windows'].includes(userPreferences?.platform.name) || isWindows
    // @ts-ignore
    const isMobileApp = ['ios', 'android'].includes(userPreferences?.platform.name)
    const isFirefox = navigator.userAgent.includes('Firefox')
    const isDDGDomain = Boolean(window.location.href.match(DDG_DOMAIN_REGEX))
    const isExtension = false

    const config = {
        isApp,
        isDDGApp,
        isAndroid,
        isFirefox,
        isMobileApp,
        isExtension,
        isTopFrame,
        isWindows,
        secret,
        supportsTopFrame,
        hasModernWebkitAPI,
        contentScope,
        userUnprotectedDomains,
        userPreferences,
        isDDGTestMode,
        isDDGDomain,
        availableInputTypes,
        webkitMessageHandlerNames,
        ...overrides
    }

    return config
}

export { createGlobalConfig, DDG_DOMAIN_REGEX }
