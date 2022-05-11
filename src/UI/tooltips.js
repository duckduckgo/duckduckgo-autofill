import {NativeTooltip} from './NativeTooltip'
import {WebTooltip} from './WebTooltip'
import {OverlayController} from './OverlayController'

/**
 * @param {GlobalConfig} globalConfig
 * @param {import('@duckduckgo/content-scope-scripts').RuntimeConfiguration} platformConfig
 * @returns {TooltipInterface}
 */
export function createTooltip (globalConfig, platformConfig) {
    switch (platformConfig.platform) {
    case 'macos':
    case 'windows': {
        if (globalConfig.supportsTopFrame) {
            if (globalConfig.isTopFrame) {
                return new WebTooltip({tooltipKind: 'modern'})
            } else {
                return new OverlayController()
            }
        }
        return new WebTooltip({tooltipKind: 'modern'})
    }
    case 'android':
    case 'ios': {
        return new NativeTooltip()
    }
    case 'extension': {
        return new WebTooltip({tooltipKind: 'legacy'})
    }
    case 'unknown':
        throw new Error('unreachable. tooltipHandler platform was "unknown"')
    }
    throw new Error('undefined')
}
