# Local Bangs

A tiny Firefox extension that resolves DuckDuckGo-style `!bangs` locally.

Set [unduck.link](https://unduck.link) (`https://unduck.link?q=%s`) as your default search engine. The extension
catches that request before it leaves the browser and redirects straight to the target site, so unduck's page is
never loaded. All ~13.5k bangs from [DuckDuckGo's bang list](https://duckduckgo.com/bang.js) are bundled, so lookups
work offline and take about a microsecond.

If the extension is disabled, searches just fall through to the real unduck.link, so searching never breaks.

## Behaviour

Same rules as unduck:

| Query                | Goes to                                             |
| -------------------- | --------------------------------------------------- |
| `!yt lofi`           | YouTube search for "lofi"                           |
| `lofi !yt`           | same – the bang can be anywhere                     |
| `!YT lofi`           | same – bangs are case-insensitive                   |
| `!yt`                | youtube.com (bang on its own → site homepage)       |
| `!gh owner/repo`     | GitHub search, slashes kept readable                |
| `anything else`      | Google (default, change `DEFAULT_BANG`)             |
| `!unknownbang foo`   | Google search for "foo"                             |

## Custom bangs

Add your own (or override existing ones) in `background.js`:

```js
const CUSTOM = {
  ghr: "https://github.com/{{{s}}}",
};
```

`{{{s}}}` is replaced with the URL-encoded search terms.

## Build

```sh
./build.sh   # downloads the latest bang list, regenerates bangs.js, packages local-bangs.zip
```

## Install

Firefox Release only installs signed extensions. Sign it as an unlisted (private) add-on with your
[AMO API key](https://addons.mozilla.org/developers/addon/api/key/):

```sh
WEB_EXT_API_KEY=… WEB_EXT_API_SECRET=… \
  npx web-ext sign --channel=unlisted --source-dir . --artifacts-dir signed \
  --ignore-files bangs-ddg.json local-bangs.zip build.sh signed
```

Then open the `.xpi` from `signed/` in Firefox. Bump `version` in `manifest.json` before re-signing.

For a quick test without signing, load `manifest.json` via `about:debugging` → *This Firefox* → *Load Temporary Add-on*
(removed on restart).

Note: if you fork this, change the extension id in `manifest.json` – the current one is already registered on AMO.
