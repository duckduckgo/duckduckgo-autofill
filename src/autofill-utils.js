import { getInputSubtype, removeExcessWhitespace } from './Form/matching.js';
import { constants } from './constants.js';
import { processConfig } from '@duckduckgo/content-scope-scripts/src/apple-utils';

const SIGN_IN_MSG = { signMeIn: true };

// Send a message to the web app (only on DDG domains)
const notifyWebApp = (message) => {
    window.postMessage(message, window.origin);
};
/**
 * Sends a message and returns a Promise that resolves with the response
 * @param {{} | Function} msgOrFn - a fn to call or an object to send via postMessage
 * @param {String} expectedResponse - the name of the response
 * @returns {Promise<*>}
 */
const sendAndWaitForAnswer = (msgOrFn, expectedResponse) => {
    if (typeof msgOrFn === 'function') {
        msgOrFn();
    } else {
        window.postMessage(msgOrFn, window.origin);
    }

    return new Promise((resolve) => {
        const handler = (e) => {
            if (e.origin !== window.origin) return;
            if (!e.data || (e.data && !(e.data[expectedResponse] || e.data.type === expectedResponse))) return;

            resolve(e.data);
            window.removeEventListener('message', handler);
        };
        window.addEventListener('message', handler);
    });
};

/**
 * @param {Pick<GlobalConfig, 'contentScope' | 'userUnprotectedDomains' | 'userPreferences'>} globalConfig
 * @return {boolean}
 */
const autofillEnabled = (globalConfig) => {
    if (!globalConfig.contentScope) {
        // Return enabled for platforms that haven't implemented the config yet
        return true;
    }
    // already processed? this handles an edgecase in the extension where the config is already processed
    if ('site' in globalConfig.contentScope) {
        const enabled = isAutofillEnabledFromProcessedConfig(globalConfig.contentScope);
        return enabled;
    }

    const { contentScope, userUnprotectedDomains, userPreferences } = globalConfig;

    // Check config on Apple platforms
    const processedConfig = processConfig(contentScope, userUnprotectedDomains, userPreferences);
    return isAutofillEnabledFromProcessedConfig(processedConfig);
};

const isAutofillEnabledFromProcessedConfig = (processedConfig) => {
    const site = processedConfig.site;
    if (site.isBroken || !site.enabledFeatures.includes('autofill')) {
        if (shouldLog()) {
            console.log('⚠️ Autofill disabled by remote config');
        }
        return false;
    }

    return true;
};

const isIncontextSignupEnabledFromProcessedConfig = (processedConfig) => {
    const site = processedConfig.site;
    if (site.isBroken || !site.enabledFeatures.includes('incontextSignup')) {
        if (shouldLog()) {
            console.log('⚠️ In-context signup disabled by remote config');
        }
        return false;
    }

    return true;
};

// Access the original setter (needed to bypass React's implementation on mobile)
// @ts-ignore
const originalSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

/**
 * Ensures the value is set properly and dispatches events to simulate real user action
 * @param {HTMLInputElement} el
 * @param {string} val
 * @param {GlobalConfig} [config]
 * @return {boolean}
 */
const setValueForInput = (el, val, config) => {
    // Avoid keyboard flashing on Android
    if (!config?.isAndroid) {
        el.focus();
    }

    // todo(Shane): Not sending a 'key' property on these events can cause exceptions on 3rd party listeners that expect it
    el.dispatchEvent(new Event('keydown', { bubbles: true }));

    originalSet?.call(el, val);

    const events = [
        new Event('input', { bubbles: true }),
        // todo(Shane): Not sending a 'key' property on these events can cause exceptions on 3rd party listeners that expect it
        new Event('keyup', { bubbles: true }),
        new Event('change', { bubbles: true }),
    ];
    events.forEach((ev) => el.dispatchEvent(ev));
    // We call this again to make sure all forms are happy
    originalSet?.call(el, val);
    events.forEach((ev) => el.dispatchEvent(ev));
    el.blur();

    return true;
};

/**
 * Fires events on a select element to simulate user interaction
 * @param {HTMLSelectElement} el
 */
