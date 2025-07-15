## `debug/ui-debug.js`

The `debug/ui-debug.js` file can be used to test and iterate on any web UI displayed by the native applications. For example: the various prompts/tooltips that we support can be rendered and tested locally, without having to re-build native apps. This is to assist faster iteration and quick feedback loops on design implementation.

### Steps to build and view the tooltips:

```bash
npm install
npm run debug-ui
```

This will automatically:
1. Build necessary assets for the debug UI
2. Start a local server on port 3210
3. Open your browser at http://127.0.0.1:3210/debug/index.html

Alternatively, you can do it manually:
```bash
npm install
npm run build
npm run serve
then visit http://127.0.0.1:3210/debug/index.html
```

Translations can also be tested by passing the `locale` parameter.
For example: `http://127.0.0.1:3210/debug?locale=fr`.

Platforms can be also tested with the `platform` parameter.
For example: `http://127.0.0.1:3210/debug?platform=windows`.

### Icons Visualization

There's also a dedicated page for viewing and testing some of the icons used in the autofill feature:
```
http://127.0.0.1:3210/debug/icons.html
```

This page provides:
- Categorized display of all autofill icons (Password Management, Payment Methods, User Identity)
- Both default and filled (active) states of icons
- A dropdown to resize icons to different dimensions (16×16, 24×24, 32×32, 48×48)

You can run it with:
```bash
npm run debug-ui -- --icons
```

This command will directly open the icons visualization page in your browser.
