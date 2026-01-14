// Polyfills/shims
import './requestIdleCallback.js';
import { createDevice } from './DeviceInterface.js';
import { shouldLog } from './autofill-utils.js';

// Import desktop CSS (includes design tokens) and make it available globally
// This CSS is used by macOS/Windows overlay interfaces
import { CSS_STYLES as CSS_STYLES_DESKTOP } from './UI/HTMLTooltipDesktop.js';

// Make desktop CSS available globally for overlay interfaces
// @ts-ignore
window.__ddg_autofill_desktop_css__ = CSS_STYLES_DESKTOP;

(() => {
    if (shouldLog()) {
        console.log('DuckDuckGo Autofill Active (Desktop)');
    }

    if (!window.isSecureContext) return false;

    try {
        const startupAutofill = () => {
            if (document.visibilityState === 'visible') {
                const deviceInterface = createDevice();
                deviceInterface.init();
            } else {
                document.addEventListener('visibilitychange', startupAutofill, { once: true });
            }
        };
        startupAutofill();
    } catch (e) {
        console.error(e);
    }
})();