const fireEventsOnSelect = (el) => {
    /** @type {Event[]} */
    const events = [
        new Event('mousedown', { bubbles: true }),
        new Event('mouseup', { bubbles: true }),
        new Event('click', { bubbles: true }),
        new Event('change', { bubbles: true }),
    ];

    // Events fire on the select el, not option
    events.forEach((ev) => el.dispatchEvent(ev));
    events.forEach((ev) => el.dispatchEvent(ev));
    el.blur();
};

/**
 * Selects an option of a select element
 * We assume Select is only used for dates, i.e. in the credit card
 * @param {HTMLSelectElement} el
 * @param {string} val
 * @return {boolean}
 */
const setValueForSelect = (el, val) => {
    const subtype = getInputSubtype(el);
    const isMonth = subtype.includes('Month');
    const isZeroBasedNumber = isMonth && el.options[0].value === '0' && el.options.length === 12;
    const stringVal = String(val);
    const numberVal = Number(val);

    // Loop first through all values because they tend to be more precise
    for (const option of el.options) {
        // If values for months are zero-based (Jan === 0), add one to match our data type
        let value = option.value;
        if (isZeroBasedNumber) {
            value = `${Number(value) + 1}`;
        }
        // TODO: try to match localised month names
        // TODO: implement alternative versions of values (abbreviations for States/Provinces or variations like USA, US, United States, etc.)
        if (value === stringVal || Number(value) === numberVal) {
            if (option.selected) return false;
            option.selected = true;
            fireEventsOnSelect(el);
            return true;
        }
    }

    for (const option of el.options) {
        if (option.innerText === stringVal || Number(option.innerText) === numberVal) {
            if (option.selected) return false;
            option.selected = true;
            fireEventsOnSelect(el);
            return true;
        }
    }
    // If we didn't find a matching option return false
    return false;
};

/**
 * Sets or selects a value to a form element
 * @param {HTMLInputElement | HTMLSelectElement} el
 * @param {string} val
 * @param {GlobalConfig} [config]
 * @return {boolean}
 */
const setValue = (el, val, config) => {
    if (el instanceof HTMLInputElement) return setValueForInput(el, val, config);
    if (el instanceof HTMLSelectElement) return setValueForSelect(el, val);

    return false;
};

/**
 * Use IntersectionObserver v2 to make sure the element is visible when clicked
 * https://developers.google.com/web/updates/2019/02/intersectionobserver-v2
 */
const safeExecute = (el, fn, _opts = {}) => {
    // TODO: temporary fix to misterious bug in Chrome
    // const {checkVisibility = true} = opts
    const intObs = new IntersectionObserver(
        (changes) => {
            for (const change of changes) {
                // Feature detection
                if (typeof change.isVisible === 'undefined') {
                    // The browser doesn't support Intersection Observer v2, falling back to v1 behavior.
                    change.isVisible = true;
                }
                if (change.isIntersecting) {
                    /**
                     * If 'checkVisibility' is 'false' (like on Windows), then we always execute the function
                     * During testing it was found that windows does not `change.isVisible` properly.
                     */
                    // TODO: temporary fix to misterious bug in Chrome
                    // if (!checkVisibility || change.isVisible) {
                    //     fn()
                    // }
                    fn();
                }
            }
            intObs.disconnect();
        },
        { trackVisibility: true, delay: 100 },
    );
    intObs.observe(el);
};

/**
 * Checks that an element is potentially viewable (even if off-screen)
 * @param {HTMLElement} el
 * @return {boolean}
 */
const isPotentiallyViewable = (el) => {
    const computedStyle = window.getComputedStyle(el);
    const opacity = parseFloat(computedStyle.getPropertyValue('opacity') || '1');
    const visibility = computedStyle.getPropertyValue('visibility');
    const opacityThreshold = 0.6;

    return el.clientWidth !== 0 && el.clientHeight !== 0 && opacity > opacityThreshold && visibility !== 'hidden';
};

/**
 * Gets the bounding box of the icon
 * @param {HTMLInputElement} input
 * @returns {{top: number, left: number, bottom: number, width: number, x: number, y: number, right: number, height: number}}
 */
