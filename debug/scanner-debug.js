/**
 * Scanner.debug.js
 *
 * Load this script into any HTML to debug Scanning logic
 */

import { Form } from '../src/Form/Form.js';
import * as prettier from 'prettier/standalone';
import htmlPlugin from 'prettier/plugins/html';

/**
 * @typedef {import('../src/Scanner.js').Scanner} Scanner
 */

const state = {
    /** @type {import('../src/Scanner.js').Scanner | undefined} */
    scanner: undefined,
    /** @type {HTMLInputElement|null} */
    comboboxInput: null,
    /** @type {HTMLElement|null} */
    comboboxDropdown: null,
    /** @type {Array<{html: string, title?: string}>} */
    allForms: [],
    /** @type {Array<{html: string, title?: string}>} */
    filteredForms: [],
    /** @type {'asc'|'desc'} */
    sortOrder: 'asc',
    /** @type {number} */
    highlightedIndex: -1,
    /** @type {string} */
    selectedValue: '',
    /** @type {boolean} */
    isOpen: false,
};

const url = new URL(window.location.href);
const initial = url.searchParams.get('form');

loadList().then(() => {
    setState(initial)
    loadNewForm(initial).catch(console.error);
    startServerStatusPolling();
});

async function loadList() {
    // Initialize the combobox element references when DOM is ready
    state.comboboxInput = document.getElementById('combobox-input');
    state.comboboxDropdown = document.getElementById('combobox-dropdown');

    const url = new URL(`/test-forms/index.json`, window.location.href);
    return fetch(url)
        .then((response) => response.json())
        .then((testForms) => {
            state.allForms = testForms;
            state.filteredForms = sortForms(testForms, state.sortOrder);
            setupCombobox();
            updateSortButton();
        });
}

function populateDropdown(forms) {
    if (!state.comboboxDropdown) return;

    // Clear existing options
    state.comboboxDropdown.innerHTML = '';

    if (forms.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'combobox-empty';
        emptyDiv.textContent = 'No forms found';
        state.comboboxDropdown.appendChild(emptyDiv);
        return;
    }

    forms.forEach((item, index) => {
        const option = document.createElement('button');
        option.className = 'combobox-option';
        option.textContent = item.title || item.html;
        option.dataset.value = item.html;
        option.dataset.index = index.toString();
        option.addEventListener('click', () => selectOption(index));
        state.comboboxDropdown.appendChild(option);
    });
}

function setupCombobox() {
    if (!state.comboboxInput || !state.comboboxDropdown) return;

    // Input event handler for filtering
    state.comboboxInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterAndUpdate(searchTerm);
        if (!state.isOpen) {
            openDropdown();
        }
    });

    // Focus event handler
    state.comboboxInput.addEventListener('focus', () => {
        if (!state.isOpen) {
            openDropdown();
        }
    });

    // Click trigger button
    const trigger = document.querySelector('.combobox-trigger');
    if (trigger) {
        trigger.addEventListener('click', () => {
            if (state.isOpen) {
                closeDropdown();
            } else {
                state.comboboxInput?.focus();
                openDropdown();
            }
        });
    }

    // Keyboard navigation
    state.comboboxInput.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (!state.isOpen) {
                    openDropdown();
                } else {
                    highlightNext();
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                highlightPrevious();
                break;
            case 'Enter':
                e.preventDefault();
                if (state.isOpen && state.highlightedIndex >= 0) {
                    selectOption(state.highlightedIndex);
                }
                break;
            case 'Escape':
                e.preventDefault();
                closeDropdown();
                break;
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!state.comboboxInput?.contains(e.target) &&
            !state.comboboxDropdown?.contains(e.target) &&
            !e.target?.closest('.combobox-trigger')) {
            closeDropdown();
        }
    });

    // Setup sort button
    const sortButton = document.getElementById('sort-button');
    if (sortButton) {
        sortButton.addEventListener('click', () => {
            state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
            const searchTerm = state.comboboxInput?.value.toLowerCase() || '';
            filterAndUpdate(searchTerm);
            updateSortButton();
        });
    }

    // Initial population
    filterAndUpdate('');
}

function filterAndUpdate(searchTerm) {
    let filtered = state.allForms;

    if (searchTerm) {
        filtered = state.allForms.filter(form => {
            const displayName = (form.title || form.html).toLowerCase();
            return displayName.includes(searchTerm);
        });
    }

    state.filteredForms = sortForms(filtered, state.sortOrder);
    state.highlightedIndex = -1;
    populateDropdown(state.filteredForms);
}

function sortForms(forms, order = 'asc') {
    return [...forms].sort((a, b) => {
        const nameA = (a.title || a.html).toLowerCase();
        const nameB = (b.title || b.html).toLowerCase();
        const comparison = nameA.localeCompare(nameB);
        return order === 'asc' ? comparison : -comparison;
    });
}

function openDropdown() {
    if (!state.comboboxDropdown || !state.comboboxInput) return;

    state.isOpen = true;
    state.comboboxDropdown.classList.add('open');
    state.comboboxInput.setAttribute('aria-expanded', 'true');
}

