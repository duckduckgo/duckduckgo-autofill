/**
 * Cross-platform absolute directory path for modules.
 *
 * On windows, 'pathname' has a leading `/` which needs removing
 */
export function cwd(current) {
    const pathname = new URL('.', current).pathname
    if (process.platform === 'win32') {
        return pathname.slice(1)
    }
    return pathname
}
