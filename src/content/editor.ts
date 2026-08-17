/**
 * editor.ts
 * -----------------------------------------------------------------------
 * Handles theming for Medium's legacy story editor routes
 * (medium.com/new-story, medium.com/p/*\/edit).
 *
 * Why this exists separately from the stylesheet in theme.ts:
 * Certain editor elements (.site-main, .screenContent, .surface,
 * .canvas-renderer) hardcode `background: #fff` directly and are not
 * reachable by a plain CSS override — a stylesheet rule loses the cascade
 * against them. The only reliable fix is setting `element.style` with
 * `!important` priority directly on the DOM nodes.
 *
 * Because Medium re-renders the editor DOM on virtually every keystroke,
 * a MutationObserver is used to keep re-applying these overrides for as
 * long as dark mode is active and the user is on an editor route.
 */

import type { MediumTokens } from "../shared/themes";

export const EDITOR_CLASS = "ayudark-editor";

/**
 * .site-main / .screenContent / .surface hardcode background:#fff in
 * Medium's real CSS with no class guard we can hook into via a stylesheet
 * rule (confirmed by direct inspection) — so a plain CSS override loses the
 * cascade. Forcing them via inline style (with 'important' priority) wins
 * unconditionally.
 */
const EDITOR_FORCE_BG_SELECTORS = [".site-main", ".screenContent", ".surface"];

/**
 * .canvas-renderer is a full-viewport selection-rendering overlay that
 * hardcodes background:#fff and sits on top of everything (pointer-events
 * are disabled on it, so it's invisible to clicks but not to the eye) —
 * making it transparent lets the real dark background show through.
 */
const EDITOR_TRANSPARENT_SELECTORS = [".canvas-renderer"];

/**
 * Tracks the most recently applied color tokens so the MutationObserver
 * (which fires asynchronously, independent of applyTheme's call stack)
 * knows what colors to re-apply. Set via setCurrentTokens(), normally
 * called from theme.ts's applyTheme().
 */
let currentTokens: MediumTokens | null = null;

/** Updates the tokens the background observer should use on its next run. */
export function setCurrentTokens(tokens: MediumTokens | null): void {
  currentTokens = tokens;
}

/** Returns true if the given pathname is one of Medium's legacy editor routes. */
export function isEditorRoute(pathname: string): boolean {
  return /^\/new-story(\/|$)/.test(pathname) || /^\/p\/[^/]+\/edit(\/|$)/.test(pathname);
}

/**
 * The "+" inline tooltip menu (Add image/Unsplash image/video/embed/code
 * block/divider) that pops up while writing in the editor. It's injected
 * into the DOM fresh each time it opens, and its icon fill/stroke are
 * hardcoded to Medium's brand green (#1A8917) via inline SVG attributes.
 * A plain stylesheet rule wasn't reliably beating it, so we set the
 * attributes directly via JS instead — the same escape hatch used for
 * forceEditorBackgrounds() above.
 */
const INLINE_TOOLTIP_MENU_SELECTOR = ".inlineTooltip-menu";
const INLINE_TOOLTIP_ICON_HEX = "#1A8917";
/** Marks an icon as "we've taken it over" so future re-colors can find it
 * again even after its fill/stroke no longer equals the original hex —
 * matching purely on the hardcoded hex broke on the *second* theme
 * switch, since after the first switch the attribute value is no longer
 * "#1A8917" and the old selector-based lookup would silently stop
 * finding it, leaving it stuck on whatever color was applied first. */
const TOOLTIP_ICON_MARKER_ATTR = "data-ayudark-tooltip-icon";

function tagInlineTooltipMenuIcons(): void {
  document
    .querySelectorAll(
      `${INLINE_TOOLTIP_MENU_SELECTOR} svg [fill="${INLINE_TOOLTIP_ICON_HEX}"], ${INLINE_TOOLTIP_MENU_SELECTOR} svg [stroke="${INLINE_TOOLTIP_ICON_HEX}"]`
    )
    .forEach((el) => el.setAttribute(TOOLTIP_ICON_MARKER_ATTR, "true"));
}

