/**
 * index.ts
 * -----------------------------------------------------------------------
 * Content script entry point. Wires together boot.ts, theme.ts, editor.ts,
 * and navigation.ts, and kicks everything off via main().
 *
 * Startup sequence:
 *  1. Paint a dark background instantly (boot.ts) to avoid a white flash.
 *  2. Start watching the editor DOM for re-renders (editor.ts).
 *  3. Load user settings and apply the theme for the first time (theme.ts).
 *  4. Subscribe to: settings changes, OS dark-mode changes, and SPA
 *     navigation (navigation.ts) — re-applying the theme on each.
 */

import { getSettings, onSettingsChanged, Settings } from "../shared/storage";
import { injectBootStyle } from "./boot";
import { setupEditorBackgroundObserver, setupInlineTooltipMenuListener } from "./editor";
import { applyTheme, isDarkActive } from "./theme";
import { watchSpaNavigation } from "./navigation";
import { setupSurfaceFixObserver } from "./surfaces";

async function main() {
  injectBootStyle();
  setupEditorBackgroundObserver();
  setupInlineTooltipMenuListener();

  let settings: Settings = await getSettings();
  applyTheme(settings);
  setupSurfaceFixObserver(() => isDarkActive(settings));

  onSettingsChanged((updated) => {
    settings = updated;
    applyTheme(settings);
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (settings.mode === "system") applyTheme(settings);
  });

  watchSpaNavigation(() => applyTheme(settings));
}

main();