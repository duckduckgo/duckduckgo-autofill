## Debugging the Scanner

**On most occasions it's probably easier to debug using the steps outlined at [this page](https://app.asana.com/0/1200930669568058/1204279134793324/f). You can revert to this script for more complex needs.**

You can load our `Scanner.debug.js` script into any HTML file to inspect what's happening with the matching algorithms, form analysis etc.


The file `src/scanner-debug.html` is there as an example, inside there's this script tag:

```html
<!-- snip -->
<script type="module" src="./Scanner.debug.js"></script>
<!-- snip -->
```

That will load the Scanner and initialize it on the current document. You then just need to run a local webserver
to view the code in the browser's debugging tools.

```bash
# run this to install `serve` globally. This is **not** required if you have other ways of running servers!
npm i -g serve

# now serve the `src` folder as the root - this is required for the ESM imports to work correctly
serve src
```

You should now be presented with a file-listing of everything in `src` -> just click on `scanner-debug.html` to start
debugging :)
