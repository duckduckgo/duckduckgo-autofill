/* global ddgAutofill */
/**
 * NOTE 1: This file does not get processed by the bundler
 * NOTE 2: the global `ddgAutofill` is provided by the bundler
 */
if (window.location.protocol === 'about:' && window.location.pathname === 'blank') {
    const AUTOFILL_ELEMENTS = 'form, input, select, textarea, button, [contenteditable]';
    const SKELETON = new Set(['html', 'head', 'body']);
    const SHADOW_HOSTS = new Set([
        'article',
        'aside',
        'blockquote',
        'div',
        'footer',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'header',
        'main',
        'nav',
        'p',
        'section',
        'span',
    ]);
    // Covers shadow DOM forms that querySelector can't see, without walking added subtrees.
    const mightNeedAutofill = (node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return false;
        if (SKELETON.has(node.localName)) return [...node.children].some(mightNeedAutofill);
        return node.localName.includes('-') || SHADOW_HOSTS.has(node.localName) || node.firstElementChild !== null;
    };
    const startWhenNeeded = (mutations = []) => {
        let found = false;
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (mightNeedAutofill(node)) found = true;
            }
        }
        if (!found && !document.querySelector(AUTOFILL_ELEMENTS)) return false;
        observer.disconnect();
        ddgAutofill();
        return true;
    };
    const observer = new MutationObserver(startWhenNeeded);
    if (!startWhenNeeded()) {
        observer.observe(document, { childList: true, subtree: true });
    }
} else {
    ddgAutofill();
}
