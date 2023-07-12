/**
 * Use this as place to store any state or functionality related to Email Protection
 */
class EmailProtection {
    /** @type {string|null} */
    #previous = null;

    /** @param {import("./DeviceInterface/InterfacePrototype").default} device */
    constructor(device) {
        this.device = device;
    }

    /** @returns {boolean} */
    get generated () {
        return this.#previous !== null
    }

    /** @returns {string|null} */
    get lastGenerated () {
        return this.#previous
    }

    /**
     * Store the last received email address
     * @param {string} emailAddress
     */
    received(emailAddress) {
        this.#previous = emailAddress;
        return emailAddress;
    }
}

export { EmailProtection }
