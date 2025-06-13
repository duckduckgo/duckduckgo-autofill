#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3211; // Different port from the main server

function saveFormDirectly(filename, htmlContent, url) {
    // Ensure filename has .html extension
    const htmlFilename = filename.endsWith('.html') ? filename : `${filename}.html`;

    // Path to test-forms directory
    const testFormsDir = path.join(__dirname, '..', 'test-forms');
    const indexJsonPath = path.join(testFormsDir, 'index.json');
    const formFilePath = path.join(testFormsDir, htmlFilename);

    // Prepare the HTML content with optional URL comment
    let finalContent = htmlContent;
    if (url) {
        finalContent = `<!-- ${url} -->\n${htmlContent}`;
    }

    // Write the HTML file
    fs.writeFileSync(formFilePath, finalContent, 'utf8');

    // Update index.json
    let indexData = [];
    if (fs.existsSync(indexJsonPath)) {
        const indexContent = fs.readFileSync(indexJsonPath, 'utf8');
        indexData = JSON.parse(indexContent);
    }

    // Add new entry to the end of the list
    indexData.push({ html: htmlFilename });

    // Write updated index.json with single-line objects
    // const jsonString = JSON.stringify(indexData, null, 2);
    const jsonString =
        '[\n' +
        indexData
            .map((obj) => '  ' + JSON.stringify(obj, null, 2).replace(/\n\s*/g, ' ').replace(/\[ "/g, '["').replace(/ ]/g, ']'))
            .join(',\n') +
        '\n]';
    fs.writeFileSync(indexJsonPath, jsonString, 'utf8');

    return { formFilePath, htmlFilename };
}

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
        return;
    }

    if (req.method === 'POST' && req.url === '/save-form') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const { filename, htmlContent, url } = data;

                if (!filename || !htmlContent) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Missing filename or htmlContent');
                    return;
                }

                const result = saveFormDirectly(filename, htmlContent, url);

                console.log(`Form saved to: ${result.formFilePath}`);
                console.log(`Updated index.json with: ${result.htmlFilename}`);

                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Form saved successfully');
            } catch (error) {
                console.error('Error saving form:', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Error saving form: ${error.message}`);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Form save server running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    console.log('\nShutting down form save server...');
    server.close(() => {
        process.exit(0);
    });
});
