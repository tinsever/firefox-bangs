# AMO listing – Local Bangs

## Name
Local Bangs

## Summary (max 250 chars)
Instant DuckDuckGo-style !bangs, resolved inside Firefox. Type "!yt lofi" or "!w berlin" in the address bar and go straight to the site – no redirect page, no server, works offline.

## Description
Bangs are shortcuts that send a search straight to another site: <b>!yt</b> searches YouTube, <b>!w</b> Wikipedia, <b>!gh</b> GitHub, <b>!a</b> Amazon – over 13,000 of them.

Normally a bang goes to a search engine first, which then redirects you. <b>Local Bangs resolves them inside Firefox before any request is made</b>, so you land on the target site immediately.

<b>How it works</b>
• Installs a "Local Bangs" search engine – accept the prompt to make it your default
• Type a bang anywhere in your query: <i>!yt lofi</i>, <i>lofi !yt</i>, <i>!YT lofi</i>
• A bang on its own (<i>!yt</i>) opens the site's homepage
• Queries without a bang go to your default engine: Google, DuckDuckGo, Bing, Brave, Kagi, Startpage, Ecosia, Qwant, Mojeek, Perplexity or any custom URL
• Add your own bangs or override built-in ones on the settings page, with a live "try it" box
• Also makes <i>unduck.link</i> searches instant if you already use it

<b>Private by design</b>
• No data collection, no analytics, no remote server
• The full bang list ships with the extension – lookups happen locally and work offline
• If the extension is ever disabled, the search engine falls back to DuckDuckGo, which understands bangs natively

Bang list from DuckDuckGo (duckduckgo.com/bangs). Open source (MIT): https://github.com/tinsever/firefox-bangs

## Category
Search Tools

## Tags
search, privacy

## License
MIT

## Homepage / Support
https://github.com/tinsever/firefox-bangs
https://github.com/tinsever/firefox-bangs/issues

## Notes for reviewers
bangs.js is generated data, not code: it is DuckDuckGo's public bang list
(https://duckduckgo.com/bang.js) converted to a { trigger: [urlTemplate, domain] } map by build.sh
(python3, no dependencies). To reproduce: ./build.sh (or ./build.sh --offline with bangs-ddg.json).

How it works: the extension registers a search engine whose URL is
https://duckduckgo.com/?q={searchTerms}&localbangs=1. A blocking webRequest listener catches only
main_frame requests carrying that marker (or to unduck.link) and redirects to the resolved target.
Normal duckduckgo.com browsing is never touched. No data is collected or sent anywhere by the
extension; the only network requests are the user's own navigation and Firefox's standard search
suggestions (DuckDuckGo suggest endpoint, controlled by the user's Firefox suggestion settings).
