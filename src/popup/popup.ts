import { Mode, ThemeId, DEFAULT_CUSTOM_SEED } from "../shared/themes";
import { getSettings, setSettings, Settings } from "../shared/storage";

function $(selector: string): HTMLElement {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`Missing element: ${selector}`);
  return el as HTMLElement;
}

function renderMode(mode: Mode) {
  document.querySelectorAll<HTMLButtonElement>("#mode-control .segmented__option").forEach((btn) => {
    const active = btn.dataset.mode === mode;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
  $("#theme-section").toggleAttribute("hidden", mode === "off");
}

function renderTheme(themeId: ThemeId) {
  document.querySelectorAll<HTMLButtonElement>("#theme-control .swatch").forEach((btn) => {
    const active = btn.dataset.theme === themeId;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
  $("#custom-section").toggleAttribute("hidden", themeId !== "custom");
}

function renderCustomColors(settings: Settings) {
  (document.getElementById("custom-bg") as HTMLInputElement).value = settings.customSeed.bg;
  (document.getElementById("custom-text") as HTMLInputElement).value = settings.customSeed.text;
  (document.getElementById("custom-accent") as HTMLInputElement).value = settings.customSeed.accent;
}

async function init() {
  const settings = await getSettings();
  renderMode(settings.mode);
  renderTheme(settings.themeId);
  renderCustomColors(settings);

  document.querySelectorAll<HTMLButtonElement>("#mode-control .segmented__option").forEach((btn) => {
    btn.addEventListener("click", async () => {
      settings.mode = btn.dataset.mode as Mode;
      renderMode(settings.mode);
      await setSettings(settings);
      // A live-applied mode switch (System/Off/On) can leave stray state
      // behind — inline-forced editor backgrounds, divider-dot overlays,
      // observers still watching a route that's no longer relevant — so a
      // full reload of the active tab guarantees a clean re-render instead
      // of trying to enumerate every teardown path.
      chrome.tabs.reload();
    });
  });

  document.querySelectorAll<HTMLButtonElement>("#theme-control .swatch").forEach((btn) => {
    btn.addEventListener("click", async () => {
      settings.themeId = btn.dataset.theme as ThemeId;
      renderTheme(settings.themeId);
      await setSettings(settings);
    });
  });

  const customInputs = ["custom-bg", "custom-text", "custom-accent"] as const;
  const keyMap = { "custom-bg": "bg", "custom-text": "text", "custom-accent": "accent" } as const;
  customInputs.forEach((id) => {
    document.getElementById(id)!.addEventListener("input", async (e) => {
      const value = (e.target as HTMLInputElement).value;
      settings.customSeed = { ...settings.customSeed, [keyMap[id]]: value };
      await setSettings(settings);
    });
  });

  document.getElementById("reset-custom")!.addEventListener("click", async () => {
    settings.customSeed = { ...DEFAULT_CUSTOM_SEED };
    renderCustomColors(settings);
    await setSettings(settings);
  });
}

init();
