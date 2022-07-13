// These are new additions to the API, only available in Chrome: https://web.dev/intersectionobserver-v2/.
interface IntersectionObserverEntry {
    isVisible?: boolean
}

interface IntersectionObserverInit {
    trackVisibility?: boolean
    delay?: number
}

interface WindowsMessageFormat {
    Feature: "Autofill"
    Name: string
    Data: any
}

interface WindowsResponseFormat {
    type: string
    [index: string]: any
}

declare const windowsInteropPostMessage: (message: WindowsMessageFormat|WindowsResponseFormat, origin?: string) => void;
declare const windowsInteropAddEventListener: Window['addEventListener'];
declare const windowsInteropRemoveEventListener: Window['removeEventListener'];

interface Window {

    // Used in the Android app
    EmailInterface: {
        isSignedIn(): string
        getUserData(): string
        storeCredentials(token: string, username: string, cohort: string): string
        showTooltip()
        getDeviceCapabilities(): string
        removeCredentials()
    }

    // Used in the Android app
    BrowserAutofill: {
        getAutofillData(data: string): void;
        storeFormData(data: string): void;
    }

    // Used in Apple apps
    webkit: {
        messageHandlers: Record<string, {
            postMessage(data: any): Promise<any>
        }>
    }

    chrome: {
        webview: {
            postMessage: (message: WindowsMessageFormat|WindowsResponseFormat, origin?: string) => void,
            addEventListener: Window['addEventListener'],
            removeEventListener: Window['removeEventListener'],
        }
    }

    __playwright: {
        mocks: {
            calls: MockCall[]
        }
    }

    /**
     * This adds type support for the custom message that native sides may
     * send to indicate where a mouseMove event occurred
     */
    addEventListener(type: "mouseMove", listener: (this: Document, ev: CustomEvent<{x: number, y: number}>) => void): void;
}
