/**
 * HTML Prettifier Utility
 *
 * Provides HTML cleaning and formatting functionality that works in both
 * Node.js and browser environments.
 */

import * as prettier from 'prettier/standalone';
import htmlPlugin from 'prettier/plugins/html';

/**
 * Cleans and prettifies HTML content
 * @param {string} html - The HTML content to clean and format
 * @returns {Promise<string>} - The cleaned and formatted HTML
 */
export async function prettifyAndCleanHTML(html) {
    if (!html.trim()) return '';

    let tempDiv;

    // Check if we're in a Node.js environment
    if (typeof window === 'undefined') {
        // Node.js environment - use jsdom
        const { JSDOM } = await import('jsdom');
        const dom = new JSDOM(html);
        tempDiv = dom.window.document.createElement('div');
        tempDiv.innerHTML = html;
    } else {
        // Browser environment - use current DOM API
        tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
    }

    // Remove all script tags
    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach((script) => script.remove());

    // Remove all style tags
    const styles = tempDiv.querySelectorAll('style');
    styles.forEach((style) => style.remove());

    // Remove all svg
    const svgs = tempDiv.querySelectorAll('svg');
    svgs.forEach((svg) => svg.remove());

    // Remove src attributes, style attributes, and data-ddg-inputtype attributes from all elements
    const allElements = tempDiv.querySelectorAll('*');
    allElements.forEach((element) => {
        element.removeAttribute('src');
        element.removeAttribute('style');
        element.removeAttribute('data-ddg-inputtype');
        element.removeAttribute('data-ddg-autofill');
    });

    // Get the cleaned HTML
    const cleanedHTML = tempDiv.innerHTML;

    // Use prettier for proper HTML formatting
    try {
        return await prettier.format(cleanedHTML, {
            parser: 'html',
            plugins: [htmlPlugin],
            printWidth: 120,
            tabWidth: 2,
            useTabs: false,
            htmlWhitespaceSensitivity: 'css',
        });
    } catch (error) {
        console.error('Prettier formatting failed:', error);
        return cleanedHTML;
    }
}

// Test the function when run directly with Node.js
if (typeof window === 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
    const fs = await import('fs/promises');

    const inputFile = process.argv[2];
    if (!inputFile) {
        console.error('Usage: node html-prettifier.js <input-file>');
        process.exit(1);
    }

    try {
        const htmlContent = await fs.readFile(inputFile, 'utf8');
        const result = await prettifyAndCleanHTML(htmlContent);

        console.log('✅ HTML prettifier completed successfully!');
        console.log('\nCleaned and formatted HTML:');
        if (result) {
            // write to output file name, using the command line args
            const outputFile = process.argv[3] || inputFile.replace('.html', '_cleaned.html');
            await fs.writeFile(outputFile, result);
            console.log(`✅ Cleaned HTML written to ${outputFile}`);
        } else {
            console.log('No result');
        }
    } catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}
