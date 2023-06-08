import {defaultOptions} from "../UI/HTMLTooltip";
import {HTMLTooltipUIController} from "../UI/controllers/HTMLTooltipUIController";
import {OverlayUIController} from "../UI/controllers/OverlayUIController";
import {createNotification, createRequest} from "../../packages/device-api";
import {NativeUIController} from "../UI/controllers/NativeUIController";
import {
    CloseAutofillParentCall,
    GetAutofillDataCall,
    SetSizeCall
} from "../deviceApiCalls/__generated__/deviceApiCalls";
import {getInputType} from "../Form/matching";
import {getDaxBoundingBox} from "../autofill-utils";

const TOOLTIP_TYPES = {
    EmailProtection: 'EmailProtection',
    EmailSignup: 'EmailSignup'
}

export class UIController {
    _waiting = false
    /** @type {import("../Form/Form").Form | null} */
    activeForm = null;
    autopromptFired = false;
    /**
     * @param {import("../DeviceInterface/InterfacePrototype").default} device
     */
    constructor(device) {
        this.device = device;
    }
    init() {
        this.controller = this.select()
    }
    /**
     * Implementors should override this with a UI controller that suits
     * their platform.
     *
     * @returns {import("../UI/controllers/UIController.js").UIController}
     */
    select() {
        switch (this.device.ctx) {
            case "macos-legacy": {
                const options = {
                    ...defaultOptions,
                    testMode: this.device.isTestMode()
                }
                return new HTMLTooltipUIController(this.device, 'modern', options)
            }
            case "macos-modern": {
                /**
                 * If we get here, we're just a controller for an overlay
                 */
                return new OverlayUIController({
                    remove: async () => {
                        this.device.deviceApi.notify(createNotification('closeAutofillParent', {}));
                        this._waiting = false;
                    },
                    show: async (details) => {
                        this._waiting = true;
                        const applePayload = {
                            ...details.triggerContext,
                            serializedInputContext: details.serializedInputContext
                        }
                        this.device.deviceApi.notify(createNotification('showAutofillParent', applePayload))

                        // start listening for a result
                        const listener = new Promise((resolve) => {
                            // Prevent two timeouts from happening
                            // @ts-ignore
                            const poll = async () => {
                                clearTimeout(this.pollingTimeout)
                                const response = await this.device.deviceApi.request(createRequest('getSelectedCredentials'))
                                switch (response.type) {
                                    case 'none':
                                        // Parent hasn't got a selected credential yet
                                        // @ts-ignore
                                        this.pollingTimeout = setTimeout(() => {
                                            poll()
                                        }, 100)
                                        return
                                    case 'ok': {
                                        return resolve({data: response.data, configType: response.configType})
                                    }
                                    case 'stop':
                                        // Parent wants us to stop polling
                                        resolve(null)
                                        break
                                }
                            }
                            poll()
                        });
                        listener.then((response) => {
                            if (!response) {
                                return
                            }
                            this.device.formFilling.selectedDetail(response.data, response.configType)
                        }).catch(e => {
                            console.error('unknown error', e)
                        })
                    }
                })
            }
            case "macos-overlay": {
                return new HTMLTooltipUIController(this.device, 'modern', {
                    wrapperClass: 'top-autofill',
                    tooltipPositionClass: () => '.wrapper { transform: none; }',
                    setSize: (details) => this.device.deviceApi.notify(createNotification('setSize', details)),
                    testMode: this.device.isTestMode()
                })
            }
            case "ios":
            case "android": {
                return new NativeUIController()
            }
            case "windows": {
                /**
                 * If we get here, we're just a controller for an overlay
                 */
                return new OverlayUIController({
                    remove: async () => {
                        if (this._abortController && !this._abortController.signal.aborted) {
                            this._abortController.abort()
                        }
                        this.device.deviceApi.notify(new CloseAutofillParentCall(null))
                    },
                    show: async (details) => {
                        const {mainType} = details
                        // prevent overlapping listeners
                        if (this._abortController && !this._abortController.signal.aborted) {
                            this._abortController.abort()
                        }
                        this._abortController = new AbortController()
                        this._waiting = true;
                        this.device.deviceApi.request(new GetAutofillDataCall(details), { signal: this._abortController.signal })
                            .then(resp => {
                                // console.log('got resp', resp.action);
                                if (!this.device.uiController.activeForm) {
                                    throw new Error('this.currentAttached was absent')
                                }
                                switch (resp.action) {
                                    case 'fill': {
                                        if (mainType in resp) {
                                            this.device.formFilling.selectedDetail(resp[mainType], mainType);
                                        } else {
                                            throw new Error(`action: "fill" cannot occur because "${mainType}" was missing`)
                                        }
                                        break
                                    }
                                    case 'focus': {
                                        this.device.uiController.activeForm?.activeInput?.focus()
                                        break
                                    }
                                    case 'none': {
                                        // do nothing
                                        break
                                    }
                                    default: {
                                        if (this.device.globalConfig.isDDGTestMode) {
                                            console.warn('unhandled response', resp)
                                        }
                                    }
                                }
                                // this.removeTooltip('windows test')
                            })
                            .catch(e => {
                                if (this.device.globalConfig.isDDGTestMode) {
                                    if (e.name === 'AbortError') {
                                        console.log('Promise Aborted')
                                    } else {
                                        console.error('Promise Rejected', e)
                                    }
                                }
                            })
                    }
                })
            }
            case "windows-overlay": {
                return new HTMLTooltipUIController(this.device, 'modern', {
                    wrapperClass: 'top-autofill',
                    tooltipPositionClass: () => '.wrapper { transform: none; }',
                    setSize: (details) => this.device.deviceApi.notify(new SetSizeCall(details)),
                    testMode: this.device.isTestMode(),
                    /**
                     * Note: This is needed because Mutation observer didn't support visibility checks on Windows
                     */
                    checkVisibility: false
                })
            }
            case "extension": {
                /** @type {import('../UI/HTMLTooltip.js').HTMLTooltipOptions} */
                const htmlTooltipOptions = {
                    ...defaultOptions,
                    css: `<link rel="stylesheet" href="${chrome.runtime.getURL('public/css/autofill.css')}" crossOrigin="anonymous">`,
                    testMode: this.device.isTestMode()
                }
                const tooltipKinds = {
                    [TOOLTIP_TYPES.EmailProtection]: 'legacy',
                    [TOOLTIP_TYPES.EmailSignup]: 'emailsignup'
                }
                const tooltipKind = tooltipKinds[this.device.getActiveTooltipType()] || tooltipKinds[TOOLTIP_TYPES.EmailProtection]

                return new HTMLTooltipUIController(this.device, tooltipKind, htmlTooltipOptions)
            }
            default:
                assertUnreachable(this.device.ctx)
        }

    }

