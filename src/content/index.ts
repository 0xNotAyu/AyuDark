"use strict";
(() => {
  // src/shared/themes.ts
  var BUILTIN_TOKEN_THEMES = {
    darkGray: {
      bgNeutralPrimary: "#1a1a1a",
      bgNeutralSecondary: "#242424",
      bgNeutralTertiary: "#2a2a2a",
      bgNeutralQuaternary: "#3a3a3a",
      bgBrandPrimary: "#f2f2f2",
      bgBrandPrimaryHover: "#ffffff",
      bgAccentSecondary: "#1f3320",
      bgAccentSecondaryHover: "#274027",
      bgAccentTertiary: "#182a19",
      bgAccentQuaternary: "#101f12",
      bgErrorPrimary: "#c94a4a",
      bgErrorPrimaryHover: "#b63636",
      bgUtilityYellowPrimary: "#2b260f",
      bgUtilityBluePrimary: "#10202b",
      fgNeutralPrimary: "#e6e6e6",
      fgNeutralPrimaryHover: "#ffffff",
      fgNeutralSecondary: "#a8a8a8",
      fgNeutralSecondaryHover: "#cfcfcf",
      fgNeutralTertiary: "#1a1a1a",
      fgAccentPrimary: "#3fce3a",
      fgAccentPrimaryHover: "#5fe85a",
      fgErrorPrimary: "#ff6b6b",
      fgErrorPrimaryHover: "#ff8787",
      borderNeutralPrimary: "#3a3a3a",
      borderNeutralPrimaryHover: "#4a4a4a",
      borderNeutralSecondary: "#e6e6e6",
      borderNeutralSecondaryHover: "#ffffff",
      borderNeutralTertiary: "#333333",
      borderNeutralTertiaryHover: "#444444",
      borderBrandPrimary: "#e6e6e6",
      borderErrorPrimary: "#c94a4a",
      borderErrorPrimaryHover: "#b63636"
    },
    oledBlack: {
      bgNeutralPrimary: "#000000",
      bgNeutralSecondary: "#0d0d0d",
      bgNeutralTertiary: "#141414",
      bgNeutralQuaternary: "#262626",
      bgBrandPrimary: "#f2f2f2",
      bgBrandPrimaryHover: "#ffffff",
      bgAccentSecondary: "#122313",
      bgAccentSecondaryHover: "#1a301b",
      bgAccentTertiary: "#0e1c0f",
      bgAccentQuaternary: "#0a140b",
      bgErrorPrimary: "#c94a4a",
      bgErrorPrimaryHover: "#b63636",
      bgUtilityYellowPrimary: "#1f1b08",
      bgUtilityBluePrimary: "#0a1620",
      fgNeutralPrimary: "#f2f2f2",
      fgNeutralPrimaryHover: "#ffffff",
      fgNeutralSecondary: "#9a9a9a",
      fgNeutralSecondaryHover: "#c2c2c2",
      fgNeutralTertiary: "#000000",
      fgAccentPrimary: "#3fce3a",
      fgAccentPrimaryHover: "#5fe85a",
      fgErrorPrimary: "#ff6b6b",
      fgErrorPrimaryHover: "#ff8787",
      borderNeutralPrimary: "#262626",
      borderNeutralPrimaryHover: "#333333",
      borderNeutralSecondary: "#f2f2f2",
      borderNeutralSecondaryHover: "#ffffff",
      borderNeutralTertiary: "#1f1f1f",
      borderNeutralTertiaryHover: "#2c2c2c",
      borderBrandPrimary: "#f2f2f2",
      borderErrorPrimary: "#c94a4a",
      borderErrorPrimaryHover: "#b63636"
    },
    claude: {
      bgNeutralPrimary: "#1a1614",
      bgNeutralSecondary: "#241e1a",
      bgNeutralTertiary: "#2a2320",
      bgNeutralQuaternary: "#3a322c",
      bgBrandPrimary: "#cc785c",
      bgBrandPrimaryHover: "#d98a70",
      bgAccentSecondary: "#2e2119",
      bgAccentSecondaryHover: "#3a2a1f",
      bgAccentTertiary: "#261c15",
      bgAccentQuaternary: "#1e1610",
      bgErrorPrimary: "#c94a4a",
      bgErrorPrimaryHover: "#b63636",
      bgUtilityYellowPrimary: "#2b260f",
      bgUtilityBluePrimary: "#101f2a",
      fgNeutralPrimary: "#f2e9df",
      fgNeutralPrimaryHover: "#ffffff",
      fgNeutralSecondary: "#b8a99a",
      fgNeutralSecondaryHover: "#d4c6b8",
      fgNeutralTertiary: "#1a1614",
      fgAccentPrimary: "#e0996f",
      fgAccentPrimaryHover: "#eeb18f",
      fgErrorPrimary: "#ff8080",
      fgErrorPrimaryHover: "#ff9999",
      borderNeutralPrimary: "#3a322c",
      borderNeutralPrimaryHover: "#4a4038",
      borderNeutralSecondary: "#f2e9df",
      borderNeutralSecondaryHover: "#ffffff",
      borderNeutralTertiary: "#332b25",
      borderNeutralTertiaryHover: "#453b33",
      borderBrandPrimary: "#cc785c",
      borderErrorPrimary: "#c94a4a",
      borderErrorPrimaryHover: "#b63636"
    }
  };
  var DEFAULT_CUSTOM_SEED = {
    bg: "#1a1a1a",
    text: "#e6e6e6",
    accent: "#7c5cff"
  };
  function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
    const num = parseInt(full, 16);
    return [num >> 16 & 255, num >> 8 & 255, num & 255];
  }
  function rgbToHex([r, g, b]) {
    const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
    return "#" + [r, g, b].map((c) => clamp(c).toString(16).padStart(2, "0")).join("");
  }
  function mix(hex, target, amount) {
    const a = hexToRgb(hex);
    const b = hexToRgb(target);
    const blended = [
      a[0] + (b[0] - a[0]) * amount,
      a[1] + (b[1] - a[1]) * amount,
      a[2] + (b[2] - a[2]) * amount
    ];
    return rgbToHex(blended);
  }
  var lighten = (hex, amount) => mix(hex, "#ffffff", amount);
  function relativeLuminance(hex) {
    const [r, g, b] = hexToRgb(hex).map((c) => c / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  var isLight = (hex) => relativeLuminance(hex) > 0.5;
  function deriveTokensFromSeed(seed) {
    const { bg, text, accent } = seed;
    const towardText = (h, amount) => isLight(bg) ? mix(h, text, amount) : lighten(h, amount);
    const bgSecondary = towardText(bg, 0.08);
    const bgTertiary = towardText(bg, 0.14);
    const bgQuaternary = towardText(bg, 0.28);
    const textMuted = mix(text, bg, 0.4);
    const border = towardText(bg, 0.18);
    const borderHover = towardText(bg, 0.26);
    const accentHover = lighten(accent, 0.12);
    const onAccentText = isLight(accent) ? "#1a1a1a" : "#ffffff";
    return {
      bgNeutralPrimary: bg,
      bgNeutralSecondary: bgSecondary,
      bgNeutralTertiary: bgTertiary,
      bgNeutralQuaternary: bgQuaternary,
      bgBrandPrimary: accent,
      bgBrandPrimaryHover: accentHover,
      bgAccentSecondary: mix(accent, bg, 0.8),
      bgAccentSecondaryHover: mix(accent, bg, 0.7),
      bgAccentTertiary: mix(accent, bg, 0.85),
      bgAccentQuaternary: mix(accent, bg, 0.9),
      bgErrorPrimary: "#c94a4a",
      bgErrorPrimaryHover: "#b63636",
      bgUtilityYellowPrimary: mix("#fffae1", bg, 0.85),
      bgUtilityBluePrimary: mix("#e5f2ff", bg, 0.85),
      fgNeutralPrimary: text,
      fgNeutralPrimaryHover: isLight(bg) ? mix(text, "#000000", 0.2) : lighten(text, 0.15),
      fgNeutralSecondary: textMuted,
      fgNeutralSecondaryHover: mix(textMuted, text, 0.4),
      fgNeutralTertiary: onAccentText,
      fgAccentPrimary: accent,
      fgAccentPrimaryHover: accentHover,
      fgErrorPrimary: "#ff6b6b",
      fgErrorPrimaryHover: "#ff8787",
      borderNeutralPrimary: border,
      borderNeutralPrimaryHover: borderHover,
      borderNeutralSecondary: text,
      borderNeutralSecondaryHover: mix(text, "#ffffff", 0.2),
      borderNeutralTertiary: border,
      borderNeutralTertiaryHover: borderHover,
      borderBrandPrimary: accent,
      borderErrorPrimary: "#c94a4a",
      borderErrorPrimaryHover: "#b63636"
    };
  }
  function tokensToCssVars(t) {
    const kebab = (s) => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
    return Object.entries(t).map(([key, value]) => `--color-${kebab(key)}: ${value};`).join("\n      ");
  }

  // src/shared/storage.ts
  var DEFAULT_SETTINGS = {
    mode: "system",
    themeId: "darkGray",
    customSeed: DEFAULT_CUSTOM_SEED
  };
  var STORAGE_KEY = "ayudark_settings";
  function area() {
    return chrome.storage.sync ?? chrome.storage.local;
  }
  async function getSettings() {
    try {
      const result = await area().get(STORAGE_KEY);
      const stored = result[STORAGE_KEY];
      return { ...DEFAULT_SETTINGS, ...stored };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
  function onSettingsChanged(callback) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "sync" && areaName !== "local") return;
      const change = changes[STORAGE_KEY];
      if (!change) return;
      callback({ ...DEFAULT_SETTINGS, ...change.newValue });
    });
  }

  // src/content/index.ts
  var LOG_PREFIX = "[ayuDark]";
  var STYLE_ID = "ayudark-style";
  var BOOT_STYLE_ID = "ayudark-boot";
  function injectBootStyle() {
    if (document.getElementById(BOOT_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = BOOT_STYLE_ID;
    style.textContent = `html { background: #141414 !important; }`;
    document.documentElement.appendChild(style);
  }
  function resolveTokens(settings) {
    return settings.themeId === "custom" ? deriveTokensFromSeed(settings.customSeed) : BUILTIN_TOKEN_THEMES[settings.themeId];
  }
  function systemPrefersDark() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function isDarkActive(settings) {
    if (settings.mode === "off") return false;
    if (settings.mode === "on") return true;
    return systemPrefersDark();
  }
  var EDITOR_CLASS = "ayudark-editor";
  function isEditorRoute(pathname) {
    const match = /^\/new-story(\/|$)/.test(pathname) || /^\/p\/[^/]+\/edit(\/|$)/.test(pathname);
    console.log(LOG_PREFIX, "isEditorRoute check:", { pathname, match });
    return match;
  }
  var EDITOR_FORCE_BG_SELECTORS = [".site-main", ".screenContent", ".surface"];
  var EDITOR_TRANSPARENT_SELECTORS = [".canvas-renderer"];
  var currentTokens = null;
  function forceEditorBackgrounds(tokens) {
    EDITOR_FORCE_BG_SELECTORS.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.style.setProperty("background", tokens.bgNeutralPrimary, "important");
        el.style.setProperty("background-color", tokens.bgNeutralPrimary, "important");
        el.style.setProperty("background-image", "none", "important");
        el.style.setProperty("color", tokens.fgNeutralPrimary, "important");
      });
    });
    /* .canvas-renderer is a fixed, full-viewport, pointer-events:none layer
       Medium uses for text-selection rendering. Its own CSS hardcodes
       background:#fff, so it visually paints over everything underneath
       it (including the containers above, even once they're dark) even
       though clicks pass through it. Make it transparent instead of
       matching our theme color, since it's an overlay, not real page
       chrome — showing the real background through it is correct. */
    EDITOR_TRANSPARENT_SELECTORS.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.style.setProperty("background", "transparent", "important");
        el.style.setProperty("background-color", "transparent", "important");
        el.style.setProperty("background-image", "none", "important");
      });
    });
  }
  function clearForcedEditorBackgrounds() {
    EDITOR_FORCE_BG_SELECTORS.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.style.removeProperty("background");
        el.style.removeProperty("background-color");
        el.style.removeProperty("background-image");
        el.style.removeProperty("color");
      });
    });
    EDITOR_TRANSPARENT_SELECTORS.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.style.removeProperty("background");
        el.style.removeProperty("background-color");
        el.style.removeProperty("background-image");
      });
    });
  }
  function setupEditorBackgroundObserver() {
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (!currentTokens || !isEditorRoute(location.pathname)) return;
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        forceEditorBackgrounds(currentTokens);
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    return observer;
  }
  function buildStylesheet(tokens) {
    const vars = tokensToCssVars(tokens);
    return `
    :root {
      ${vars}
      color-scheme: dark;
    }

    body {
      color: var(--color-fg-neutral-primary) !important;
    }

    a[data-testid="headerMediumLogo"] path {
      fill: var(--color-fg-neutral-primary) !important;
    }

    path[fill="black"], path[fill="#000"], path[fill="#000000"] {
      fill: var(--color-fg-neutral-primary) !important;
    }

    ::selection {
      background: var(--color-fg-accent-primary);
      color: var(--color-bg-neutral-primary);
    }

    * {
      scrollbar-color: var(--color-border-neutral-primary) var(--color-bg-neutral-primary);
    }

    :focus-visible {
      outline: 2px solid var(--color-border-neutral-secondary) !important;
      outline-offset: 1px;
    }

    /* --- Legacy editor route (medium.com/new-story, /p/*/edit) ---
       Every value below is taken directly from Medium's real shipped
       stylesheet (main-branding-base), not guessed. Scoped under
       html.ayudark-editor, which we set ourselves from the URL in
       applyTheme() \u2014 see isEditorRoute(). No invert filter, explicit
       overrides only. */

    /* Page shell: .site-main and .screenContent both hardcode
       background:#fff / background-color:#fff with no class guard, so they
       need a direct override rather than something we could pick up via
       tokens. */
    html.${EDITOR_CLASS} .site-main,
    html.${EDITOR_CLASS} .screenContent,
    html.${EDITOR_CLASS} .surface {
      background: var(--color-bg-neutral-primary) !important;
      color: var(--color-fg-neutral-primary) !important;
    }

    /* .metabar (top toolbar under the header): background:#fff,
       color:rgba(0,0,0,.54) */
    html.${EDITOR_CLASS} .metabar {
      background: var(--color-bg-neutral-primary) !important;
      color: var(--color-fg-neutral-secondary) !important;
      border-bottom: 1px solid var(--color-border-neutral-primary) !important;
    }
    html.${EDITOR_CLASS} .metabar .popover {
      color: var(--color-fg-neutral-primary) !important;
    }

    /* Semi-opaque white overlay fills used by metabar/popover chrome */
    html.${EDITOR_CLASS} .u-backgroundTransparentWhiteDark,
    html.${EDITOR_CLASS} .u-backgroundTransparentWhiteDarker,
    html.${EDITOR_CLASS} .u-backgroundTransparentWhiteDarkest,
    html.${EDITOR_CLASS} .u-backgroundGrayLight,
    html.${EDITOR_CLASS} .u-backgroundColorGrayLight {
      background: var(--color-bg-neutral-secondary) !important;
    }

    /* real u-textColor* utility values, remapped to our theme tokens.
       .84/.9 -> primary, .54/.68 -> secondary, .15/.3 -> border (faint) */
    html.${EDITOR_CLASS} .u-textColorDarker,
    html.${EDITOR_CLASS} .u-textColorDarkest {
      color: var(--color-fg-neutral-primary) !important;
    }
    html.${EDITOR_CLASS} .u-textColorNormal,
    html.${EDITOR_CLASS} .u-textColorDark {
      color: var(--color-fg-neutral-secondary) !important;
    }
    html.${EDITOR_CLASS} .u-textColorLight,
    html.${EDITOR_CLASS} .u-textColorLighter {
      color: var(--color-border-neutral-primary) !important;
    }

    /* The writing surface itself. .postArticle-content has no background
       rule (already transparent) \u2014 kept here defensively in case a parent
       sets one. */
    html.${EDITOR_CLASS} .postArticle-content,
    html.${EDITOR_CLASS} .section-content {
      background: transparent !important;
      color: var(--color-fg-neutral-primary) !important;
      caret-color: var(--color-fg-accent-primary) !important;
    }

    /* Title/headings: real rule is ".graf--h2,.graf--h3,.graf--h4 {color:
       rgba(0,0,0,.84)}" \u2014 this is the actual bug in your screenshot: the
       big story title uses this rule, not body's color, so it rendered as
       near-black-on-white while we only fixed body text elsewhere. */
    html.${EDITOR_CLASS} .graf--title,
    html.${EDITOR_CLASS} .graf--h2,
    html.${EDITOR_CLASS} .graf--h3,
    html.${EDITOR_CLASS} .graf--h4 {
      color: var(--color-fg-neutral-primary) !important;
    }
    /* Subtitle/kicker: real rule is ".graf--kicker,.graf--subtitle {color:
       rgba(0,0,0,.54)}" \u2014 this is the second line in your screenshot. */
    html.${EDITOR_CLASS} .graf--subtitle,
    html.${EDITOR_CLASS} .graf--kicker {
      color: var(--color-fg-neutral-secondary) !important;
    }
    /* Pullquote (rgba(0,0,0,.68)) and blockquote left-border
       (rgba(0,0,0,.84)) are also hardcoded, not inherited from body. */
    html.${EDITOR_CLASS} .graf--pullquote {
      color: var(--color-fg-neutral-secondary) !important;
    }
    html.${EDITOR_CLASS} .graf--blockquote {
      border-left-color: var(--color-border-neutral-primary) !important;
    }
    /* Placeholder text shown in empty grafs (title/subtitle/body prompts):
       real rule is ".defaultValue {color:#b3b3b1}". */
    html.${EDITOR_CLASS} .defaultValue {
      color: var(--color-fg-neutral-secondary) !important;
    }

    /* Icons: only fix icons with NO explicit fill attribute (those default
       to plain black and vanish on a dark bg). Icons that already set an
       explicit fill (e.g. the green add-image/video/embed icons, #1a8917)
       are left alone \u2014 that green already reads fine on dark. */
    html.${EDITOR_CLASS} svg path:not([fill]) {
      fill: var(--color-fg-neutral-primary) !important;
    }

    /* Toolbar/menu buttons: base .button real rule is
       "color:rgba(0,0,0,.54)" (icons and text alike inherit this via
       currentColor) \u2014 this was completely unhandled before, so every plain
       .button (not just --chromeless/--dark) rendered dark-gray-on-white. */
    html.${EDITOR_CLASS} .button {
      color: var(--color-fg-neutral-secondary) !important;
    }
    html.${EDITOR_CLASS} .button:hover,
    html.${EDITOR_CLASS} .button:active,
    html.${EDITOR_CLASS} .button:focus,
    html.${EDITOR_CLASS} .button--chromeless {
      color: var(--color-fg-neutral-primary) !important;
    }
    html.${EDITOR_CLASS} .button--dark {
      border-color: var(--color-border-neutral-primary) !important;
      color: var(--color-fg-neutral-primary) !important;
    }
    html.${EDITOR_CLASS} .avatar-image {
      border: 1px solid var(--color-border-neutral-primary) !important;
    }

    /* Insert-content toolbar (+ / image / video / code / embed / close
       buttons that appear on an empty paragraph). These use Medium's
       hardcoded brand green (#1a8917 / #03a87c) via explicit fill/stroke
       attributes and border-color, which our generic "icons with no
       explicit fill" rule intentionally skips \u2014 so they stay green
       unless targeted directly here. Recolor the green to the theme's
       off-white, and give the circle itself a light-black box instead of
       a transparent one. */
    html.${EDITOR_CLASS} svg path[fill="#1a8917"],
    html.${EDITOR_CLASS} svg path[fill="#03a87c"],
    html.${EDITOR_CLASS} svg circle[stroke="#1a8917"],
    html.${EDITOR_CLASS} svg path[stroke="#1a8917"],
    html.${EDITOR_CLASS} svg circle[stroke="#03a87c"],
    html.${EDITOR_CLASS} svg path[stroke="#03a87c"] {
      fill: var(--color-border-neutral-secondary) !important;
      stroke: var(--color-border-neutral-secondary) !important;
    }
    html.${EDITOR_CLASS} .button--primary,
    html.${EDITOR_CLASS} .button--circle {
      border-color: var(--color-border-neutral-primary) !important;
      background: var(--color-bg-neutral-secondary) !important;
      color: var(--color-border-neutral-secondary) !important;
    }
    html.${EDITOR_CLASS} .button--primary .svgIcon,
    html.${EDITOR_CLASS} .button--circle .svgIcon {
      fill: var(--color-border-neutral-secondary) !important;
    }

    /* Floating format toolbar (highlightMenu) already ships a dark
       gradient background (rgba(49,49,47,.99) -> #262625) in Medium's own
       CSS regardless of theme, so it doesn't strictly need an override \u2014
       kept for visual consistency with the rest of the skin. .drawer-inner
       has no real background rule to confirm (layout-only, hidden until
       triggered), left as a best-effort fallback. */
    html.${EDITOR_CLASS} .highlightMenu-inner,
    html.${EDITOR_CLASS} .drawer-inner {
      background: var(--color-bg-neutral-secondary) !important;
      border: 1px solid var(--color-border-neutral-primary) !important;
    }
    html.${EDITOR_CLASS} .highlightMenu-arrow {
      border-top-color: var(--color-bg-neutral-secondary) !important;
    }
  `.trim();
  }
  function logMatchingRules(el, label) {
    console.log(LOG_PREFIX, `--- all stylesheet rules matching ${label} (in document order) ---`);
    Array.from(document.styleSheets).forEach((sheet, sheetIdx) => {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch (e) {
        console.log(LOG_PREFIX, `sheet[${sheetIdx}] (${sheet.href ?? "inline"}) \u2014 cannot read cssRules (cross-origin):`, e);
        return;
      }
      if (!rules) return;
      Array.from(rules).forEach((rule, ruleIdx) => {
        if (!(rule instanceof CSSStyleRule)) return;
        let matches = false;
        try {
          matches = el.matches(rule.selectorText);
        } catch {
          return;
        }
        if (!matches) return;
        const bg = rule.style.background || rule.style.backgroundColor;
        if (!bg) return;
        console.log(
          LOG_PREFIX,
          `sheet[${sheetIdx}] rule[${ruleIdx}]`,
          `(${sheet.href ?? sheet.ownerNode?.id ?? "inline"})`,
          "selector:",
          rule.selectorText,
          "| background decl:",
          bg,
          "| important:",
          rule.style.getPropertyPriority("background") === "important" || rule.style.getPropertyPriority("background-color") === "important"
        );
      });
    });
    console.log(LOG_PREFIX, `--- end matching rules for ${label} ---`);
  }
  function probeEditorDom() {
    const candidates = [
      ".site-main",
      ".screenContent",
      ".surface",
      ".metabar",
      ".postArticle-content",
      ".graf--title",
      ".graf--h2",
      ".graf--h3",
      ".graf--subtitle",
      ".defaultValue"
    ];
    console.log(LOG_PREFIX, "--- DOM probe: do our target selectors exist on this page? ---");
    candidates.forEach((sel) => {
      const el = document.querySelector(sel);
      console.log(LOG_PREFIX, sel, "->", el ? "FOUND" : "NOT FOUND", el ?? "");
    });
    console.log(LOG_PREFIX, "--- computed backgrounds (ground truth, ignores our theories about cascade) ---");
    const rootVarValue = getComputedStyle(document.documentElement).getPropertyValue("--color-bg-neutral-primary").trim();
    console.log(LOG_PREFIX, "--color-bg-neutral-primary resolves to:", rootVarValue || "(EMPTY \u2014 variable not defined!)");
    [document.documentElement, document.body, ...candidates.map((s) => document.querySelector(s))].forEach((el) => {
      if (!el) return;
      const tag = el === document.documentElement ? "<html>" : el === document.body ? "<body>" : el.className;
      const cs = getComputedStyle(el);
      const inlineStyle = el.getAttribute?.("style") ?? "";
      console.log(
        LOG_PREFIX,
        String(tag).padEnd(40),
        "bg:",
        cs.backgroundColor,
        "| bg-image:",
        cs.backgroundImage.slice(0, 40),
        "| inline style attr:",
        inlineStyle || "(none)"
      );
    });
    const styleTags = document.querySelectorAll(`#${STYLE_ID}`);
    console.log(LOG_PREFIX, "#" + STYLE_ID + " tag count:", styleTags.length);
    console.log(LOG_PREFIX, "is our style tag the last child of <html>?", document.documentElement.lastElementChild?.id === STYLE_ID);
    console.log(LOG_PREFIX, "total <style> + <link rel=stylesheet> on page:", document.querySelectorAll("style, link[rel=stylesheet]").length);
    const titleEl = document.querySelector('[data-testid="storyTitle"], h1, h3[data-testid], .graf--title, [contenteditable] h3, [contenteditable] h1');
    if (titleEl) {
      const cs = getComputedStyle(titleEl);
      console.log(LOG_PREFIX, "probable title element:", titleEl);
      console.log(LOG_PREFIX, "title element className:", JSON.stringify(titleEl.className));
      console.log(LOG_PREFIX, "title element tagName:", titleEl.tagName);
      console.log(LOG_PREFIX, "title computed color:", cs.color, "| computed background-color:", cs.backgroundColor);
      let ancestor = titleEl.parentElement;
      let depth = 0;
      while (ancestor && depth < 10) {
        const acs = getComputedStyle(ancestor);
        console.log(
          LOG_PREFIX,
          `ancestor[${depth}]`,
          ancestor.tagName,
          JSON.stringify(ancestor.className),
          "bg:",
          acs.backgroundColor
        );
        ancestor = ancestor.parentElement;
        depth++;
      }
    } else {
      console.log(LOG_PREFIX, "could not find a title element by any guessed selector.");
    }
    console.log(LOG_PREFIX, "--- end DOM probe ---");
    const siteMainEl = document.querySelector(".site-main");
    const screenContentEl = document.querySelector(".screenContent");
    const surfaceEl = document.querySelector(".surface");
    if (siteMainEl) logMatchingRules(siteMainEl, ".site-main");
    if (screenContentEl) logMatchingRules(screenContentEl, ".screenContent");
    if (surfaceEl) logMatchingRules(surfaceEl, ".surface");
  }
  function applyTheme(settings) {
    console.log(LOG_PREFIX, "applyTheme() called with settings:", settings);
    const existing = document.getElementById(STYLE_ID);
    const editorRoute = isEditorRoute(location.pathname);
    document.documentElement.classList.toggle(EDITOR_CLASS, editorRoute);
    console.log(
      LOG_PREFIX,
      `html.${EDITOR_CLASS} class is now:`,
      document.documentElement.classList.contains(EDITOR_CLASS),
      "| full class list:",
      document.documentElement.className
    );
    const darkActive = isDarkActive(settings);
    console.log(LOG_PREFIX, "isDarkActive:", darkActive, "(mode:", settings.mode, ")");
    if (!darkActive) {
      console.log(LOG_PREFIX, "dark mode is OFF \u2014 removing style tag if present, bailing out.");
      existing?.remove();
      document.documentElement.removeAttribute("data-ayudark");
      clearForcedEditorBackgrounds();
      currentTokens = null;
      return;
    }
    const tokens = resolveTokens(settings);
    currentTokens = tokens;
    const css = buildStylesheet(tokens);
    console.log(
      LOG_PREFIX,
      "built stylesheet, length:",
      css.length,
      "| contains editor rules:",
      css.includes(`html.${EDITOR_CLASS}`)
    );
    if (existing instanceof HTMLStyleElement) {
      existing.textContent = css;
      document.documentElement.appendChild(existing);
      console.log(LOG_PREFIX, "updated existing #" + STYLE_ID + " tag and re-appended to <html>.");
    } else {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = css;
      document.documentElement.appendChild(style);
      console.log(LOG_PREFIX, "created new #" + STYLE_ID + " tag and appended to <html>.");
    }
    document.documentElement.setAttribute("data-ayudark", settings.themeId);
    console.log(LOG_PREFIX, "applyTheme() done. data-ayudark =", settings.themeId);
    if (editorRoute) {
      forceEditorBackgrounds(tokens);
      console.log(LOG_PREFIX, "forced inline backgrounds on", EDITOR_FORCE_BG_SELECTORS.join(", "));
      setTimeout(probeEditorDom, 500);
    }
  }
  function watchSpaNavigation(onNavigate) {
    const wrap = (fn) => function(...args) {
      const result = fn.apply(this, args);
      onNavigate();
      return result;
    };
    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener("popstate", onNavigate);
  }
  async function main() {
    console.log(LOG_PREFIX, "content script booted. location:", location.href);
    injectBootStyle();
    setupEditorBackgroundObserver();
    let settings = await getSettings();
    console.log(LOG_PREFIX, "loaded settings from storage:", settings);
    applyTheme(settings);
    onSettingsChanged((updated) => {
      console.log(LOG_PREFIX, "settings changed via storage listener:", updated);
      settings = updated;
      applyTheme(settings);
    });
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      console.log(LOG_PREFIX, "OS prefers-color-scheme changed.");
      if (settings.mode === "system") applyTheme(settings);
    });
    watchSpaNavigation(() => {
      console.log(LOG_PREFIX, "SPA navigation detected, new pathname:", location.pathname);
      applyTheme(settings);
    });
    console.log("End of main functions")
  }
  main();
})();