/** Recolors any currently-mounted inline tooltip menu icons to the theme's accent color. */
export function forceInlineTooltipMenuColors(tokens: MediumTokens): void {
  tagInlineTooltipMenuIcons();
  document.querySelectorAll(`${INLINE_TOOLTIP_MENU_SELECTOR} svg [${TOOLTIP_ICON_MARKER_ATTR}]`).forEach((el) => {
    if (el.hasAttribute("fill")) el.setAttribute("fill", tokens.fgAccentPrimary);
    if (el.hasAttribute("stroke")) el.setAttribute("stroke", tokens.fgAccentPrimary);
  });
}

/** Restores tooltip menu icons to Medium's original green when dark mode is turned off. */
export function clearInlineTooltipMenuColors(): void {
  document.querySelectorAll(`${INLINE_TOOLTIP_MENU_SELECTOR} svg [${TOOLTIP_ICON_MARKER_ATTR}]`).forEach((el) => {
    if (el.hasAttribute("fill")) el.setAttribute("fill", INLINE_TOOLTIP_ICON_HEX);
    if (el.hasAttribute("stroke")) el.setAttribute("stroke", INLINE_TOOLTIP_ICON_HEX);
    el.removeAttribute(TOOLTIP_ICON_MARKER_ATTR);
  });
}

/**
 * The "..." section divider (<hr class="section-divider">) renders its
 * dots some way we can't reach with CSS (not a plain background-image on
 * the <hr> itself — forcing that to `none` didn't remove them, so they're
 * most likely painted via ::before content, which JS can't restyle either
 * since pseudo-elements aren't real DOM nodes). Rather than fight to hide
 * the original, we leave it completely alone and overlay our own colored
 * dots directly on top of it, absolutely positioned to the same center.
 */
const SECTION_DIVIDER_SELECTOR = "hr.section-divider";
const DIVIDER_WRAPPER_CLASS = "ayudark-divider-dots-wrapper";
const DIVIDER_DOT_CLASS = "ayudark-divider-dot";
const DIVIDER_DOT_GAP = "20px"; // was 18px, +2px

/** Recolors (and, on first run, builds) the overlay dots for every section divider. */
export function forceSectionDividerColors(tokens: MediumTokens): void {
  document.querySelectorAll<HTMLElement>(SECTION_DIVIDER_SELECTOR).forEach((hr) => {
    // Only ensures the overlay has something to position against —
    // does not touch the hr's own background, border, or content.
    if (getComputedStyle(hr).position === "static") {
      hr.style.setProperty("position", "relative", "important");
    }

    let wrapper = hr.querySelector<HTMLElement>(`.${DIVIDER_WRAPPER_CLASS}`);
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.className = DIVIDER_WRAPPER_CLASS;
      wrapper.style.setProperty("position", "absolute", "important");
      wrapper.style.setProperty("inset", "0", "important");
      wrapper.style.setProperty("display", "flex", "important");
      wrapper.style.setProperty("align-items", "center", "important");
      wrapper.style.setProperty("justify-content", "center", "important");
      wrapper.style.setProperty("gap", DIVIDER_DOT_GAP, "important");
      wrapper.style.setProperty("pointer-events", "none", "important");
      wrapper.style.setProperty("transform", "translateY(-2px)", "important");
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement("span");
        dot.className = DIVIDER_DOT_CLASS;
        dot.style.setProperty("width", "4px", "important");
        dot.style.setProperty("height", "4px", "important");
        dot.style.setProperty("border-radius", "50%", "important");
        dot.style.setProperty("display", "inline-block", "important");
        wrapper.appendChild(dot);
      }
      hr.appendChild(wrapper);
    }
    wrapper
      .querySelectorAll<HTMLElement>(`.${DIVIDER_DOT_CLASS}`)
      .forEach((dot) => dot.style.setProperty("background-color", tokens.fgAccentPrimary, "important"));
  });
}

/** Removes the overlay dots, restoring the original untouched divider. */
export function clearSectionDividerColors(): void {
  document.querySelectorAll<HTMLElement>(SECTION_DIVIDER_SELECTOR).forEach((hr) => {
    hr.style.removeProperty("position");
    hr.querySelector(`.${DIVIDER_WRAPPER_CLASS}`)?.remove();
  });
}

