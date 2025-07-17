# Scanner Debugging Guide

This guide covers debugging the Scanner functionality and using the Save Form feature to add new test forms to the test suite.

## Quick Start

Use the `debug-form` script that automatically starts both servers and opens your browser:

```bash
# Start with no specific form
npm run debug-form

# Start with a specific form loaded
npm run debug-form test-forms/amazon_login.html
```

This will:
- Start both the main server and form save server
- Open your browser automatically
- Load the specified form (if provided)
- Display server status indicator

To see available form files, you can list them:
```bash
ls test-forms/*.html
```

## Start debugging

All JS files in this setup are loaded as native ESM modules, so all browser/IDE dev tools will work as expected.

Note: The URL will be updated to reflect your selection, so you can share links with your colleagues.

### Step 4: Enable detailed logging

When viewing any HTML form in this setup, you can append a `log` query parameter, this will set `sessionStorage.setItem('ddg-autofill-debug', 'true')` and will output detailed information.

## Save Form to Test Suite Feature

The debug tool includes a feature to save HTML forms directly to the test suite.

### Adding Form Content

Go to the website that contains the form you want to add to the test suite and copy the HTML from devtools. On the debugging UI, use the "Paste, prettify, and remove cruft" button to paste HTML from your clipboard. This will prettify the form, remove cruft like svgs, scripts, styles, and all the autofill annotations (in case you were already running autofill in your browser).

### Saving Forms

1. **Paste content**: Use the prettify button to paste and clean HTML content from your clipboard.
2. **Annotate fields and buttons**: Add `data-manual-scoring` and `data-manual-submit` right in the textarea.
3. **Save to test suite**: Once you have pasted the content, the "Save form to test suite" button will appear.
4. **Provide form details**: You'll be prompted for:
   - **URL** (optional): The URL where the form was found. If you cancel this prompt, you'll be asked for a filename instead.
   - **Filename** (fallback): If you don't provide a URL, you can specify a custom filename.
     - Note: The `.html` extension is automatically added if not present and special characters in URLs are replaced with underscores

### What Happens When You Save

1. **File creation**: A new HTML file is created in the `test-forms/` directory
2. **URL comment**: If you provided a URL, it's added as an HTML comment at the top of the file
3. **Index update**: The `test-forms/index.json` file is automatically updated to include the new form
4. **Page refresh**: The page reloads to show the new form in the dropdown list

### Example

If you save a form with URL `https://example.com/login`, it will:
- Create a file named `example_com_login.html`
- Add `<!-- https://example.com/login -->` as the first line
- Update `index.json` to include the new form

## Server Status Indicator

The debug tool shows a server status indicator in the top-right corner that displays:
- **Online**: Form save server is running and reachable
- **Offline/Timeout/Connection failed**: Form save server is not available

The status is automatically checked every 5 seconds and the server shuts down automatically when closing the terminal window or hitting ctr-c.

## Troubleshooting

- **"Form saved successfully" but no file appears**: Check that the form save server is running on port 3211
- **File not appearing in dropdown**: Try refreshing the page manually
- **Server status shows offline**: Ensure the form save server is running with `npm run serve:form-saver`
- **Cannot paste content**: Make sure your browser allows clipboard access, or manually paste into the textarea
