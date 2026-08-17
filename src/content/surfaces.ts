/**
 * surfaces.ts
 * -----------------------------------------------------------------------
 * Two small, targeted DOM fixes for pages OUTSIDE the legacy editor route
 * (e.g. medium.com/me/lists) — theme.ts's stylesheet and editor.ts's
 * inline-style overrides don't reach these:
 *
 *  1. LIGHTEN BRAND-GREEN SURFACES
 *     Medium hardcodes its brand green (#1A8917) directly as a background
 *     on some promo surfaces (e.g. the "Create a list" banner) rather than
 *     reading it from one of the ~27 --color-* tokens we remap. It stays
 *     the same saturated light-mode green in dark mode, which reads too
 *     bright against a dark page. Swapped for a lighter, more muted shade.
 *
 *  2. FIX INVISIBLE LOW-CONTRAST BUTTONS
 *     Some Medium buttons pair a fixed (always-dark) background with text
 *     that reads from --color-fg-neutral-tertiary — the token we also use
 *     for "dark text on our (now light) Publish button." On a button whose
 *     background stays fixed-dark, that leaves dark-on-dark, invisible
 *     text (e.g. "Start a list" on /me/lists). Detected generically via
 *     computed-style contrast rather than a class name, since Medium's
 *     own classes are hashed/build-generated and not stable to target.
 */

const BRAND_GREEN_RGB = "rgb(26, 137, 23)"; // Medium's hardcoded #1A8917
const BRAND_GREEN_LIGHT = "#4caf50"; // lighter, dark-mode-friendlier shade
const GREEN_SURFACE_MARKER = "data-ayudark-green-surface";
const LOW_CONTRAST_MARKER = "data-ayudark-contrast-fixed";

/** Relative luminance (0 = black, 1 = white) parsed from a computed rgb()/rgba() string. */
function relLuminance(rgb: string): number | null {
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return null;
  const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])].map((c) => c / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Swaps Medium's hardcoded brand-green backgrounds for a lighter shade. */
export function lightenBrandGreenSurfaces(): void {
  document.querySelectorAll<HTMLElement>("div, a, section, article, button").forEach((el) => {
    if (el.hasAttribute(GREEN_SURFACE_MARKER)) return;
    if (getComputedStyle(el).backgroundColor === BRAND_GREEN_RGB) {
      el.setAttribute(GREEN_SURFACE_MARKER, "true");
      el.style.setProperty("background-color", BRAND_GREEN_LIGHT, "important");
    }
  });
}

/** Restores any brand-green surfaces this swapped, when dark mode turns off. */
export function clearBrandGreenSurfaces(): void {
  document.querySelectorAll<HTMLElement>(`[${GREEN_SURFACE_MARKER}]`).forEach((el) => {
    el.style.removeProperty("background-color");
    el.removeAttribute(GREEN_SURFACE_MARKER);
  });
}

/** Forces white text on any button whose background AND text are both near-black (invisible). */
export function fixLowContrastButtons(): void {
  document.querySelectorAll<HTMLElement>("button, a.button, a[role='button']").forEach((el) => {
    const style = getComputedStyle(el);
    const bgL = relLuminance(style.backgroundColor);
    const fgL = relLuminance(style.color);
    if (bgL === null || fgL === null) return;
    if (bgL < 0.25 && fgL < 0.25) {
      el.setAttribute(LOW_CONTRAST_MARKER, "true");
      el.style.setProperty("color", "#ffffff", "important");
    } else if (el.hasAttribute(LOW_CONTRAST_MARKER) && (bgL >= 0.25 || fgL >= 0.25)) {
      // No longer low-contrast (e.g. re-render changed its colors) — let go of it.
      el.style.removeProperty("color");
      el.removeAttribute(LOW_CONTRAST_MARKER);
    }
  });
}

/** Restores any buttons this fixed, when dark mode turns off. */
export function clearLowContrastButtons(): void {
  document.querySelectorAll<HTMLElement>(`[${LOW_CONTRAST_MARKER}]`).forEach((el) => {
    el.style.removeProperty("color");
    el.removeAttribute(LOW_CONTRAST_MARKER);
  });
}

/** Runs both fixes once (e.g. after navigation or a debounced DOM mutation). */
export function applySurfaceFixes(): void {
  lightenBrandGreenSurfaces();
  fixLowContrastButtons();
}

/** Reverses both fixes (called when dark mode is turned off). */
export function clearSurfaceFixes(): void {
  clearBrandGreenSurfaces();
  clearLowContrastButtons();
}

/**
 * Watches for Medium re-rendering the page (SPA route changes, async-
 * loaded promo cards, etc.) and re-applies the fixes on a debounce —
 * deliberately lighter-weight than editor.ts's per-frame observer, since
 * this one runs across the whole site rather than a single editor route.
 */
export function setupSurfaceFixObserver(isDarkActive: () => boolean): MutationObserver {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const observer = new MutationObserver(() => {
    if (!isDarkActive()) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(applySurfaceFixes, 400);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  return observer;
}
