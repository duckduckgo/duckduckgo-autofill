const DDG_DOMAIN_REGEX = /^https:\/\/(([a-z0-9-_]+?)\.)?duckduckgo\.com\/email/

/**
 * This is a centralised place to contain all string/variable replacements
 *
 * @param {Partial<GlobalConfig>} [overrides]
 * @returns {GlobalConfig}
 */
function createGlobalConfig (overrides) {
    const isApp = false
    const isTopFrame = false
    const supportsTopFrame = false
    // Do not remove -- Apple devices change this when they support modern webkit messaging
    const hasModernWebkitAPI = false
    // INJECT isApp HERE
    // INJECT isTopFrame HERE
    // INJECT supportsTopFrame HERE
    // INJECT hasModernWebkitAPI HERE

    const isWindows = false
    // INJECT isWindows HERE

    // This will be used when 'hasModernWebkitAPI' is false
    /** @type {string[]} */
    const webkitMessageHandlerNames = []
    // INJECT webkitMessageHandlerNames HERE

    const isDDGTestMode = false
    // INJECT isDDGTestMode HERE

    const contentScope = null
    const userUnprotectedDomains = null
    /** @type {Record<string, any> | null} */
    const userPreferences = null
    // INJECT contentScope HERE
    // INJECT userUnprotectedDomains HERE
    // INJECT userPreferences HERE

    /** @type {Record<string, any> | null} */
    const availableInputTypes = null
    // INJECT availableInputTypes HERE

    // The native layer will inject a randomised secret here and use it to verify the origin
    const secret = 'PLACEHOLDER_SECRET'

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
