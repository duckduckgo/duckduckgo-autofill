const ddgAutofill = () => {
    'use bundle';
};

// about:blank frames (including about:blank#x and about:blank?x) usually stay empty, so don't start autofill there
// until the frame gets an element autofill might need, then start it once.
if (window.location.protocol === 'about:' && window.location.pathname === 'blank') {
    const AUTOFILL_ELEMENTS = 'form, input, select, textarea, button, [contenteditable]';
    const startWhenNeeded = (mutations = []) => {
        // A custom element (its name always has a dash) may hold a form in its shadow root, where querySelector can't
        // see it, so start autofill as soon as one is added, as production autofill would already be running there.
        let addedCustomElement = false;
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE && node.localName.includes('-')) addedCustomElement = true;
            }
        }
        if (!addedCustomElement && !document.querySelector(AUTOFILL_ELEMENTS)) return false;
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
