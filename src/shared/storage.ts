import { Mode, ThemeId, CustomSeed, DEFAULT_CUSTOM_SEED } from "./themes";

export interface Settings {
  mode: Mode;
  themeId: ThemeId;
  customSeed: CustomSeed;
}

export const DEFAULT_SETTINGS: Settings = {
  mode: "system",
  themeId: "darkGray",
  customSeed: DEFAULT_CUSTOM_SEED,
};

const STORAGE_KEY = "ayudark_settings";

function area(): chrome.storage.StorageArea {
  // Prefer sync so settings follow the user across signed-in profiles/devices.
  // Falls back to local if sync is unavailable (e.g. sync disabled by policy).
  return chrome.storage.sync ?? chrome.storage.local;
}

export async function getSettings(): Promise<Settings> {
  try {
    const result = await area().get(STORAGE_KEY);
    const stored = result[STORAGE_KEY] as Partial<Settings> | undefined;
    return { ...DEFAULT_SETTINGS, ...stored };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function setSettings(settings: Settings): Promise<void> {
  await area().set({ [STORAGE_KEY]: settings });
}

export function onSettingsChanged(callback: (settings: Settings) => void): void {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "sync" && areaName !== "local") return;
    const change = changes[STORAGE_KEY];
    if (!change) return;
    callback({ ...DEFAULT_SETTINGS, ...(change.newValue as Partial<Settings>) });
  });
}
