/**
 * @typedef {object} TargetConfig
 * @property {string} activation - path (from the repo root) of the file that decides when to call `ddgAutofill()`
 */

/**
 * Platform-specific builds, each written to `dist/autofill.<name>.js`.
 * @type {Record<string, TargetConfig>}
 */
export const targets = {
    ios: {
        activation: 'src/activation.js',
    },
};
