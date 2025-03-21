## `debug/ui-debug.js`

The `debug/ui-debug.js` file can be used to test and iterate on any web UI displayed by the native applications. For example: the various prompts/tooltips that we support can be rendered and tested locally, without having to re-build native apps. This is to assist faster iteration and quick feedback loops on design implementation.

### Steps to build and view the tooltips:

```
npm install
npm run build
npm run serve
then visit http://127.0.0.1:3210/debug?locale=<locale>
```

Translations can also be tested by passing the `locale` parameter. For example: `http://127.0.0.1:3210/debug?locale=fr`.
