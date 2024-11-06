import globals from 'globals';
import ddgConfig from '@duckduckgo/eslint-config';
import babelParser from '@babel/eslint-parser';

export default [
    {
        ignores: [
            'src/**/*.d.ts',
            'dist/*',
            'swift-package/Resources/assets/*',
            'integration-test/extension/autofill.js',
            'integration-test/extension/autofill-debug.js',
            'src/deviceApiCalls/__generated__/*',
            'src/Form/matching-config/__generated__/*',
            'playwright-report/*',
        ],
    },
    ...ddgConfig,
    {
        languageOptions: {
            globals: {
                ...globals.webextensions,
                ...globals.browser,
                ...globals.jasmine,
                ...globals.jest,
                ...globals.node,
                windowsInteropPostMessage: 'readonly',
                windowsInteropAddEventListener: 'readonly',
                windowsInteropRemoveEventListener: 'readonly',
            },

            parser: babelParser,
            ecmaVersion: 2020,
            sourceType: 'module',

            parserOptions: {
                requireConfigFile: false,

                babelOptions: {
                    configFile: './babel.config.js',
                },
            },
        },

        rules: {
            'no-restricted-globals': [2, 'name'],

            'import/extensions': [
                'error',
                'always',
                {
                    ignorePackages: true,
                },
            ],
        },
    },
];
