import {NativeTooltip} from './NativeTooltip'
import {WebTooltip} from './WebTooltip'

/**
 * @param {AvailableInputTypes} _availableInputTypes
 * @param {import('../runtime/runtime').Runtime} runtime
 * @param {GlobalConfig} _globalConfig
 * @param {import('@duckduckgo/content-scope-scripts').RuntimeConfiguration} platformConfig
 * @param {import('../settings/settings').AutofillSettings} _autofillSettings
 * @returns {TooltipInterface}
 */
export function createTooltip (_availableInputTypes, runtime, _globalConfig, platformConfig, _autofillSettings) {
    switch (platformConfig.platform) {
    case 'macos':
    case 'windows': {
        return new WebTooltip({tooltipKind: "modern"})
    }
    case 'android':
    case 'ios': {
        return new NativeTooltip(runtime)
    }
    case 'extension': {
        return new WebTooltip({tooltipKind: "legacy"})
    }
    case 'unknown':
        throw new Error('unreachable. tooltipHandler platform was "unknown"')
    }
    throw new Error('undefined')
}
