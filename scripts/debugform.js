#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const MAIN_SERVER_PORT = 3210;
const FORM_SAVE_SERVER_PORT = 3211;
const DEBUG_URL_BASE = `http://localhost:${MAIN_SERVER_PORT}/debug/scanner-debug.html`;

// Get optional filename from command line arguments
const filename = process.argv[2];

// Validate filename if provided
if (filename) {
    const testFormsDir = path.join(__dirname, '..', 'test-forms');
    const filePath = path.join(testFormsDir, filename);

    if (!fs.existsSync(filePath)) {
        console.error(`Error: File '${filename}' not found in test-forms directory`);
        process.exit(1);
    }
}

// Build the URL with optional form parameter
let debugUrl = DEBUG_URL_BASE;
if (filename) {
    debugUrl += `?form=${encodeURIComponent(filename)}`;
}

console.log('🚀 Starting Debug Form Tool...');
if (filename) {
    console.log(`📄 Loading form: ${filename}`);
}

// Start the form save server
console.log(`🔧 Starting form save server on port ${FORM_SAVE_SERVER_PORT}...`);
const formSaveServer = spawn('node', ['scripts/form-save-server.js'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe',
});

formSaveServer.stdout.on('data', (data) => {
    process.stdout.write(`[Form Save Server] ${data}`);
});

formSaveServer.stderr.on('data', (data) => {
    process.stderr.write(`[Form Save Server] ${data}`);
});

// Wait a moment for the form save server to start
setTimeout(() => {
    // Start the main HTTP server
    console.log(`🌐 Starting main server on port ${MAIN_SERVER_PORT}...`);
    const mainServer = spawn('npx', ['http-server', '-c-1', '--port', MAIN_SERVER_PORT.toString(), './'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe',
    });

    mainServer.stdout.on('data', (data) => {
        const output = data.toString();
        process.stdout.write(`[Main Server] ${output}`);

        // Look for server ready message and open browser
        if (output.includes('Available on:') || output.includes('Hit CTRL-C')) {
            setTimeout(() => {
                console.log(`🌐 Opening browser at: ${debugUrl}`);
                openBrowser(debugUrl);
            }, 50);
        }
    });

    mainServer.stderr.on('data', (data) => {
        process.stderr.write(`[Main Server] ${data}`);
    });

    // Handle cleanup on exit
    const cleanup = () => {
        console.log('\n🛑 Shutting down servers...');
        mainServer.kill('SIGTERM');
        formSaveServer.kill('SIGTERM');
        process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

    mainServer.on('exit', () => {
        formSaveServer.kill('SIGTERM');
        process.exit(0);
    });

    formSaveServer.on('exit', () => {
        mainServer.kill('SIGTERM');
        process.exit(0);
    });
}, 100);

// Cross-platform browser opening function
function openBrowser(url) {
    const platform = process.platform;
    let command;

    switch (platform) {
        case 'darwin': // macOS
            command = `open "${url}"`;
            break;
        case 'win32': // Windows
            command = `start "${url}"`;
            break;
        default: // Linux and others
            command = `xdg-open "${url}"`;
            break;
    }

    exec(command, (error) => {
        if (error) {
            console.error(`Failed to open browser automatically: ${error.message}`);
            console.log(`Please open your browser manually and go to: ${url}`);
        }
    });
}

// Handle server startup errors
formSaveServer.on('error', (error) => {
    console.error('Failed to start form save server:', error.message);
    process.exit(1);
});

formSaveServer.on('exit', (code) => {
    if (code !== 0) {
        console.error(`Form save server exited with code ${code}`);
    }
});