    /**
     * @param {import("../Form/Form").Form} form
     * @param {HTMLInputElement} input
     * @param {{ x: number; y: number; } | null} click
     * @param {import('../deviceApiCalls/__generated__/validators-ts').GetAutofillDataRequest['trigger']} trigger
     */
    attachTooltip(form, input, click, trigger = 'userInitiated') {
        // Avoid flashing tooltip from background tabs on macOS
        if (document.visibilityState !== 'visible' && trigger !== 'postSignup') return
        // Only autoprompt on mobile devices
        if (trigger === 'autoprompt' && !this.device.globalConfig.isMobileApp) return
        // Only fire autoprompt once
        if (trigger === 'autoprompt' && this.autopromptFired) return

        form.activeInput = input
        this.activeForm = form
        const inputType = getInputType(input)

        /** @type {PosFn} */
        const getPosition = () => {
            // In extensions, the tooltip is centered on the Dax icon
            const alignLeft = this.device.globalConfig.isApp || this.device.globalConfig.isWindows
            return alignLeft ? input.getBoundingClientRect() : getDaxBoundingBox(input)
        }

        // todo: this will be migrated to use NativeUIController soon
        if (this.device.globalConfig.isMobileApp && inputType === 'identities.emailAddress') {
            this.device.emailProtection.getAlias().then((alias) => {
                if (alias) form.autofillEmail(alias)
                else form.activeInput?.focus()
            })
            return
        }

        /** @type {TopContextData} */
        const topContextData = {
            inputType
        }

        // Allow features to append/change top context data
        // for example, generated passwords may get appended here
        const processedTopContext = this.device.preAttachTooltip(topContextData, input, form)

        this.controller?.attach({
            input,
            form,
            click,
            getPosition,
            topContextData: processedTopContext,
            device: this.device,
            trigger
        })

        if (trigger === 'autoprompt') {
            this.autopromptFired = true
        }
    }
}

/**
 * @param {never} x
 * @returns {never}
 */
function assertUnreachable(x) {
    console.log(x)
    throw new Error("Didn't expect to get here");
}
