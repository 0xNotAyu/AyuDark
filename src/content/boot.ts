/**
 * boot.ts
 * -----------------------------------------------------------------------
 * Anti-flash-of-white-content (FOWC) logic.
 *
 * This runs FIRST, before settings are loaded or the real theme stylesheet
 * is built (both of which are async). It injects a minimal, synchronous
 * inline style that forces the root <html> background to dark immediately,
 * so the user never sees a flash of Medium's default white background
 * while the extension is still starting up.
 *
 * This is intentionally tiny and dependency-free — it must run instantly.
 */

const BOOT_STYLE_ID = "ayudark-boot";

/**
 * Injects a one-off <style> tag that paints the page dark right away.
 * Safe to call multiple times; it's a no-op after the first call.
 */
export function injectBootStyle(): void {
  if (document.getElementById(BOOT_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = BOOT_STYLE_ID;
  style.textContent = `html { background: #141414 !important; }`;
  document.documentElement.appendChild(style);
}