#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
    console.error('Usage: node save-form-to-test-suite.js <filename> <html-content> [url]');
    process.exit(1);
}

const filename = args[0];
// Join all arguments except the first one (filename) and last one (url if provided)
// This handles multi-line HTML content properly
let htmlContent, url;
if (args.length === 2) {
    htmlContent = args[1];
    url = null;
} else {
    // If there are more than 2 args, the last one is URL, everything in between is HTML content
    htmlContent = args.slice(1, -1).join(' ');
    url = args[args.length - 1];

    // Check if the last argument looks like a URL, if not, treat it as part of HTML content
    if (url && !url.startsWith('http://') && !url.startsWith('https://') && !url.includes('.')) {
        htmlContent = args.slice(1).join(' ');
        url = null;
    }
}

// Ensure filename has .html extension
const htmlFilename = filename.endsWith('.html') ? filename : `${filename}.html`;

// Path to test-forms directory
const testFormsDir = path.join(__dirname, '..', 'test-forms');
const indexJsonPath = path.join(testFormsDir, 'index.json');
const formFilePath = path.join(testFormsDir, htmlFilename);

try {
    // Prepare the HTML content with optional URL comment
    let finalContent = htmlContent;
    if (url) {
        finalContent = `<!-- ${url} -->\n${htmlContent}`;
    }

    // Write the HTML file
    fs.writeFileSync(formFilePath, finalContent, 'utf8');
    console.log(`Form saved to: ${formFilePath}`);

    // Update index.json
    let indexData = [];
    if (fs.existsSync(indexJsonPath)) {
        const indexContent = fs.readFileSync(indexJsonPath, 'utf8');
        indexData = JSON.parse(indexContent);
    }

    // Add new entry to the end of the list
    indexData.push({ html: htmlFilename });

    // Write updated index.json
    fs.writeFileSync(indexJsonPath, JSON.stringify(indexData, null, 2), 'utf8');
    console.log(`Updated index.json with: ${htmlFilename}`);
} catch (error) {
    console.error('Error saving form:', error.message);
    process.exit(1);
}
