import { createGlobalConfig } from './config.js';
import { AppleDeviceInterface } from './DeviceInterface/AppleDeviceInterface.js';
import { createTransport } from './deviceApiCalls/transports/transports.js';
import { DeviceApi } from '../packages/device-api/index.js';
import { Settings } from './Settings.js';

/** @type {typeof import('./DeviceInterface.js').createDevice} */
export const createDevice = () => {
    const globalConfig = createGlobalConfig();
    const deviceApi = new DeviceApi(createTransport(globalConfig));
    const settings = new Settings(globalConfig, deviceApi);
    return new AppleDeviceInterface(globalConfig, deviceApi, settings);
};