const getDaxBoundingBox = (input) => {
    const { right: inputRight, top: inputTop, height: inputHeight } = input.getBoundingClientRect();
    const inputRightPadding = parseInt(getComputedStyle(input).paddingRight);
    const width = 30;
    const height = 30;
    const top = inputTop + (inputHeight - height) / 2;
    const right = inputRight - inputRightPadding;
    const left = right - width;
    const bottom = top + height;

    return { bottom, height, left, right, top, width, x: left, y: top };
};

/**
 * Check if a mouse event is within the icon
 * @param {MouseEvent} e
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
const isEventWithinDax = (e, input) => {
    const { left, right, top, bottom } = getDaxBoundingBox(input);
    const withinX = e.clientX >= left && e.clientX <= right;
    const withinY = e.clientY >= top && e.clientY <= bottom;

    return withinX && withinY;
};

/**
 * Adds inline styles from a prop:value object
 * @param {HTMLElement} el
 * @param {Object<string, string>} styles
 */
const addInlineStyles = (el, styles) =>
    Object.entries(styles).forEach(([property, val]) => el.style.setProperty(property, val, 'important'));

/**
 * Removes inline styles from a prop:value object
 * @param {HTMLElement} el
 * @param {Object<string, string>} styles
 */
const removeInlineStyles = (el, styles) => Object.keys(styles).forEach((property) => el.style.removeProperty(property));

const ADDRESS_DOMAIN = '@duck.com';
/**
 * Given a username, returns the full email address
 * @param {string} address
 * @returns {string}
 */
const formatDuckAddress = (address) => address + ADDRESS_DOMAIN;

/**
 * Escapes any occurrences of &, ", <, > or / with XML entities.
 * @param {string} str The string to escape.
 * @return {string} The escaped string.
 */
