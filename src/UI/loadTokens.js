/**
 * Dynamically loads design tokens CSS into the document.
 * Only needed for overlay platforms (macOS/Windows) that use theming.
 *
 * @returns {Promise<void>} Resolves when tokens are loaded
 */
export function loadDesignTokens() {
    return new Promise((resolve) => {
        // Check if already loaded
        if (document.querySelector('link[data-tokens="design-tokens"]')) {
            resolve();
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'tokens.css'; // Relative to TopAutofill.html in dist/
        link.dataset.tokens = 'design-tokens';

        link.onload = () => {
            console.log('[Autofill] Design tokens loaded');
            resolve();
        };

        link.onerror = () => {
            console.error('[Autofill] Failed to load design tokens');
            // Resolve anyway - theming will fall back to defaults
            resolve();
        };

        document.head.appendChild(link);
    });
}

/**
 * Alternative: Inline tokens as a style element (if link approach has issues)
 * This requires tokens to be available as a string at runtime.
 *
 * @param {string} tokensCSS - The tokens CSS content
 */
export function injectDesignTokens(tokensCSS) {
    if (document.querySelector('style[data-tokens="design-tokens"]')) {
        return;
    }

    const style = document.createElement('style');
    style.dataset.tokens = 'design-tokens';
    style.textContent = tokensCSS;
    document.head.appendChild(style);
}
