/**
 * navigation.ts
 * -----------------------------------------------------------------------
 * Detects client-side (SPA) navigation on Medium.
 *
 * Medium is a single-page app, so plain 'popstate' events aren't enough —
 * most navigation happens via history.pushState/replaceState without a
 * full page load or a 'popstate' event firing. This module monkey-patches
 * both history methods to invoke a callback on every navigation, which
 * lets the rest of the extension re-evaluate things like "is the user on
 * an editor route?" whenever the URL changes.
 */

/**
 * Wraps history.pushState and history.replaceState so that `onNavigate`
 * fires after every SPA navigation, in addition to listening for
 * 'popstate' (back/forward button) events.
 */
export function watchSpaNavigation(onNavigate: () => void): void {
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