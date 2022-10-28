import {constants} from './mocks.js'

const createAvailableInputTypes = (overrides) => {
    const base = constants.availableInputTypes
    return {
        ...base,
        ...overrides
    }
}

export {createAvailableInputTypes}
