<p align="center"><img src="icons/icon.svg" width="96" alt=""></p>

# Local Bangs

Instant DuckDuckGo-style `!bangs`, resolved inside Firefox – no redirect page, no server, works offline.

Normally a bang goes to a search engine first, which then redirects you. Local Bangs resolves it **before any request
is made**, so you land on the target site immediately. All ~13.5k bangs from
[DuckDuckGo's bang list](https://duckduckgo.com/bangs) ship with the extension; a lookup takes about a microsecond.

## How it works

The extension adds a **Local Bangs** search engine (Firefox asks on install whether to make it the default). Its URL
is `https://duckduckgo.com/?q=…&localbangs=1`; a blocking `webRequest` listener catches only requests carrying that
marker and redirects to the resolved target. Normal duckduckgo.com browsing is untouched, and if the extension is ever
disabled, DuckDuckGo still handles the bang itself.

Searches to [unduck.link](https://unduck.link) are resolved the same way, so an existing unduck setup becomes instant.

| Query              | Goes to                                                |
| ------------------ | ------------------------------------------------------ |
| `!yt lofi`         | YouTube search for "lofi"                              |
| `lofi !yt`         | same – the bang can be anywhere                        |
| `!YT lofi`         | same – bangs are case-insensitive                      |
| `!yt`              | youtube.com – a bang on its own opens the homepage     |
| `!gh owner/repo`   | GitHub search, slashes kept readable                   |
| `anything else`    | your default engine                                    |
| `!important css`   | default engine, unchanged – unknown bangs are kept     |
| `wow!` / `a!b`     | default engine – a bang must start a word              |

## Settings

Open the add-on's preferences (`about:addons` → Local Bangs → Preferences):

- **Default search engine** for queries without a bang – Google, DuckDuckGo, Bing, Brave, Kagi, Startpage, Ecosia,
  Qwant, Mojeek, Perplexity, or any URL with `%s`
- **Custom bangs** – add your own or override built-in ones (e.g. `!ghr` → `https://github.com/%s`)
- **Try it** – type a query and see where it goes

Settings are stored with `storage.sync`, so they follow your Firefox account.

## Build

```sh
./build.sh            # download the latest bang list, regenerate bangs.js, package local-bangs.zip
./build.sh --offline  # same, using the existing bangs-ddg.json
```

`bangs.js` is generated data (committed so the repo can be loaded as-is) – don't edit it by hand.

## Install from source

For a quick test, load `manifest.json` via `about:debugging` → *This Firefox* → *Load Temporary Add-on* (removed on
restart). For a permanent install on Firefox Release, sign it as an unlisted add-on with your
[AMO API key](https://addons.mozilla.org/developers/addon/api/key/):

```sh
WEB_EXT_API_KEY=… WEB_EXT_API_SECRET=… \
  npx web-ext sign --channel=unlisted --source-dir . --artifacts-dir signed \
  --ignore-files bangs-ddg.json local-bangs.zip build.sh signed amo README.md
```

If you fork this, change the extension id in `manifest.json` – the current one is registered on AMO.

## License

MIT. The bundled bang list is DuckDuckGo's public bang data and is not covered by this license.
