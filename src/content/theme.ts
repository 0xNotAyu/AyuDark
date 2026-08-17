/**
 * theme.ts
 * -----------------------------------------------------------------------
 * Core theming logic: turns user Settings into a color palette
 * (MediumTokens), builds the full dark-mode stylesheet from those tokens,
 * and injects/updates/removes the <style> tag on the page.
 *
 * This is the main orchestrator — applyTheme() is the single entry point
 * called on startup, on settings changes, on OS theme changes, and on
 * every SPA navigation. It also coordinates with editor.ts for the
 * legacy-editor-specific inline-style overrides.
 */

import {
  BUILTIN_TOKEN_THEMES,
  deriveTokensFromSeed,
  tokensToCssVars,
  MediumTokens,
} from "../shared/themes";
import { Settings } from "../shared/storage";
import {
  EDITOR_CLASS,
  isEditorRoute,
  forceEditorBackgrounds,
  clearForcedEditorBackgrounds,
  forceInlineTooltipMenuColors,
  clearInlineTooltipMenuColors,
  forceSectionDividerColors,
  clearSectionDividerColors,
  forcePopoverArrowColors,
  clearPopoverArrowColors,
  setCurrentTokens,
} from "./editor";
import { applySurfaceFixes, clearSurfaceFixes } from "./surfaces";

const STYLE_ID = "ayudark-style";

/** Resolves the active color tokens: a built-in theme, or a derived custom one. */
function resolveTokens(settings: Settings): MediumTokens {
  return settings.themeId === "custom"
    ? deriveTokensFromSeed(settings.customSeed)
    : BUILTIN_TOKEN_THEMES[settings.themeId];
}

/** Reads the OS-level color-scheme preference. */
function systemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/** Determines whether dark mode should currently be active, given settings + OS preference. */
export function isDarkActive(settings: Settings): boolean {
  if (settings.mode === "off") return false;
  if (settings.mode === "on") return true;
  return systemPrefersDark();
}

