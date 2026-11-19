const ddgAutofill = () => {
    'use bundle';
};

// about:blank frames (including about:blank#x and about:blank?x) usually stay empty, so don't start autofill there
// until the frame gets an element autofill might need, then start it once.
if (window.location.protocol === 'about:' && window.location.pathname === 'blank') {
    const AUTOFILL_ELEMENTS = 'form, input, select, textarea, button, [contenteditable]';
    const SKELETON = new Set(['html', 'head', 'body']);
    // querySelector can't see into shadow roots, so also start for any added element that is a custom element, already
    // hosts a shadow root, or arrived with children (a subtree we don't walk, so assume it might need autofill).
    // Childless elements (pixels, scripts, empty divs) don't start autofill. html/head/body are skipped, as they always
    // have children once a page is written with document.write.
    // Known gap: an empty built-in element that only gets a shadow root after it's added makes no mutation we can see.
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
