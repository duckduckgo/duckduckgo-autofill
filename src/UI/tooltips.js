import {NativeTooltip} from './NativeTooltip'
import {WebTooltip} from './WebTooltip'
import {TopFrameControllerTooltip} from './TopFrameControllerTooltip'

/**
 * @param {AvailableInputTypes} _availableInputTypes
 * @param {import('../runtime/runtime').Runtime} runtime
 * @param {GlobalConfig} globalConfig
 * @param {import('@duckduckgo/content-scope-scripts').RuntimeConfiguration} platformConfig
 * @param {import('../settings/settings').AutofillSettings} _autofillSettings
 * @returns {TooltipInterface}
 */
export function createTooltip (_availableInputTypes, runtime, globalConfig, platformConfig, _autofillSettings) {
    switch (platformConfig.platform) {
    case 'macos':
    case 'windows': {
        if (globalConfig.supportsTopFrame) {
            if (globalConfig.isTopFrame) {
                return new WebTooltip({tooltipKind: "modern"})
            } else {
                return new TopFrameControllerTooltip(runtime,{});
            }
        }
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
