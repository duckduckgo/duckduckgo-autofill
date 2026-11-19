const ddgAutofill = () => {
    'use bundle';
};

// Defer autofill in about:blank frames until they get content that might need it.
if (window.location.protocol === 'about:' && window.location.pathname === 'blank') {
    const AUTOFILL_ELEMENTS = 'form, input, select, textarea, button, [contenteditable]';
    const SKELETON = new Set(['html', 'head', 'body']);
    // Covers shadow DOM forms that querySelector can't see, without walking added subtrees.
    const mightNeedAutofill = (node) =>
        node.nodeType === Node.ELEMENT_NODE &&
        !SKELETON.has(node.localName) &&
        (node.localName.includes('-') || node.shadowRoot !== null || node.firstElementChild !== null);
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
