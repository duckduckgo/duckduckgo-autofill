import { createScanner } from './Scanner.js';

/**
 * Scanner.debug.js
 *
 * Load this script into any HTML to debug Scanning logic
 */

/**
 * Mock just enough of the device interface to prevent errors.
 */
const mockInterface = {
    settings: {
        availableInputTypes: {
            credentials: true,
            identities: true,
        },
        featureToggles: {
            inputType_credentials: true,
            inputType_identities: true,
            inputType_creditCards: true
        },
        populateDataIfNeeded: () => {
            // console.log('populateDataIfNeeded');
        },
        canAutofillType: () => {
            return true
        }
    },
    globalConfig: {
        isDDGApp: true,
    },
    getLocalIdentities() {
        return [];
    },
    isDeviceSignedIn() {
        return false;
    },
    attachTooltip(...args) {
        console.log('device.attachTooltip', args)
    },
    isTooltipActive: () => {
        return false
    },
    get scanner () {
        return state.scanner
    }
}

let state = {
    /** @type {import('./Scanner.js').Scanner | undefined} */
    scanner: undefined,
    /** @type {HTMLSelectElement|null} */
    list: document.querySelector('select[name="html-list"]')
}

const url = new URL(window.location.href)
const initial = url.searchParams.get('form')
const log = url.searchParams.has('log')

if (log) {
    sessionStorage.setItem('ddg-autofill-debug', 'true')
    sessionStorage.setItem('ddg-autofill-perf', 'true')
} else {
    sessionStorage.setItem('ddg-autofill-debug', 'false')
    sessionStorage.setItem('ddg-autofill-perf', 'false')
}

loadList()
    .then(() => {
        if (initial) {
            loadNewForm(initial).catch(console.error)
        }
    })

async function loadList () {
    const url = new URL(`/test-forms/index.json`, window.location.href)
    fetch(url)
        .then(response => response.json())
        .then(testForms => {
            testForms.forEach(item => {
                const option = document.createElement('option')
                option.value = item.html
                option.textContent = item.html
                state.list?.appendChild(option)
            })
        })
}
async function loadNewForm (filename) {
    const url = new URL(`/test-forms/${filename}`, window.location.href)
    fetch(url)
        .then(response => response.text())
        .then(html => {
            let mainElement = document.querySelector('main')
            if (mainElement) {
                mainElement.innerHTML = html
                if (state.list) {
                    state.list.value = filename
                }
                state.scanner = createScanner(/** @type {any} */(mockInterface), {
                    initialDelay: 1 // allow debugging directly on macOS - if this was 0 then it would try to use requestIdleCallback, which is absent in WebKit
                })
                state.scanner?.init()
            } else {
                console.log("'main' element not found on the page.")
            }
        })
        .catch(error => {
            console.error('Error:', error)
        })
}

document.querySelector('select[name="html-list"]')?.addEventListener('change', (e) => {
    const elem = /** @type {HTMLSelectElement} */(e.target)
    const next = new URL(window.location.href)
    next.searchParams.set('form', elem.value)
    window.location.href = next.href
});
