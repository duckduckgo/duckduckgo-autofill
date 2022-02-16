(() => {
    try {
        if (!window.isSecureContext) return

        const listenForGlobalFormSubmission = require('./Form/listenForFormSubmission')
        const {isAndroid, isDDGApp, isApp} = require('./autofill-utils')
        const {processConfig} = require('@duckduckgo/content-scope-scripts/src/apple-utils')

        const inject = require('./inject')

        // chrome is only present in desktop browsers
        if (typeof chrome === 'undefined') {
            if (!isAndroid && (isDDGApp || isApp)) {
                // Check config on Apple platforms
                // @ts-ignore - variable populated during injection
                const privacyConfig = processConfig($CONTENT_SCOPE$, $USER_UNPROTECTED_DOMAINS$, $USER_PREFERENCES$)// eslint-disable-line no-undef
                const site = privacyConfig.site
                if (site.isBroken || site.isAllowlisted || !site.enabledFeatures.includes('autofill')) {
                    return
                }
            }

            listenForGlobalFormSubmission()
            inject()
        } else {
            // Check if the site is marked to skip autofill
            chrome.runtime.sendMessage(
                {
                    registeredTempAutofillContentScript: true,
                    documentUrl: window.location.href
                },
                (response) => {
                    if (!response?.site?.brokenFeatures?.includes('autofill')) {
                        inject()
                    }
                }
            )
        }
    } catch (e) {
        console.error(e)
        // Noop, we errored
    }
})()