function closeDropdown() {
    if (!state.comboboxDropdown || !state.comboboxInput) return;

    state.isOpen = false;
    state.highlightedIndex = -1;
    state.comboboxDropdown.classList.remove('open');
    state.comboboxInput.setAttribute('aria-expanded', 'false');
    updateHighlight();
}

function highlightNext() {
    if (state.filteredForms.length === 0) return;

    state.highlightedIndex = Math.min(
        state.highlightedIndex + 1,
        state.filteredForms.length - 1
    );
    updateHighlight();
}

function highlightPrevious() {
    if (state.filteredForms.length === 0) return;

    state.highlightedIndex = Math.max(state.highlightedIndex - 1, 0);
    updateHighlight();
}

function updateHighlight() {
    if (!state.comboboxDropdown) return;

    const options = state.comboboxDropdown.querySelectorAll('.combobox-option');
    options.forEach((option, index) => {
        option.classList.toggle('highlighted', index === state.highlightedIndex);
    });
}

function selectOption(index) {
    if (!state.comboboxInput || index < 0 || index >= state.filteredForms.length) return;

    const selected = state.filteredForms[index];
    state.selectedValue = selected.html;
    state.comboboxInput.value = selected.title || selected.html;

    closeDropdown();

    // Update URL and load the form
    const next = new URL(window.location.href);
    next.searchParams.set('form', selected.html);
    window.location.href = next.href;
}

