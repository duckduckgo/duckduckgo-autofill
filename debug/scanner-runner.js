import { createScanner } from '../src/Scanner.js';
import { Settings } from '../src/Settings.js';

console.log(window.location.href)
const url = new URL(window.top?.location.href || window.location.href);
const log = url.searchParams.has('log');

if (log) {
    sessionStorage.setItem('ddg-autofill-debug', 'true');
    sessionStorage.setItem('ddg-autofill-perf', 'true');
} else {
    sessionStorage.setItem('ddg-autofill-debug', 'false');
    sessionStorage.setItem('ddg-autofill-perf', 'false');
}

const globalConfig = {
    isDDGApp: true,
}

const settings = Settings.default(globalConfig, {});

/**
 * Mock just enough of the device interface to prevent errors.
 */
const mockInterface = {
    settings: settings,
    globalConfig: globalConfig,
    getLocalIdentities() {
        return [];
    },
    isDeviceSignedIn() {
        return false;
    },
    attachTooltip(...args) {
        console.log('device.attachTooltip', args);
    },
    isTooltipActive: () => {
        return false;
    },
    credentialsImport: {
        isAvailable: () => false,
    },
    get scanner() {
        return state.scanner;
    },
};

const state = {
    /** @type {import('../src/Scanner.js').Scanner | undefined} */
    scanner: undefined,
};

state.scanner = createScanner(/** @type {any} */ (mockInterface), {
    initialDelay: 1, // allow debugging directly on macOS - if this was 0 then it would try to use requestIdleCallback, which is absent in WebKit
});
state.scanner?.init();

setTimeout(() => {
    // console.log('sent!');
    window.dispatchEvent(new CustomEvent("ddg-scan-complete", { detail: state.scanner }));
    // console.log(state.scanner)
}, 2)
