import HTMLTooltip from './HTMLTooltip.js';

/**
 * TOTP HTML Tooltip class for displaying time-based one-time passwords
 */
class TOTPHTMLTooltip extends HTMLTooltip {
    /**
     * Render the TOTP tooltip with the current TOTP code
     * @param {import("../DeviceInterface/InterfacePrototype").default} device - The device interface
     * @param {InputTypeConfigs} config - The input type configs
     * @param {Object} callbacks - Callback functions for the tooltip
     * @returns {TOTPHTMLTooltip} The rendered tooltip instance
     */
    render(device, config, callbacks) {
        const localCredential = device.getLocalCredentials()[0];
        const t = device.t;
        this.shadow.innerHTML = `
${this.options.css}
<div class="wrapper wrapper--data top-autofill" data-platform="${this.options.platform}" data-theme-variant="${this.options.themeVariant}">
    <div class="tooltip tooltip--data">
        <button id=${localCredential.id} class="tooltip__button tooltip__button--data tooltip__button--totp js-select">
            <span class="tooltip__button__text-container">
                <span class="label label--medium">${localCredential.totp}</span>
            </span>
        </button>
        <hr />
        <button class="tooltip__button tooltip__button--secondary js-manage">
            <span class="tooltip__button__text-container">
                <span class="label label--medium">${t('autofill:managePasswords')}</span>
            </span>
        </button>
    </div>
</div>
`;
        this.tooltip = this.shadow.querySelector('.tooltip');

        this.buttonWrapper = this.shadow.querySelector('.js-select');
        this.manageWrapper = this.shadow.querySelector('.js-manage');

        this.registerClickableButton(this.buttonWrapper, () => {
            callbacks.onSelect(this.buttonWrapper?.id);
        });
        this.registerClickableButton(this.manageWrapper, () => {
            callbacks.onManage(config.type);
        });

        this.init();
        return this;
    }
}

export { TOTPHTMLTooltip };
