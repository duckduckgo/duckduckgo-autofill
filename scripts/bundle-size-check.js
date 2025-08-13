#!/usr/bin/env node

/**
 * Bundle Size Comment Generator
 * This script generates comments for PRs showing bundle size differences
 */

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

function generateBundleSizeComment(baseSizes, currentSizes) {
    const { js: baseSizeJs, jsDebug: baseSizeJsDebug } = baseSizes;
    const { js: currentSizeJs, jsDebug: currentSizeJsDebug } = currentSizes;

    const sizeDiffJs = currentSizeJs - baseSizeJs;
    const percentChangeJs = ((sizeDiffJs / baseSizeJs) * 100).toFixed(2);

    const sizeDiffJsDebug = currentSizeJsDebug - baseSizeJsDebug;
    const percentChangeJsDebug = ((sizeDiffJsDebug / baseSizeJsDebug) * 100).toFixed(2);

    return `## Bundle size 
**autofill.js:** ${formatBytes(baseSizeJs)} -> ${formatBytes(currentSizeJs)}
**Change:** ${sizeDiffJs > 0 ? '+' : ''}${formatBytes(Math.abs(sizeDiffJs))} (${sizeDiffJs > 0 ? '+' : ''}${percentChangeJs}%)
<br>
**autofill-debug.js:** ${formatBytes(baseSizeJsDebug)} -> ${formatBytes(currentSizeJsDebug)}
**Change:** ${sizeDiffJsDebug > 0 ? '+' : ''}${formatBytes(Math.abs(sizeDiffJsDebug))} (${sizeDiffJsDebug > 0 ? '+' : ''}${percentChangeJsDebug}%)`;
}

if (require.main === module) {
    const baseSizes = {
        js: parseInt(process.env.BASE_SIZE_JS || '0'),
        jsDebug: parseInt(process.env.BASE_SIZE_JS_DEBUG || '0'),
    };

    const currentSizes = {
        js: parseInt(process.env.CURRENT_SIZE_JS || '0'),
        jsDebug: parseInt(process.env.CURRENT_SIZE_JS_DEBUG || '0'),
    };

    // Generate and output the comment
    const comment = generateBundleSizeComment(baseSizes, currentSizes);
    console.log(comment);
}
