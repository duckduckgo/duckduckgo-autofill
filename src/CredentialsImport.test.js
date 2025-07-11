import { DeviceApi } from '../packages/device-api/index.js';
import { createGlobalConfig } from './config.js';
import { AndroidTransport } from './deviceApiCalls/transports/android.transport.js';
import { AndroidInterface } from './DeviceInterface/AndroidInterface.js';
import { Settings } from './Settings.js';
import { CredentialsImport } from './CredentialsImport.js';
import { attachAndReturnGenericForm } from './test-utils.js';
import { Form } from './Form/Form.js';

function createDeviceApi() {
    const transport = new AndroidTransport(createGlobalConfig());
    return new DeviceApi(transport);
}

function createDevice() {
    const deviceApi = createDeviceApi();
    const settings = Settings.default(createGlobalConfig(), deviceApi);
    return new AndroidInterface(createGlobalConfig(), deviceApi, settings);
}

function createLoginForm(device) {
    const formEl = attachAndReturnGenericForm(`
        <form id="form">
            <input type="text" value="testUsername" autocomplete="username" id="username" />
            <input type="password" value="testPassword" autocomplete="new-password" id="password" />
            <button type="submit">Login</button>
        </form>
    `);
    const input = formEl.querySelector('input');
    if (!input) throw new Error('unreachable');
    const form = new Form(formEl, input, device);
    device.activeForm = form;
    form.activeInput = input;
    return form;
}

describe('CredentialsImport', () => {
    /** @type {CredentialsImport} */
    let credentialsImport;

    /** @type {AndroidInterface} */
    let device;

    /** @type {Form} */
    let form;

    const newAvailableInputTypes = {
        credentialsImport: false,
        credentials: {
            username: true,
            password: false,
        },
    };

    beforeEach(() => {
        device = createDevice();
        form = createLoginForm(device);
        credentialsImport = new CredentialsImport(device);
    });

    describe('refresh()', () => {
        it('correctly updates the available input types', async () => {
            await credentialsImport.refresh(newAvailableInputTypes);
            expect(credentialsImport.isAvailable()).toBe(false);
            expect(device.settings.availableInputTypes.credentials).toEqual(newAvailableInputTypes.credentials);
        });

        it('should attach tooltip with credentialsImport trigger when credentials are available', async () => {
            // Set up a form and active input
            // Mock attachTooltip
            jest.spyOn(device, 'attachTooltip');

            await credentialsImport.refresh(newAvailableInputTypes);
            expect(device.attachTooltip).toHaveBeenCalledWith({
                form,
                input: form.activeInput,
                click: null,
                trigger: 'credentialsImport',
                triggerMetaData: {
                    type: 'transactional',
                },
            });
        });
    });
});
