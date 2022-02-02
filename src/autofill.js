(() => {
    try {
        if (!window.isSecureContext) return

        const listenForGlobalFormSubmission = require('./Form/listenForFormSubmission')
        const {forms} = require('./scanForInputs')
        const {isApp, isAndroid} = require('./autofill-utils')
        const {processConfig} = require('@duckduckgo/content-scope-scripts/src/apple-utils')

        if (!isAndroid) {
            // eslint-disable-next-line no-undef
            const privacyConfig = processConfig($CONTENT_SCOPE$, $USER_UNPROTECTED_DOMAINS$, $USER_PREFERENCES$)
            const site = privacyConfig.site
            if (site.isBroken || site.isAllowlisted || !site.enabledFeatures.includes('autofill')) {
                return
            }
        }

        const inject = () => {
            // Polyfills/shims
            require('./requestIdleCallback')
            const DeviceInterface = require('./DeviceInterface')

            // Global listener for event delegation
            window.addEventListener('pointerdown', (e) => {
                if (!e.isTrusted) return

                if (e.target.nodeName === 'DDG-AUTOFILL') {
                    e.preventDefault()
                    e.stopImmediatePropagation()

                    const activeForm = [...forms.values()].find((form) => form.tooltip)
                    if (activeForm) {
                        activeForm.tooltip.dispatchClick()
                    }
                }

                if (!isApp) return

                // Check for clicks on submit buttons
                const matchingForm = [...forms.values()].find(
                    (form) => {
                        const btns = [...form.submitButtons]
                        if (btns.includes(e.target)) return true

                        if (btns.find((btn) => btn.contains(e.target))) return true
                    }
                )
                matchingForm?.submitHandler()
            }, true)

            if (isApp) {
                window.addEventListener('submit', (e) =>
                    forms.get(e.target)?.submitHandler(),
                true)
            }

            DeviceInterface.init()
        }

        // chrome is only present in desktop browsers
        if (typeof chrome === 'undefined') {
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
        // Noop, we errored
    }
})()
