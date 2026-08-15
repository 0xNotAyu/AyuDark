import { BUILTIN_TOKEN_THEMES, deriveTokensFromSeed, tokensToCssVars, MediumTokens } from "../shared/themes";
import { getSettings, onSettingsChanged, Settings } from "../shared/storage";

const STYLE_ID = "ayudark-style";
const BOOT_STYLE_ID = "ayudark-boot"; // tiny blocking style injected before anything else, kills FOUC

/**
 * Injected the instant the script runs (document_start), before Medium's own
 * stylesheets paint. Just enough to stop a flash of white while we resolve
 * settings + tokens below.
 */
function injectBootStyle() {
  if (document.getElementById(BOOT_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = BOOT_STYLE_ID;
  style.textContent = `html { background: #141414 !important; }`;
  document.documentElement.appendChild(style);
}

function resolveTokens(settings: Settings): MediumTokens {
  return settings.themeId === "custom"
    ? deriveTokensFromSeed(settings.customSeed)
    : BUILTIN_TOKEN_THEMES[settings.themeId];
}

function systemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function isDarkActive(settings: Settings): boolean {
  if (settings.mode === "off") return false;
  if (settings.mode === "on") return true;
  return systemPrefersDark(); // "system"
}

/**
 * Medium's own stylesheet defines ~27 --color-* custom properties on :root
 * (see lite-color-scheme-tokens) and almost every component reads its
 * colors from them (backgrounds, text, borders, placeholders, hover states).
 * Redefining those tokens re-themes the real site instead of faking it with
 * a pixel-level filter — real colors stay real colors, photos stay
 * untouched, and native form controls pick up `color-scheme: dark`
 * automatically.
 *
 * A handful of things are NOT token-driven and need direct patches:
 * - <body> has a hardcoded `color: rgba(0,0,0,0.8)` in Medium's static CSS
 * - the Medium wordmark logo SVG has a hardcoded `fill="#242424"`
 * - some icon SVGs (e.g. the "add to list" bookmark icon) hardcode
 *   `fill="black"`/`fill="#000000"` as a placeholder meant to match body
 *   text, rather than reading a token — these go invisible on a dark page
 *   unless remapped. (White fills are left alone: those sit on top of
 *   colored badges like the verified checkmark, not the page background,
 *   so they should stay white regardless of theme.)
 */
function buildStylesheet(tokens: MediumTokens): string {
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
      outline: 2px solid var(--color-fg-accent-primary) !important;
      outline-offset: 1px;
    }
  `.trim();
}

function applyTheme(settings: Settings) {
  const existing = document.getElementById(STYLE_ID);

  if (!isDarkActive(settings)) {
    existing?.remove();
    document.documentElement.removeAttribute("data-ayudark");
    return;
  }

  const tokens = resolveTokens(settings);
  const css = buildStylesheet(tokens);

  if (existing instanceof HTMLStyleElement) {
    existing.textContent = css;
    // Re-affirm position as the LAST element in <html> so we win the cascade
    // even if Medium's SPA re-inserts its own token <style> tag on navigation.
    document.documentElement.appendChild(existing);
  } else {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.documentElement.appendChild(style);
  }
  document.documentElement.setAttribute("data-ayudark", settings.themeId);
}

/**
 * Medium is a client-routed SPA — navigating between feed/article/profile/
 * settings doesn't reload the page, so a one-shot injection isn't enough.
 * We patch pushState/replaceState + listen for popstate so the theme (and
 * its position at the end of <html>) is re-confirmed on every route change.
 */
function watchSpaNavigation(onNavigate: () => void) {
  const wrap = (fn: History["pushState"]) =>
    function (this: History, ...args: Parameters<History["pushState"]>) {
      const result = fn.apply(this, args);
      onNavigate();
      return result;
    };

  history.pushState = wrap(history.pushState);
  history.replaceState = wrap(history.replaceState);
  window.addEventListener("popstate", onNavigate);
}

async function main() {
  injectBootStyle();

  let settings = await getSettings();
  applyTheme(settings);

  // Live-update when popup changes settings
  onSettingsChanged((updated) => {
    settings = updated;
    applyTheme(settings);
  });

  // Live-update when OS theme changes while mode === "system"
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (settings.mode === "system") applyTheme(settings);
  });

  // Re-confirm theme on SPA route changes
  watchSpaNavigation(() => applyTheme(settings));
}

main();
