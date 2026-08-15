// Theme definitions for ayuDark.
// Each theme is a set of CSS custom properties applied to :root when dark mode is active.
// Full selector coverage (M2) will consume these variables; for now this is the
// single source of truth so popup + content script never drift out of sync.

export type ThemeId = "darkGray" | "oledBlack" | "claude" | "custom";
export type Mode = "system" | "off" | "on";

export interface ThemeVars {
  bg: string; // page background
  bgElevated: string; // cards, panels, popovers
  text: string; // primary text
  textMuted: string; // secondary text, metadata
  border: string; // dividers, input borders
  accent: string; // buttons, active states
  link: string; // links
}

export const BUILTIN_THEMES: Record<Exclude<ThemeId, "custom">, ThemeVars> = {
  darkGray: {
    bg: "#1a1a1a",
    bgElevated: "#242424",
    text: "#e6e6e6",
    textMuted: "#a8a8a8",
    border: "#3a3a3a",
    accent: "#ffffff",
    link: "#6fb6ff",
  },
  oledBlack: {
    bg: "#000000",
    bgElevated: "#0d0d0d",
    text: "#f2f2f2",
    textMuted: "#9a9a9a",
    border: "#262626",
    accent: "#ffffff",
    link: "#6fb6ff",
  },
  claude: {
    bg: "#1a1614",
    bgElevated: "#251f1c",
    text: "#f2e9df",
    textMuted: "#b8a99a",
    border: "#3a322c",
    accent: "#cc785c",
    link: "#e0996f",
  },
};

export const DEFAULT_CUSTOM_THEME: ThemeVars = {
  bg: "#1a1a1a",
  bgElevated: "#242424",
  text: "#e6e6e6",
  textMuted: "#a8a8a8",
  border: "#3a3a3a",
  accent: "#7c5cff",
  link: "#7c5cff",
};

export function themeToCssVars(vars: ThemeVars): string {
  return `
    --ayudark-bg: ${vars.bg};
    --ayudark-bg-elevated: ${vars.bgElevated};
    --ayudark-text: ${vars.text};
    --ayudark-text-muted: ${vars.textMuted};
    --ayudark-border: ${vars.border};
    --ayudark-accent: ${vars.accent};
    --ayudark-link: ${vars.link};
  `.trim();
}