/**
 * The popover's little pointer arrow (.popover-arrow) resisted the CSS
 * border/background override the same way the divider dots did — likely
 * painted via a pseudo-element or an inline style we can't out-specify.
 * Same fix: leave the original alone and overlay a same-color CSS-triangle
 * directly on top of it (slightly larger, to fully cover any white fringe).
 */
const POPOVER_ARROW_SELECTOR = ".popover-arrow";
const ARROW_OVERLAY_CLASS = "ayudark-popover-arrow-overlay";

/** Recolors (and, on first run, builds) the overlay triangle for every popover arrow. */
export function forcePopoverArrowColors(tokens: MediumTokens): void {
  document.querySelectorAll<HTMLElement>(".popover-arrow").forEach((arrow) => {
    arrow.style.setProperty(
      "background",
      tokens.bgNeutralSecondary,
      "important"
    );

    arrow.style.setProperty(
      "border-left-color",
      "transparent",
      "important"
    );

    arrow.style.setProperty(
      "border-right-color",
      "transparent",
      "important"
    );

    arrow.style.setProperty(
      "border-top-color",
      "transparent",
      "important"
    );

    arrow.style.setProperty(
      "border-bottom-color",
      tokens.bgNeutralSecondary,
      "important"
    );

    arrow.style.setProperty(
      "box-shadow",
      "none",
      "important"
    );

    arrow.style.setProperty(
      "filter",
      "none",
      "important"
    );
  });
}

/** Removes the overlay triangle, restoring the original untouched arrow. */
export function clearPopoverArrowColors(): void {
  document.querySelectorAll<HTMLElement>(POPOVER_ARROW_SELECTOR).forEach((arrow) => {
    arrow.style.removeProperty("position");
    arrow.querySelector(`.${ARROW_OVERLAY_CLASS}`)?.remove();
  });
}

/**
 * Attaches a document-level click listener (capture phase, so it runs
 * ahead of Medium's own handlers) that waits one frame for the popup to
 * finish mounting, then recolors it. Safe to call once at startup.
 */
export function setupInlineTooltipMenuListener(): void {
  document.addEventListener(
    "click",
    () => {
      if (!currentTokens) return;
      requestAnimationFrame(() => {
        forceInlineTooltipMenuColors(currentTokens!);
        forceSectionDividerColors(currentTokens!);
        forcePopoverArrowColors(currentTokens!);
      });
    },
    true
  );
}

/**
 * Forces dark backgrounds/foregrounds onto the hardcoded-white editor
 * elements via inline styles, and makes the selection overlay transparent.
 */
export function forceEditorBackgrounds(tokens: MediumTokens): void {
  EDITOR_FORCE_BG_SELECTORS.forEach((sel) => {
    document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
      el.style.setProperty("background", tokens.bgNeutralPrimary, "important");
      el.style.setProperty("background-color", tokens.bgNeutralPrimary, "important");
      el.style.setProperty("background-image", "none", "important");
      el.style.setProperty("color", tokens.fgNeutralPrimary, "important");
    });
  });
  EDITOR_TRANSPARENT_SELECTORS.forEach((sel) => {
    document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
      el.style.setProperty("background", "transparent", "important");
      el.style.setProperty("background-color", "transparent", "important");
      el.style.setProperty("background-image", "none", "important");
    });
  });
}

/** Removes all inline style overrides applied by forceEditorBackgrounds(). */
export function clearForcedEditorBackgrounds(): void {
  [...EDITOR_FORCE_BG_SELECTORS, ...EDITOR_TRANSPARENT_SELECTORS].forEach((sel) => {
    document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
      el.style.removeProperty("background");
      el.style.removeProperty("background-color");
      el.style.removeProperty("background-image");
      el.style.removeProperty("color");
    });
  });
}

/**
 * Watches the DOM for Medium's re-renders and re-applies the forced
 * editor backgrounds whenever they occur, throttled to one re-apply per
 * animation frame. Only acts while dark mode is on and the user is
 * currently on an editor route.
 */
export function setupEditorBackgroundObserver(): MutationObserver {
  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (!currentTokens || !isEditorRoute(location.pathname)) return;
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      forceEditorBackgrounds(currentTokens!);
      forceInlineTooltipMenuColors(currentTokens!);
      forceSectionDividerColors(currentTokens!);
      forcePopoverArrowColors(currentTokens!);
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  return observer;
}