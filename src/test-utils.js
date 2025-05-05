import { readFileSync } from 'fs';
import SiteSpecificFeature from './site-specific-feature.js';
import path from 'path';
import { processConfig } from '@duckduckgo/content-scope-scripts/injected/src/utils';

/**
 * Creates a given or generic form element, overwrites the DOM with it and returns it
 * You can also pass a div or other as the container, but it must have id=form
 * @param {string} [form] - HTML string of a form element
 */
const attachAndReturnGenericForm = (form) => {
    if (form) {
        document.body.innerHTML = `<div>${form}</div>`;
    } else {
        document.body.innerHTML = `
<div>
    <form>
        <input type="text" value="testUsername" autocomplete="username" />
        <input type="password" value="testPassword" autocomplete="new-password" />
        <button type="submit">Sign up</button>
    </form>
</div>`;
    }
    const formEl = /** @type {HTMLElement} */ (document.querySelector('form, #form'));
    if (!formEl) throw new Error('unreachable');

    const buttons = formEl.querySelectorAll('button, [role=button]');
    buttons.forEach((button) => {
        // We're doing this so that isPotentiallyViewable(button) === true. See jest.setup.js for more info
        // @ts-ignore
        button._jsdomMockClientWidth = 150;
        // @ts-ignore
        button._jsdomMockClientHeight = 50;
        // @ts-ignore
        button._jsdomMockOffsetWidth = 150;
        // @ts-ignore
        button._jsdomMockOffsetHeight = 50;
    });

    return formEl;
};

const attachAndReturnGenericLoginForm = () => {
    const loginForm = `
<form>
    <input type="text" value="testUsername" autocomplete="username" />
    <input type="password" value="testPassword" autocomplete="current-password" />
    <button type="submit">Login</button>
</form>`;
    return attachAndReturnGenericForm(loginForm);
};
/**
 * Creates mock SiteSpecificFixes class in the device interface, based on test config
 * @param {import("./DeviceInterface/InterfacePrototype").default} deviceInterface
 * @param {string} file
 */
const setMockSiteSpecificFixes = (deviceInterface, file) => {
    /** @type {import("./Settings").RuntimeConfiguration} */
    const mockRuntimeConfig = {
        contentScope: {
            features: {
                autofill: {
                    state: 'enabled',
                    features: JSON.parse(readFileSync(path.join(__dirname, `testConfig/siteSpecificFixes/${file}.json`)).toString('utf-8')),
                },
            },
        },
        userUnprotectedDomains: [],
        userPreferences: {
            sessionKey: 'test',
            debug: false,
            platform: {
                name: 'macos',
            },
            features: {},
        },
    };
    deviceInterface.settings.setTopLevelFeatureInContentScopeIfNeeded(mockRuntimeConfig, 'siteSpecificFixes');
    const { contentScope, userPreferences, userUnprotectedDomains } = mockRuntimeConfig;
    // @ts-expect-error - inconsitent types between C-S-S and autofill
    const args = processConfig(contentScope, userUnprotectedDomains, userPreferences);
    deviceInterface.settings.setsiteSpecificFeature(new SiteSpecificFeature(args));
};

export { attachAndReturnGenericForm, attachAndReturnGenericLoginForm, setMockSiteSpecificFixes };
