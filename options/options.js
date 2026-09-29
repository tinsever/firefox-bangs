const PRESETS = [
  ["Google", "https://www.google.com/search?q={{{s}}}"],
  ["DuckDuckGo", "https://duckduckgo.com/?q={{{s}}}"],
  ["Bing", "https://www.bing.com/search?q={{{s}}}"],
  ["Brave Search", "https://search.brave.com/search?q={{{s}}}"],
  ["Kagi", "https://kagi.com/search?q={{{s}}}"],
  ["Startpage", "https://www.startpage.com/do/search?q={{{s}}}"],
  ["Ecosia", "https://www.ecosia.org/search?q={{{s}}}"],
  ["Qwant", "https://www.qwant.com/?q={{{s}}}"],
  ["Mojeek", "https://www.mojeek.com/search?q={{{s}}}"],
  ["Perplexity", "https://www.perplexity.ai/search?q={{{s}}}"],
];
const CUSTOM_ENGINE = "custom";

const $ = (sel) => document.querySelector(sel);
const engineSelect = $("#default-engine");
const defaultUrl = $("#default-url");
const customList = $("#custom-list");
const rowTemplate = $("#custom-row");

let settings = { ...DEFAULT_SETTINGS };

// users type %s (like Firefox keywords); stored templates use {{{s}}}
const toTemplate = (url) => url.trim().replaceAll("%s", "{{{s}}}");
const toDisplay = (template) => template.replaceAll("{{{s}}}", "%s");
const isValidTemplate = (template) => {
  if (!template.includes("{{{s}}}")) return false;
  try {
    return /^https?:$/.test(new URL(template.replaceAll("{{{s}}}", "x")).protocol);
  } catch {
    return false;
  }
};

let saveTimer, savedTimer;
function save() {
  updateTest();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    const saved = $("#saved");
    try {
      await browser.storage.sync.set(settings);
      saved.textContent = "Saved";
    } catch (e) {
      // storage.sync allows 8 KB per item – only hit with a huge custom list
      saved.textContent = `Couldn't save: ${e.message}`;
    }
    saved.hidden = false;
    clearTimeout(savedTimer);
    savedTimer = setTimeout(() => (saved.hidden = true), 2000);
  }, 300);
}

/* ---------- default engine ---------- */

for (const [name, url] of PRESETS) engineSelect.add(new Option(name, url));
engineSelect.add(new Option("Custom URL…", CUSTOM_ENGINE));

function renderDefault() {
  const preset = PRESETS.find(([, url]) => url === settings.defaultUrl);
  engineSelect.value = preset ? preset[1] : CUSTOM_ENGINE;
  defaultUrl.hidden = !!preset;
  if (!preset) defaultUrl.value = toDisplay(settings.defaultUrl);
}

engineSelect.addEventListener("change", () => {
  if (engineSelect.value === CUSTOM_ENGINE) {
    defaultUrl.hidden = false;
    defaultUrl.value = "";
    defaultUrl.focus();
    return;
  }
  defaultUrl.hidden = true;
  $("#default-error").hidden = true;
  settings.defaultUrl = engineSelect.value;
  save();
});

defaultUrl.addEventListener("input", () => {
  const template = toTemplate(defaultUrl.value);
  const valid = isValidTemplate(template);
  defaultUrl.setAttribute("aria-invalid", String(!valid && defaultUrl.value !== ""));
  $("#default-error").hidden = valid || defaultUrl.value === "";
  if (valid) {
    settings.defaultUrl = template;
    save();
  }
});

/* ---------- custom bangs ---------- */

function collectCustom() {
  const custom = {};
  for (const row of customList.querySelectorAll(".custom-row")) {
    const trigger = row.querySelector(".trigger");
    const url = row.querySelector(".url");
    const t = trigger.value.trim().replace(/^!/, "").toLowerCase();
    const template = toTemplate(url.value);
    const valid = isValidTemplate(template);
    url.setAttribute("aria-invalid", String(!valid && url.value !== ""));
    trigger.setAttribute("aria-invalid", String(/\s/.test(t)));
    if (t && !/\s/.test(t) && valid) custom[t] = template;
  }
  settings.custom = custom;
  save();
}

function addRow(trigger = "", template = "") {
  const row = rowTemplate.content.firstElementChild.cloneNode(true);
  row.querySelector(".trigger").value = trigger;
  row.querySelector(".url").value = toDisplay(template);
  row.addEventListener("input", collectCustom);
  row.querySelector(".remove").addEventListener("click", () => {
    row.remove();
    collectCustom();
  });
  customList.append(row);
  return row;
}

$("#add-custom").addEventListener("click", () => addRow().querySelector(".trigger").focus());

/* ---------- test box ---------- */

function updateTest() {
  const q = $("#test").value;
  $("#test-result").textContent = q.trim() ? `→ ${resolveBang(q, settings)}` : "Type a query to see where it goes.";
}
$("#test").addEventListener("input", updateTest);

/* ---------- init ---------- */

(async () => {
  settings = await browser.storage.sync.get(DEFAULT_SETTINGS);
  renderDefault();
  for (const [t, template] of Object.entries(settings.custom)) addRow(t, template);
  $("#bang-count").textContent = Object.keys(BANGS).length.toLocaleString();
})();
