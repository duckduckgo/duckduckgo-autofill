## Debugging the Scanner

We have snapshots of various forms within [test-forms](..%2Ftest-forms), these can be loaded 
into `src/scanner-debug.html` for easier debugger.

### Step 1: start the server

```bash
npm run server
```

### Step 2: open the page

In any browser, load the following URL
- http://localhost:3210/src/scanner-debug.html

### Step 3: Start debugging

All JS files in this setup are loaded as native ESM modules, so all browser/IDE dev tools will
work as expected.

Note: The URL will be updated to reflect your selection, so you can share links with your colleagues.

### Step 4: Enable detailed logging

When viewing any HTML form in this setup, you can append a `log` query parameter, this will 
set `sessionStorage.setItem('ddg-autofill-debug', 'true')` and will output detailed information.
