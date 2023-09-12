Object.assign(global, require('jest-chrome'))
// Mocks chrome API calls needed for autofill to run successfully
// @ts-ignore
chrome.runtime.sendMessage.mockImplementation(
    (message, callback) => {
        let response = {}
        if (message.getAddresses) {
            response = {
                privateAddress: '123test321',
                personalAddress: 'test'
            }
        }
        callback(response)
    }
)

// The autofill script bails if context is insecure, this enables tests to run
global.isSecureContext = true

const crypto = require('crypto')

Object.defineProperty(global.self, 'crypto', {
    value: {
        ...global.self.crypto,
        // @ts-ignore TS doesn't know of `crypto.webcrypto.subtle`
        subtle: crypto.webcrypto.subtle,
        getRandomValues: arr => crypto.randomFillSync(arr)
    }
})

/**
 * Utility function that mocks the `IntersectionObserver` API. Necessary for components that rely
 * on it, otherwise the tests will crash. Recommended to execute inside `beforeEach`.
 * @param intersectionObserverMock - Parameter that is sent to the `Object.defineProperty`
 * overwrite method. `jest.fn()` mock functions can be passed here if the goal is to not only
 * mock the intersection observer, but its methods.
 * @source https://javascript.tutorialink.com/js-testing-code-that-uses-an-intersectionobserver/
 */
function setupIntersectionObserverMock ({
    root = null,
    rootMargin = '',
    thresholds = [],
    disconnect = () => null,
    observe = () => null,
    takeRecords = () => [],
    unobserve = () => null
} = {}) {
    class MockIntersectionObserver {
        constructor () {
            this.root = root
            this.rootMargin = rootMargin
            this.thresholds = thresholds
            this.disconnect = disconnect
            this.observe = observe
            this.takeRecords = takeRecords
            this.unobserve = unobserve
        }
    }

    Object.defineProperty(window, 'IntersectionObserver', {
        writable: true,
        configurable: true,
        value: MockIntersectionObserver
    })

    Object.defineProperty(global, 'IntersectionObserver', {
        writable: true,
        configurable: true,
        value: MockIntersectionObserver
    })
}
setupIntersectionObserverMock()

/**
 *  Enable the use of clientWidth, clientHeight, offsetWidth and offsetHeight on html elements
 *  @source https://github.com/jsdom/jsdom/issues/2342#issuecomment-468253441 (adapted)
 **/
// Enables setting clientWidth by the data-mock-clientWidth attribute or the property _jsdomMockClientWidth
Object.defineProperty(window.HTMLElement.prototype, 'clientWidth', {
    get: function () {
        const mockClientWidthAttribute = this.getAttribute('data-mock-clientWidth')
        if (mockClientWidthAttribute) return mockClientWidthAttribute

        return this._jsdomMockClientWidth || 0
    }
})
// Enables setting clientHeight by the data-mock-clientHeight attribute or the property _jsdomMockClientHeight
Object.defineProperty(window.HTMLElement.prototype, 'clientHeight', {
    get: function () {
        const mockClientHeightAttribute = this.getAttribute('data-mock-clientHeight')
        if (mockClientHeightAttribute) return mockClientHeightAttribute

        return this._jsdomMockClientHeight || 0
    }
})
// Enables setting offsetWidth by the data-mock-offsetWidth attribute or the property _jsdomMockOffsetWidth
Object.defineProperty(window.HTMLElement.prototype, 'offsetWidth', {
    get: function () {
        const mockOffsetWidthAttribute = this.getAttribute('data-mock-offsetWidth')
        if (mockOffsetWidthAttribute) return mockOffsetWidthAttribute

        return this._jsdomMockOffsetWidth || 0
    }
})
// Enables setting offsetHeight by the data-mock-offsetHeight attribute or the property _jsdomMockOffsetHeight
Object.defineProperty(window.HTMLElement.prototype, 'offsetHeight', {
    get: function () {
        const mockOffsetHeightAttribute = this.getAttribute('data-mock-offsetHeight')
        if (mockOffsetHeightAttribute) return mockOffsetHeightAttribute

        return this._jsdomMockOffsetHeight || 0
    }
})

// getComputedStyle is super slow on jsdom, by providing this mock we speed tests up significantly
const defaultStyle = {
    display: 'block',
    visibility: 'visible',
    opacity: '1',
    paddingRight: '10'
}
const mockGetComputedStyle = (el) => {
    return {
        // since we don't load stylesheets in the tests, the style prop is all the css applied, so it's a safe fallback
        getPropertyValue: (prop) => el.style?.[prop] || defaultStyle[prop]
    }
}
// @ts-ignore
jest.spyOn(window, 'getComputedStyle').mockImplementation(mockGetComputedStyle)
