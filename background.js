// Local Bangs – resolves !bangs inside Firefox.
//
// The extension adds a "Local Bangs" search engine whose URL is
// https://duckduckgo.com/?q=…&localbangs=1. That request is intercepted before
// it leaves the browser and redirected straight to the target site. If the
// extension ever fails, DuckDuckGo still handles the bang itself.
//
// Searches to https://unduck.link?q=… are intercepted the same way, so an
// existing unduck setup becomes instant too.

const MARKER = "localbangs";

let settings = { ...DEFAULT_SETTINGS };

async function loadSettings() {
  settings = await browser.storage.sync.get(DEFAULT_SETTINGS);
}
loadSettings();
browser.storage.onChanged.addListener((_, area) => {
  if (area === "sync") loadSettings();
});

browser.webRequest.onBeforeRequest.addListener(
  ({ url }) => {
    const u = new URL(url);
    // only our own engine's searches – normal duckduckgo.com use is untouched
    if (u.hostname === "duckduckgo.com" && !u.searchParams.has(MARKER)) return {};

    const q = u.searchParams.get("q");
    if (!q?.trim()) return {};
    return { redirectUrl: resolveBang(q, settings) };
  },
  { urls: ["https://duckduckgo.com/*", "https://unduck.link/*"], types: ["main_frame"] },
  ["blocking"],
);