function escapeXML(str) {
    const replacements = { '&': '&amp;', '"': '&quot;', "'": '&apos;', '<': '&lt;', '>': '&gt;', '/': '&#x2F;' };
    return String(str).replace(/[&"'<>/]/g, (m) => replacements[m]);
}

/**
 * Determines if an element is likely to be a submit button
 * @param {HTMLElement} el A button, input, anchor or other element with role=button
 * @param {import("./Form/matching").Matching} matching
 * @return {boolean}
 */
const isLikelyASubmitButton = (el, matching) => {
    const text = getTextShallow(el);
    const ariaLabel = el.getAttribute('aria-label') || '';
    const dataTestId = el.getAttribute('data-test-id') || '';

    if (
        (el.getAttribute('type') === 'submit' || // is explicitly set as "submit"
            el.getAttribute('name') === 'submit') && // is called "submit"
        !safeRegexTest(matching.getDDGMatcherRegex('submitButtonUnlikelyRegex'), text + ' ' + ariaLabel)
    )
        return true;

    return (
        (safeRegexTest(/primary|submit/i, el.className) || // has high-signal submit classes
            safeRegexTest(/submit/i, dataTestId) ||
            safeRegexTest(matching.getDDGMatcherRegex('submitButtonRegex'), text) || // has high-signal text
            (el.offsetHeight * el.offsetWidth >= 10000 && !safeRegexTest(/secondary/i, el.className))) && // it's a large element 250x40px
        el.offsetHeight * el.offsetWidth >= 2000 && // it's not a very small button like inline links and such
        !safeRegexTest(matching.getDDGMatcherRegex('submitButtonUnlikelyRegex'), text + ' ' + ariaLabel)
    );
};

/**
 * Check that a button matches the form type - login buttons on a login form, signup buttons on a signup form
 * @param {HTMLElement} el
 * @param {import('./Form/Form').Form} formObj
 */
const buttonMatchesFormType = (el, formObj) => {
    if (formObj.isLogin) {
        return !safeRegexTest(/sign.?up|register|join/i, el.textContent || '');
    } else if (formObj.isSignup) {
        return !safeRegexTest(/(log|sign).?([io])n/i, el.textContent || '');
    } else {
        return true;
    }
};

const buttonInputTypes = ['submit', 'button'];
/**
 * Get the text of an element, one level deep max
 * @param {Node} el
 * @returns {string}
 */
const getTextShallow = (el) => {
    // for buttons, we don't care about descendants, just get the whole text as is
    // this is important in order to give proper attribution of the text to the button
    if (el instanceof HTMLButtonElement) return removeExcessWhitespace(el.textContent);

    if (el instanceof HTMLInputElement) {
        if (buttonInputTypes.includes(el.type)) {
            return el.value;
        }

        if (el.type === 'image') {
            return removeExcessWhitespace(el.alt || el.value || el.title || el.name);
        }
    }

    let text = '';
    for (const childNode of el.childNodes) {
        if (childNode instanceof Text) {
            text += ' ' + childNode.textContent;
        }
    }

    return removeExcessWhitespace(text);
};

/**
 * Check if hostname is a local address
 * @param {string} [hostname]
 * @returns {boolean}
 */
function isLocalNetwork(hostname = window.location.hostname) {
    return (
        ['localhost', '', '::1'].includes(hostname) ||
        hostname.includes('127.0.0.1') ||
        hostname.includes('192.168.') ||
        hostname.startsWith('10.0.') ||
        hostname.endsWith('.local') ||
        hostname.endsWith('.internal')
    );
}

// Extracted from lib/DDG/Util/Constants.pm
const tldrs =
    /\.(?:c(?:o(?:m|op)?|at?|[iykgdmnxruhcfzvl])|o(?:rg|m)|n(?:et?|a(?:me)?|[ucgozrfpil])|e(?:d?u|[gechstr])|i(?:n(?:t|fo)?|[stqldroem])|m(?:o(?:bi)?|u(?:seum)?|i?l|[mcyvtsqhaerngxzfpwkd])|g(?:ov|[glqeriabtshdfmuywnp])|b(?:iz?|[drovfhtaywmzjsgbenl])|t(?:r(?:avel)?|[ncmfzdvkopthjwg]|e?l)|k[iemygznhwrp]|s[jtvberindlucygkhaozm]|u[gymszka]|h[nmutkr]|r[owesu]|d[kmzoej]|a(?:e(?:ro)?|r(?:pa)?|[qofiumsgzlwcnxdt])|p(?:ro?|[sgnthfymakwle])|v[aegiucn]|l[sayuvikcbrt]|j(?:o(?:bs)?|[mep])|w[fs]|z[amw]|f[rijkom]|y[eut]|qa)$/i;
/**
 * Check if hostname is a valid top-level domain
 * @param {string} [hostname]
 * @returns {boolean}
 */
function isValidTLD(hostname = window.location.hostname) {
    return tldrs.test(hostname) || hostname === 'fill.dev';
}

/**
 * Chrome's UA adds styles using this selector when using the built-in autofill
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
const wasAutofilledByChrome = (input) => {
    try {
        // Other browsers throw because the selector is invalid
        return input.matches('input:-internal-autofill-selected');
    } catch (e) {
        return false;
    }
};

/**
 * Checks if we should log form analysis debug info to the console
 * @returns {boolean}
 */
function shouldLog() {
    return readDebugSetting('ddg-autofill-debug');
}

/**
 * Checks if we should log performance info to the console
 * @returns {boolean}
 */
function shouldLogPerformance() {
    return readDebugSetting('ddg-autofill-perf');
}

/**
 * Check if a sessionStorage item is set to 'true'
 * @param setting
 * @returns {boolean}
 */
function readDebugSetting(setting) {
    // sessionStorage throws in invalid schemes like data: and file:
    try {
        return window.sessionStorage?.getItem(setting) === 'true';
    } catch (e) {
        return false;
    }
}

function logPerformance(markName) {
    if (shouldLogPerformance()) {
        const measurement = window.performance?.measure(`${markName}:init`, `${markName}:init:start`, `${markName}:init:end`);
        console.log(`${markName} took ${Math.round(measurement?.duration)}ms`);
        window.performance?.clearMarks();
    }
}

/**
 *
 * @param {Function} callback
 * @returns {Function}
 */
function whenIdle(callback) {
    let timer;
    return (...args) => {
        cancelIdleCallback(timer);
        timer = requestIdleCallback(() => callback.apply(this, args));
    };
}

/**
 * Truncate string from the middle if exceeds the totalLength (default: 30)
 * @param {string} string
 * @param {number} totalLength
 * @returns {string}
 */
function truncateFromMiddle(string, totalLength = 30) {
    if (totalLength < 4) {
        throw new Error('Do not use with strings shorter than 4');
    }

    if (string.length <= totalLength) return string;

    const truncated = string.slice(0, totalLength / 2).concat('…', string.slice(totalLength / -2));
    return truncated;
}

/**
 * Determines if the form is likely to be enclosing most of the DOM
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
function isFormLikelyToBeUsedAsPageWrapper(form) {
    if (form.parentElement !== document.body) return false;

    const formChildren = form.querySelectorAll('*').length;
    // If the form has few content elements, it's unlikely to cause issues anyway
    if (formChildren < 100) return false;

    const bodyChildren = document.body.querySelectorAll('*').length;

    /**
     * Percentage of the formChildren on the total body elements
     * form * 100 / body = x
     */
    const formChildrenPercentage = (formChildren * 100) / bodyChildren;

    return formChildrenPercentage > 50;
}

/**
 * Wrapper around RegExp.test that safeguard against checking huge strings
 * @param {RegExp | undefined} regex
 * @param {String} string
 * @returns {boolean}
 */
function safeRegexTest(regex, string) {
    if (!string || !regex || string.length > constants.TEXT_LENGTH_CUTOFF) return false;

    return regex.test(string);
}

/**
 * Returns the event target, or an element that matches wantedTargetType, piercing the shadow tree
 * @param {PointerEvent | FocusEvent} event
 * @param {typeof Element} [wantedTargetType]
 * @returns {EventTarget | null}
 */
function pierceShadowTree(event, wantedTargetType) {
    const { target } = event;

    // Sanity checks
    if (!(target instanceof Element) || !target?.shadowRoot || !event.composedPath) return target;

    const clickStack = event.composedPath();

    // If we're not looking for a specific element, get the top of the stack
    if (!wantedTargetType) {
        return clickStack[0];
    }

    // Otherwise, search the wanted target, or return the original target
    return clickStack.find((el) => el instanceof wantedTargetType) || target;
}

/**
 * Return the active element, piercing through shadow DOMs, or null
 * @param {Document | DocumentOrShadowRoot} root
 * @returns {Element | null}
 */
function getActiveElement(root = document) {
    const activeElement = root.activeElement;

    if (!(activeElement instanceof Element) || !activeElement.shadowRoot) return activeElement;

    const innerActiveElement = activeElement.shadowRoot.activeElement;

    if (innerActiveElement?.shadowRoot) {
        return getActiveElement(innerActiveElement.shadowRoot);
    }

    return innerActiveElement;
}

/**
 * Takes a root element and tries to find visible elements first, and if it fails, it tries to find shadow elements
 * @param {HTMLElement|HTMLFormElement} root
 * @param {string} selector
 * @returns {Element[]}
 */
function findEnclosedShadowElements(root, selector) {
    // Check if there are any shadow elements that match the selector
    const shadowElements = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);

    let node = walker.nextNode();
    while (node) {
        if (node instanceof HTMLElement && node.shadowRoot) {
            shadowElements.push(...node.shadowRoot.querySelectorAll(selector));
        }
        node = walker.nextNode();
    }

    return shadowElements;
}

export {
    notifyWebApp,
    sendAndWaitForAnswer,
    isAutofillEnabledFromProcessedConfig,
    isIncontextSignupEnabledFromProcessedConfig,
    autofillEnabled,
    setValue,
    safeExecute,
    isPotentiallyViewable,
    getDaxBoundingBox,
    isEventWithinDax,
    addInlineStyles,
    removeInlineStyles,
    SIGN_IN_MSG,
    ADDRESS_DOMAIN,
    formatDuckAddress,
    escapeXML,
    isLikelyASubmitButton,
    buttonMatchesFormType,
    getTextShallow,
    isLocalNetwork,
    isValidTLD,
    wasAutofilledByChrome,
    shouldLog,
    shouldLogPerformance,
    logPerformance,
    whenIdle,
    truncateFromMiddle,
    isFormLikelyToBeUsedAsPageWrapper,
    safeRegexTest,
    pierceShadowTree,
    getActiveElement,
    findEnclosedShadowElements,
};
