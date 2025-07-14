#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const { argv } = process;

// Configuration
const SERVER_PORT = 3210;
const DEBUG_UI_URL = `http://localhost:${SERVER_PORT}/debug/index.html`;

console.log('🚀 Starting Debug UI Tool...');

// First, ensure debug UI assets are copied
console.log('📄 Copying debug UI assets...');
process.env.DEBUG_UI = 'true';

// Check for mode
const showIcons = argv.includes('--icons');
if (showIcons) {
    console.log('🎨 Icon visualization mode activated');
}

require('./copy-assets.js');

// Start the HTTP server
console.log(`🌐 Starting server on port ${SERVER_PORT}...`);
const server = spawn('npx', ['http-server', '-c-1', '--port', SERVER_PORT.toString(), './'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe',
    env: { ...process.env, OPEN_BROWSER: '1' },
});

server.stdout.on('data', (data) => {
    const output = data.toString();
    process.stdout.write(`[Server] ${output}`);

    // Look for server ready message and open browser
    if (output.includes('Available on:') || output.includes('Hit CTRL-C')) {
        setTimeout(() => {
            // Check if we have a page to open from CLI arguments
            const iconPage = process.argv.includes('--icons');
            const urlToOpen = iconPage ? `http://localhost:${SERVER_PORT}/debug/icons.html` : DEBUG_UI_URL;

            console.log(`🌐 Opening browser at: ${urlToOpen}`);
            openBrowser(urlToOpen);
        }, 50);
    }
});

server.stderr.on('data', (data) => {
    process.stderr.write(`[Server] ${data}`);
});

// Handle cleanup on exit
const cleanup = () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGTERM');
    process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

server.on('exit', (code) => {
    if (code !== 0) {
        console.error(`Server exited with code ${code}`);
    }
    process.exit(code || 0);
});

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
server.on('error', (error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
});
