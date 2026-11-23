import { NativeUIController } from '../UI/controllers/NativeUIController.js';

/** @type {typeof import('./appleUIController.js').createAppleUIController} */
export const createAppleUIController = () => new NativeUIController();