/**
 * Builds the full dark-mode CSS as a string from the given tokens.
 * Covers: global variables/resets, the modern Medium UI, and a large
 * block of legacy-editor-specific rules scoped under html.ayudark-editor
 * (values confirmed via live getComputedStyle() inspection).
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
      outline: 2px solid var(--color-border-neutral-secondary) !important;
      outline-offset: 1px;
    }

    /* The rule above applies to whatever currently has focus — and while
       typing, that's the entire contenteditable content box, which spans
       from the title down to wherever the cursor is. Its outline was
       drawing a full-width line across the top and bottom of that box,
       moving down as the box grew with more text. Suppressed here for the
       editor's editable regions specifically; kept everywhere else
       (buttons, links, inputs) for accessibility. */
    html.${EDITOR_CLASS} .postArticle-content:focus,
    html.${EDITOR_CLASS} .postArticle-content:focus-visible,
    html.${EDITOR_CLASS} .section-content:focus,
    html.${EDITOR_CLASS} .section-content:focus-visible,
    html.${EDITOR_CLASS} [contenteditable]:focus,
    html.${EDITOR_CLASS} [contenteditable]:focus-visible {
      outline: none !important;
    }

    /* --- Legacy editor route (medium.com/new-story, /p/*\/edit) ---
       Values confirmed via live getComputedStyle() inspection, not
       guessed. Scoped under html.${EDITOR_CLASS}, set from the URL in
       applyTheme(). No invert filter anywhere — explicit overrides only. */

    html.${EDITOR_CLASS} .site-main,
    html.${EDITOR_CLASS} .screenContent,
    html.${EDITOR_CLASS} .surface {
      background: var(--color-bg-neutral-primary) !important;
      color: var(--color-fg-neutral-primary) !important;
    }

    html.${EDITOR_CLASS} .metabar {
      background: var(--color-bg-neutral-primary) !important;
      color: var(--color-fg-neutral-secondary) !important;
      border-bottom: 1px solid var(--color-border-neutral-primary) !important;
    }
    html.${EDITOR_CLASS} .metabar .popover {
      color: var(--color-fg-neutral-primary) !important;
    }

    html.${EDITOR_CLASS} .u-backgroundTransparentWhiteDark,
    html.${EDITOR_CLASS} .u-backgroundTransparentWhiteDarker,
    html.${EDITOR_CLASS} .u-backgroundTransparentWhiteDarkest,
    html.${EDITOR_CLASS} .u-backgroundGrayLight,
    html.${EDITOR_CLASS} .u-backgroundColorGrayLight {
      background: var(--color-bg-neutral-secondary) !important;
    }

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

    html.${EDITOR_CLASS} .postArticle-content,
    html.${EDITOR_CLASS} .section-content {
      background: transparent !important;
      color: var(--color-fg-neutral-primary) !important;
      caret-color: var(--color-fg-accent-primary) !important;
    }

    html.${EDITOR_CLASS} .graf--title,
    html.${EDITOR_CLASS} .graf--h2,
    html.${EDITOR_CLASS} .graf--h3,
    html.${EDITOR_CLASS} .graf--h4 {
      color: var(--color-fg-neutral-primary) !important;
    }
    html.${EDITOR_CLASS} .graf--subtitle,
    html.${EDITOR_CLASS} .graf--kicker,
    html.${EDITOR_CLASS} .graf--pullquote {
      color: var(--color-fg-neutral-secondary) !important;
    }
    html.${EDITOR_CLASS} .graf--blockquote {
      border-left-color: var(--color-border-neutral-primary) !important;
    }
    html.${EDITOR_CLASS} .defaultValue {
      color: var(--color-fg-neutral-secondary) !important;
    }

    html.${EDITOR_CLASS} svg path:not([fill]) {
      fill: var(--color-fg-neutral-primary) !important;
    }

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

    /* FIX 3: insert-content toolbar icons (image/video/embed/code/hr) used
       to get recolored to the bright accent green (fgAccentPrimary), which
       read as neon/inconsistent next to the rest of the muted dark UI.
       Now recolored to the same neutral tone as every other icon instead
       of being singled out as "accent" — plain, consistent, no green. */
    html.${EDITOR_CLASS} svg path[fill="#bbbbbb"],
    html.${EDITOR_CLASS} svg path[fill="#bbbbbb"] {
      fill: var(--color-fg-neutral-primary) !important;
    }
    html.${EDITOR_CLASS} svg circle[stroke="#bbbbbb"],
    html.${EDITOR_CLASS} svg path[stroke="#bbbbbb"],
    html.${EDITOR_CLASS} svg circle[stroke="#bbbbbb"],
    html.${EDITOR_CLASS} svg path[stroke="#bbbbbb"] {
      stroke: var(--color-border-neutral-primary) !important;
    }
    /* FIX 4: the "+" inline tooltip menu (Add image/Unsplash image/video/
       embed/code block/divider buttons that appear when starting a new
       line in the editor) hardcodes its icon fill/stroke to Medium's own
       brand green (#1A8917) via inline SVG attributes. Same technique as
       FIX 3 above, just a different hex — recolored to the theme's accent
       color instead of Medium's fixed green. */
    html.${EDITOR_CLASS} svg path[fill="#1A8917"],
    html.${EDITOR_CLASS} svg rect[fill="#1A8917"] {
      fill: var(--color-fg-accent-primary) !important;
    }
    html.${EDITOR_CLASS} svg path[stroke="#1A8917"],
    html.${EDITOR_CLASS} svg rect[stroke="#1A8917"],
    html.${EDITOR_CLASS} svg circle[stroke="#1A8917"] {
      stroke: var(--color-fg-accent-primary) !important;
    }

    /* Section divider (<hr class="section-divider">) is now recolored via
       JS in editor.ts (forceSectionDividerColors) — its dots render as a
       background-image asset that a stylesheet rule can't reach. */

    html.${EDITOR_CLASS} .button--primary,
    html.${EDITOR_CLASS} .button--circle {
      border-color: var(--color-border-neutral-primary) !important;
      background: var(--color-bg-neutral-secondary) !important;
      color: var(--color-fg-neutral-primary) !important;
    }
    html.${EDITOR_CLASS} .button--primary .svgIcon,
    html.${EDITOR_CLASS} .button--circle .svgIcon {
      fill: var(--color-fg-neutral-primary) !important;
    }

    html.${EDITOR_CLASS} .highlightMenu-inner,
    html.${EDITOR_CLASS} .drawer-inner {
      background: var(--color-bg-neutral-secondary) !important;
      border: 1px solid var(--color-border-neutral-primary) !important;
    }
    html.${EDITOR_CLASS} .highlightMenu-arrow {
      border-top-color: var(--color-bg-neutral-secondary) !important;
    }

    /* =========================================================
       POPOVER / DROPDOWN MENUS (the "..." menu, the avatar/profile menu)
       ========================================================= */

    html.${EDITOR_CLASS} .popover {
      background: transparent !important;
      color: var(--color-fg-neutral-primary) !important;
      border: none !important;
      box-shadow: none !important;
    }
    html.${EDITOR_CLASS} .popover-inner {
      background: var(--color-bg-neutral-secondary) !important;
      border: 1px solid var(--color-border-neutral-primary) !important;
    }
    html.${EDITOR_CLASS} .popover-inner ul,
    html.${EDITOR_CLASS} .popover-inner .list,
    html.${EDITOR_CLASS} .popover-inner .list-item,
    html.${EDITOR_CLASS} .popover-inner li,
    html.${EDITOR_CLASS} .popover-inner span {
      background: transparent !important;
    }
    html.${EDITOR_CLASS} .popover .button,
    html.${EDITOR_CLASS} .popover a.button {
      background: transparent !important;
      color: var(--color-fg-neutral-secondary) !important;
    }
    /* Menu rows (Write / Profile / Library / Stories / Stats / Settings,
       etc.) default to a muted gray, and hover only brightens the text to
       white — no background highlight. Background explicitly forced
       transparent on hover too, since the previous version highlighted
       with a tertiary-gray box on hover, which is exactly what this
       replaces. */
    html.${EDITOR_CLASS} .popover .button:hover,
    html.${EDITOR_CLASS} .popover .button:focus,
    html.${EDITOR_CLASS} .popover a.button:hover,
    html.${EDITOR_CLASS} .popover a.button:focus {
      background: transparent !important;
      color: var(--color-fg-neutral-primary) !important;
    }
    html.${EDITOR_CLASS} .popover .list-item {
      background: transparent !important;
    }
    html.${EDITOR_CLASS} .popover .list-item--separator {
      border-color: var(--color-border-neutral-primary) !important;
    }
    /* Same gray-default/white-on-hover text behavior for menu rows that
       turn out to be plain <a> tags rather than .button (lower specificity
       than the .link/.link--secondary name/handle rules below, so those
       still win where they apply). */
    html.${EDITOR_CLASS} .popover-inner a {
      color: var(--color-fg-neutral-secondary) !important;
    }
    html.${EDITOR_CLASS} .popover-inner a:hover,
    html.${EDITOR_CLASS} .popover-inner a:focus {
      color: var(--color-fg-neutral-primary) !important;
    }
    /* Safety net: kill any background Medium applies on hover to anything
       else inside the menu that isn't a plain .button (e.g. a raw <li> or
       <a> without that class) — this menu's exact row markup wasn't
       confirmed, so this catches whatever the real element turns out to
       be without needing to guess its class name. */
    html.${EDITOR_CLASS} .popover-inner *:hover {
      background: transparent !important;
      background-color: transparent !important;
    }

    /* FIX 2: the profile-menu name ("Ayuneko") and handle ("@ayuneko22551")
       use .link / .link--darker / .link--secondary classes we hadn't
       touched, so they fell back to Medium's default dark link color —
       basically invisible on our dark popover. Forced to theme text
       colors. */
    html.${EDITOR_CLASS} .popover .link,
    html.${EDITOR_CLASS} .popover .link--darker,
    html.${EDITOR_CLASS} .popover a {
      color: var(--color-fg-neutral-primary) !important;
    }
    html.${EDITOR_CLASS} .popover .link--secondary {
      color: var(--color-fg-neutral-secondary) !important;
    }

    /* FIX 1: the popover arrow previously showed a pale/white box behind
       the triangle (Medium's own box-shadow/filter on the arrow element,
       never overridden) plus a mismatched white triangle color. Both
       covered here: shadow/filter killed outright, and both the
       background (in case the arrow is a rotated square) and border
       colors (in case it's a CSS border-triangle) are matched to the
       popover body color so there's no visible seam either way. */
    html.${EDITOR_CLASS} .popover-arrow {
      background: var(--color-bg-neutral-secondary) !important;
      border-color: transparent !important;
      border-top-color: var(--color-bg-neutral-secondary) !important;
      border-bottom-color: var(--color-bg-neutral-secondary) !important;
      box-shadow: none !important;
      filter: none !important;
    }
    /* The actual visible triangle is drawn by ::after (confirmed via
       DevTools: div.popover-arrow::after had a hardcoded background:
       #FFFFFF), not by the .popover-arrow element itself — that's why the
       JS-based forcePopoverArrowColors() in editor.ts, and the rule right
       above, had no visible effect: inline styles set via the DOM API
       cannot reach a pseudo-element at all, only a stylesheet rule can.
       ::before covered too as a defensive no-op in case a different
       popover variant uses it instead.
       A matching 1px border is added here (and on .popover-inner above)
       so the whole speech-bubble reads as one outlined shape instead of
       flatly blending into the page background — mirroring the subtle
       border Medium's own light-mode popover has. */
    html.${EDITOR_CLASS} .popover-arrow::after,
    html.${EDITOR_CLASS} .popover-arrow::before {
      background: var(--color-bg-neutral-secondary) !important;
      border: 1px solid var(--color-border-neutral-primary) !important;
      box-shadow: none !important;
      filter: none !important;
    }
  `.trim();
}

/**
 * Main entry point: applies (or removes) the dark theme based on the
 * current settings and route. Called on startup, on every settings
 * change, on OS dark-mode change, and on every SPA navigation.
 */
export function applyTheme(settings: Settings): void {
  const existing = document.getElementById(STYLE_ID);
  const editorRoute = isEditorRoute(location.pathname);
  document.documentElement.classList.toggle(EDITOR_CLASS, editorRoute);

  if (!isDarkActive(settings)) {
    existing?.remove();
    document.documentElement.removeAttribute("data-ayudark");
    clearForcedEditorBackgrounds();
    clearInlineTooltipMenuColors();
    clearSectionDividerColors();
    clearPopoverArrowColors();
    clearSurfaceFixes();
    setCurrentTokens(null);
    return;
  }

  const tokens = resolveTokens(settings);
  setCurrentTokens(tokens);
  const css = buildStylesheet(tokens);

  if (existing instanceof HTMLStyleElement) {
    existing.textContent = css;
    document.documentElement.appendChild(existing); // re-affirm as last child, wins the cascade
  } else {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.documentElement.appendChild(style);
  }
  document.documentElement.setAttribute("data-ayudark", settings.themeId);

  // Runs on every route (not just the legacy editor) — the green promo
  // banners and the low-contrast "Start a list"-style buttons this fixes
  // live on ordinary pages like /me/lists.
  applySurfaceFixes();

  if (editorRoute) {
    forceEditorBackgrounds(tokens);
    forceInlineTooltipMenuColors(tokens);
    forceSectionDividerColors(tokens);
    forcePopoverArrowColors(tokens);
  }
}