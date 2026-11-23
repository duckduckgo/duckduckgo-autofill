import { AppleTransport } from './apple.transport.js';

/** @type {typeof import('./transports.js').createTransport} */
export const createTransport = (globalConfig) => new AppleTransport(globalConfig);
