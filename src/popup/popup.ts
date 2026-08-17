import { Mode } from "../shared/themes";
import { getSettings, setSettings, Settings } from "../shared/storage";

/* =========================================
   MODE CONTROL
   ========================================= */

const modeButtons = document.querySelectorAll<HTMLButtonElement>(
  "#mode-control .segmented__option"
);

function isMode(value: string | undefined): value is Mode {
  return value === "system" || value === "off" || value === "on";
}

function updateModeUI(mode: Mode): void {
  modeButtons.forEach((button) => {
    const isActive = button.dataset.mode === mode;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

async function handleModeChange(mode: Mode, settings: Settings): Promise<void> {
  try {
    /*
     * Immediately update the UI so the interaction
     * feels instant.
     */
    updateModeUI(mode);

    /*
     * Persist the setting. We write back the full settings object (not
     * just { mode }) so themeId/customSeed are never dropped.
     *
     * The content script listens to chrome.storage changes and applies
     * the new mode on its own — no tab reload needed.
     */
    settings.mode = mode;
    await setSettings(settings);
  } catch (error) {
    console.error("[ayuDark] Failed to change mode:", error);

    /*
     * If storage failed, restore the actual saved state.
     */
    const current = await getSettings();
    updateModeUI(current.mode);
  }
}

/* =========================================
   INITIALIZE
   ========================================= */

async function initializePopup(): Promise<void> {
  const settings = await getSettings();
  updateModeUI(settings.mode);

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.mode;
      if (!isMode(mode)) return;

      handleModeChange(mode, settings);
    });
  });
}

initializePopup();
