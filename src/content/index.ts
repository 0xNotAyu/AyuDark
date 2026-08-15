import { BUILTIN_THEMES, themeToCssVars, ThemeVars } from "../shared/themes";
import { getSettings, onSettingsChanged, Settings } from "../shared/storage";

const STYLE_ID = "ayudark-style";
const BOOT_STYLE_ID = "ayudark-boot"; // tiny blocking style injected before anything else, kills FOUC

/**
 * Injected the instant the script runs (document_start), before Medium's own
 * stylesheets paint. Just enough to stop a flash of white while we resolve
 * settings + theme below.
 */
function injectBootStyle() {
  if (document.getElementById(BOOT_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = BOOT_STYLE_ID;
  style.textContent = `html { background: #1a1a1a !important; }`;
  document.documentElement.appendChild(style);
}

function resolveThemeVars(settings: Settings): ThemeVars {
  return settings.themeId === "custom" ? settings.customTheme : BUILTIN_THEMES[settings.themeId];
}

function systemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Medium's DOM uses hashed/generated class names that change on every deploy,
 * so hand-mapped class selectors would break constantly. Instead we classify
 * the current page by its URL shape and expose it as a data attribute, so CSS
 * can target route-specific quirks (editor toolbar, settings forms, etc.)
 * using structure/semantics rather than brittle class names.
 */
type Route =
  | "feed"
  | "article"
  | "editor"
  | "profile"
  | "settings"
  | "notifications"
  | "stats"
  | "search"
  | "list"
  | "other";

function detectRoute(pathname: string): Route {
  if (/^\/(new-story|p\/[\w-]+\/edit|edit)/.test(pathname)) return "editor";
  if (/^\/me\/settings/.test(pathname)) return "settings";
  if (/^\/me\/notifications/.test(pathname)) return "notifications";
  if (/^\/me\/stats/.test(pathname)) return "stats";
  if (/^\/search/.test(pathname)) return "search";
  if (/^\/@[^/]+\/list\//.test(pathname)) return "list";
  if (/^\/@[^/]+\/?$/.test(pathname)) return "profile";
  if (/^\/@[^/]+\/[\w-]+/.test(pathname) || /-[0-9a-f]{6,}$/.test(pathname)) return "article";
  if (pathname === "/" || pathname === "") return "feed";
  return "other";
}

function applyRouteAttribute() {
  document.documentElement.setAttribute("data-ayudark-route", detectRoute(location.pathname));
}

function isDarkActive(settings: Settings): boolean {
  if (settings.mode === "off") return false;
  if (settings.mode === "on") return true;
  return systemPrefersDark(); // "system"
}

/**
 * Full theme layer. Uses an invert+hue-rotate base so every route is covered
 * even where we haven't hand-mapped Medium's DOM (profile, settings, editor,
 * stats, etc.), then un-inverts media so photos/avatars/embeds look normal,
 * then layers the chosen palette on top for backgrounds/text/links/accent.
 */
function buildStylesheet(vars: ThemeVars): string {
  const cssVars = themeToCssVars(vars);
  return `
    :root {
      ${cssVars}
    }

    html {
      background: var(--ayudark-bg) !important;
      filter: invert(1) hue-rotate(180deg) contrast(0.92) !important;
    }

    /* Un-invert anything that should keep its true colors: photos, avatars,
       embeds, canvases, and native form controls (which the invert filter
       renders illegibly). Form controls get explicit theme colors below
       instead of relying on the invert trick. */
    img, picture, video, svg, canvas, iframe,
    [style*="background-image"],
    [role="img"],
    input, textarea, select, button {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    /* Layered palette for elements we DO know about */
    body {
      background-color: var(--ayudark-bg) !important;
      color: var(--ayudark-text) !important;
    }
    a { color: var(--ayudark-link) !important; }
    ::selection { background: var(--ayudark-accent); color: var(--ayudark-bg); }
    * { scrollbar-color: var(--ayudark-border) var(--ayudark-bg); }

    /* Native form controls: explicit theme instead of the invert trick,
       since inverted checkboxes/selects/date pickers render illegibly */
    input, textarea, select, button {
      background-color: var(--ayudark-bg-elevated) !important;
      color: var(--ayudark-text) !important;
      border-color: var(--ayudark-border) !important;
    }
    input::placeholder, textarea::placeholder {
      color: var(--ayudark-text-muted) !important;
      opacity: 1 !important;
    }
    button {
      cursor: pointer;
    }
    button:hover {
      filter: brightness(1.1) !important;
    }
    :focus-visible {
      outline: 2px solid var(--ayudark-accent) !important;
      outline-offset: 1px;
    }

    /* Code blocks / inline code: force a legible monospace block regardless
       of whatever syntax-highlight colors Medium's editor injected inline */
    pre, code, kbd, samp {
      background-color: var(--ayudark-bg-elevated) !important;
      color: var(--ayudark-text) !important;
      border-color: var(--ayudark-border) !important;
    }

    /* Editor contenteditable surfaces (new-story / edit views) */
    [contenteditable="true"] {
      background-color: var(--ayudark-bg) !important;
      color: var(--ayudark-text) !important;
      caret-color: var(--ayudark-accent) !important;
    }

    /* Sticky/fixed headers and toolbars (feed top bar, editor floating
       toolbar, profile tabs) — targeted by semantics, not class names */
    header, nav, [role="banner"], [role="navigation"], [role="toolbar"] {
      background-color: var(--ayudark-bg-elevated) !important;
      border-color: var(--ayudark-border) !important;
    }

    /* Cards / panels / modals / drawers (responses panel, settings sections,
       dropdown menus) */
    [role="dialog"], [role="menu"], [role="listbox"], [role="tooltip"],
    [role="complementary"] {
      background-color: var(--ayudark-bg-elevated) !important;
      color: var(--ayudark-text) !important;
      border-color: var(--ayudark-border) !important;
    }

    hr { border-color: var(--ayudark-border) !important; }

    /* --- Route-specific nudges --- */

    /* Editor: keep the floating toolbar readable above the invert layer */
    html[data-ayudark-route="editor"] [role="toolbar"] {
      background-color: var(--ayudark-bg-elevated) !important;
    }

    /* Settings: form rows tend to use light card backgrounds Medium-side */
    html[data-ayudark-route="settings"] section,
    html[data-ayudark-route="settings"] fieldset {
      background-color: var(--ayudark-bg) !important;
      border-color: var(--ayudark-border) !important;
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

  const vars = resolveThemeVars(settings);
  const css = buildStylesheet(vars);

  if (existing instanceof HTMLStyleElement) {
    existing.textContent = css;
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
 * We patch pushState/replaceState + listen for popstate so the theme is
 * re-confirmed on every route change, and watch the DOM for large subtree
 * swaps (infinite scroll, lazy-loaded panels) in case anything needs
 * re-tagging later.
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

  const observer = new MutationObserver(() => {
    // Cheap no-op re-apply hook for M3: route-specific overrides will use this
    // to re-tag newly mounted subtrees (e.g. lazy-loaded feed cards).
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

async function main() {
  injectBootStyle();
  applyRouteAttribute();

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

  // Re-confirm theme + route classification on SPA route changes
  watchSpaNavigation(() => {
    applyRouteAttribute();
    applyTheme(settings);
  });
}

main();
