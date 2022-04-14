// These are new additions to the API, only available in Chrome: https://web.dev/intersectionobserver-v2/.
interface IntersectionObserverEntry {
    isVisible?: boolean
}

interface IntersectionObserverInit {
    trackVisibility?: boolean
    delay?: number
}

interface Window {
    // Used in the Android app
    EmailInterface: any

    // Used in the Android app
    BrowserAutofill: any

    chrome: {
        webview: {
            postMessage: Window['postMessage'],
            addEventListener: Window['addEventListener'],
            removeEventListener: Window['removeEventListener'],
        }
    }

    // Used in Apple apps
    webkit: any
}
