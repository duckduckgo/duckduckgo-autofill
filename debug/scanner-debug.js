/**
 * Scanner.debug.js
 *
 * Load this script into any HTML to debug Scanning logic
 */

import { Form } from '../src/Form/Form.js';

const state = {
    /** @type {import('./Scanner.js').Scanner | undefined} */
    scanner: undefined,
    /** @type {HTMLSelectElement|null} */
    list: document.querySelector('select[name="html-list"]'),
};

const url = new URL(window.location.href);
const initial = url.searchParams.get('form');

loadList().then(() => {
    setState(initial)
    loadNewForm(initial).catch(console.error);
});

async function loadList() {
    const url = new URL(`/test-forms/index.json`, window.location.href);
    return fetch(url)
        .then((response) => response.json())
        .then((testForms) => {
            testForms.forEach((item) => {
                const option = document.createElement('option');
                option.value = item.html;
                option.textContent = item.html;
                state.list?.appendChild(option);
            });
        });
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
if (!frame || !code) throw new Error('could not get iframe')

async function loadNewForm(filename) {
    const url = new URL(`/test-forms/${filename}`, window.location.href);
    fetch(url)
        .then((response) => response.text())
        .then((html) => {
            if (code) code.textContent = html;
            updateFrame(html)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

let timer;
code.addEventListener('input', (evt) => {
    clearTimeout(timer);
    const content = code.value;
    timer = setTimeout(() => {
        updateFrame(content);
    }, 500);
})
frame.onload = () => {
    if (!frame) throw new Error('could not get iframe')
    console.log('will re-load shiz...')
    frame.contentWindow?.addEventListener('ddg-scan-complete', ({ detail }) => {
        const scanner = /** @type {Scanner} */(detail);
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

function updateFrame(html) {
    const code = document.querySelector('#code');
    if (!frame || !code) throw new Error('could not get iframe')
    frame.srcdoc = html;
}

function setState(initial) {
    const list = document.querySelector('select[name="html-list"]');
    if (!list) throw new Error("unreachable");
    if (initial) list.value = initial;
    list.addEventListener('change', (e) => {
        const elem = /** @type {HTMLSelectElement} */ (e.target);
        const next = new URL(window.location.href);
        next.searchParams.set('form', elem.value);
        window.location.href = next.href;
    });
}