function updateSortButton() {
    const sortButton = document.getElementById('sort-button');
    if (sortButton) {
        const isAsc = state.sortOrder === 'asc';
        sortButton.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6,${isAsc ? '9' : '15'} 12,${isAsc ? '15' : '9'} 18,${isAsc ? '9' : '15'}"></polyline>
            </svg>
            ${isAsc ? 'A-Z' : 'Z-A'}
        `;
        sortButton.classList.toggle('desc', state.sortOrder === 'desc');
    }
}

/**
 * @param {Form} form
 */
function updateSignals(form) {
    const signals = document.querySelector('#signals');
    if (!signals) throw new Error("unreachable signals");
    signals.textContent = JSON.stringify({
        signals: form.formAnalyzer.signals,
        autofillSignal: form.formAnalyzer.autofillSignal,
        hybridSignal: form.formAnalyzer.hybridSignal,
    }, null, 2)
}

/**
 * @param {Form} form
 */
function updateInputs(form) {
    const inputs = document.querySelector('#inputs');
    if (!inputs) throw new Error("unreachable inputs");
    const output = {
        credentials: /** @type {any[]} */([])
    }
    for (let credential of form.inputs.all) {
        output.credentials.push({
            type: credential.type,
            name: credential.name,
            ddg: credential.dataset.ddgInputtype,
        })
    }
    inputs.textContent = JSON.stringify(output, null, 2)
}

const code = /** @type {HTMLTextAreaElement|null} */(document.querySelector('#code'));
const frame = document.querySelector('iframe');
const prettifyBtn = /** @type {HTMLButtonElement|null} */(document.querySelector('#prettify-btn'));
const saveBtn = /** @type {HTMLButtonElement|null} */(document.querySelector('#save-btn'));
if (!frame || !code || !prettifyBtn || !saveBtn) throw new Error('could not get required elements')

async function loadNewForm(filename) {
    if (!filename) return;

    const url = new URL(`/test-forms/${filename}`, window.location.href);
    fetch(url)
        .then((response) => response.text())
        .then((html) => {
            if (code) code.textContent = html;
            updateFrame(html)
            hidePrettifyButton();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

let timer;
code.addEventListener('input', () => {
    clearTimeout(timer);
    const content = code.value;
    timer = setTimeout(() => {
        updateFrame(content);
        // Show save button if there's content and no form is selected
        if (content.trim() && state.list && !state.list.value) {
            showSaveButton();
        }
    }, 500);
})
frame.onload = () => {
    if (!frame) throw new Error('could not get iframe')
    console.log('will re-load shiz...')
    frame.contentWindow?.addEventListener('ddg-scan-complete', (event) => {
        const customEvent = /** @type {CustomEvent} */ (event);
        const scanner = /** @type {Scanner} */(customEvent.detail);
        for (let [_, form] of scanner.forms) {
            updateSignals(form);
            updateInputs(form);
        }
    }, {once: true})
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'dist/scanner-runner.js';
    frame.contentDocument?.head.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/water.css@2/out/light.css'; // Replace with actual CSS file URL from CDN
    frame.contentDocument?.head.appendChild(link);
}

function showPrettifyButton() {
    if (prettifyBtn) prettifyBtn.hidden = false;
    if (saveBtn) saveBtn.hidden = true;
}

function hidePrettifyButton() {
    if (prettifyBtn) prettifyBtn.hidden = true;
}

function showSaveButton() {
    if (saveBtn) saveBtn.hidden = false;
    if (prettifyBtn) prettifyBtn.hidden = true;
}

async function prettifyAndCleanHTML(html) {
    if (!html.trim()) return '';

    // Create a temporary DOM to parse and clean the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Remove all script tags
    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach(script => script.remove());

    // Remove all style tags
    const styles = tempDiv.querySelectorAll('style');
    styles.forEach(style => style.remove());

    // Remove all svg
    const svgs = tempDiv.querySelectorAll('svg');
    svgs.forEach(svg => svg.remove());

    // Remove src attributes, style attributes, and data-ddg-inputtype attributes from all elements
    const allElements = tempDiv.querySelectorAll('*');
    allElements.forEach(element => {
        element.removeAttribute('src');
        element.removeAttribute('style');
        element.removeAttribute('data-ddg-inputtype');
        element.removeAttribute('data-ddg-autofill');
    });

    // Get the cleaned HTML
    let cleanedHTML = tempDiv.innerHTML;

    // Use prettier for proper HTML formatting
    try {
        return await prettier.format(cleanedHTML, {
            parser: 'html',
            plugins: [htmlPlugin],
            printWidth: 120,
            tabWidth: 2,
            useTabs: false,
            htmlWhitespaceSensitivity: 'css'
        });
    } catch (error) {
        console.error('Prettier formatting failed:', error);
        return cleanedHTML;
    }
}

function updateFrame(html) {
    const code = document.querySelector('#code');
    if (!frame || !code) throw new Error('could not get iframe')
    frame.srcdoc = html;
}

function setState(initial) {
    if (!state.comboboxInput) return;

    if (initial) {
        // Find the form in our list and set the display value
        const form = state.allForms.find(f => f.html === initial);
        if (form) {
            state.selectedValue = form.html;
            state.comboboxInput.value = form.title || form.html;
        }
        hidePrettifyButton();
    } else {
        showPrettifyButton();
    }
}

// Add prettify button click handler
prettifyBtn.addEventListener('click', async () => {
    try {
        const clipboardText = await navigator.clipboard.readText();
        const cleanedHTML = await prettifyAndCleanHTML(clipboardText);
        if (code) {
            code.value = cleanedHTML;
            updateFrame(cleanedHTML);
            showSaveButton();
        }
    } catch (err) {
        console.error('Failed to read clipboard:', err);
        // Fallback: just focus the textarea for manual paste
        if (code) code.focus();
    }
});

async function checkServerStatus() {
    const statusElement = document.getElementById('server-status');
    const statusText = statusElement?.querySelector('.status-text');

    if (!statusElement || !statusText) {
        console.error('Missing server status elements:', { statusElement, statusText });
        return;
    }

    try {
        // Create timeout controller for older browser support
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 2000);

        const response = await fetch('http://localhost:3211/health', {
            method: 'GET',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            statusElement.classList.remove('offline');
            statusElement.classList.add('online');
            statusText.textContent = 'Save server: Online';
        } else {
            throw new Error(`Server responded with status: ${response.status}`);
        }
    } catch (error) {
        statusElement.classList.remove('online');
        statusElement.classList.add('offline');
        if (error instanceof Error && error.name === 'AbortError') {
            statusText.textContent = 'Save server: Timeout';
        } else if (error instanceof Error && error.message.includes('fetch')) {
            statusText.textContent = 'Save server: Connection failed';
        } else {
            statusText.textContent = 'Save server: Offline';
        }
    }
}

// Start polling server status every 5 seconds
function startServerStatusPolling() {
    checkServerStatus(); // Initial check
    setInterval(checkServerStatus, 5000); // Poll every 5 seconds
}

// Add save button click handler
saveBtn.addEventListener('click', async () => {
    if (!code || !code.value.trim()) {
        alert('No form content to save');
        return;
    }

    // First prompt for URL
    const url = prompt('What is the URL of the form?');

    let filename;
    if (url === null) {
        // User cancelled URL prompt, ask for filename
        filename = prompt('Please provide the name of the file:');
        if (filename === null) {
            // User cancelled filename prompt, do nothing
            return;
        }
    } else {
        // Use URL as filename, extract domain and path
        try {
            const urlObj = new URL(url);
            filename = urlObj.hostname.replace(/[^a-zA-Z0-9]/g, '_') + '_' + urlObj.pathname.replace(/[^a-zA-Z0-9]/g, '_');
        } catch (e) {
            // If URL parsing fails, use the URL string directly
            filename = url.replace(/[^a-zA-Z0-9]/g, '_');
        }
    }

    if (!filename.trim()) {
        alert('Filename cannot be empty');
        return;
    }

    try {
        // Call the Node.js script to save the form
        const response = await fetch('http://localhost:3211/save-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filename: filename,
                htmlContent: code.value,
                url: url
            })
        });

        if (response.ok) {
            const result = await response.text();
            alert('Form saved successfully!');
            console.log(result);

            // Ensure filename has .html extension for loading
            const htmlFilename = filename.endsWith('.html') ? filename : `${filename}.html`;

            // Update the URL to load the saved form
            const next = new URL(window.location.href);
            next.searchParams.set('form', htmlFilename);
            window.location.href = next.href;
        } else {
            throw new Error(`Server error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error saving form:', error);
        alert('Failed to save form. Check console for details.');
    }
});
