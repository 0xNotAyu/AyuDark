// Theme engine for ayuDark.
//
// Medium's own stylesheet defines a set of ~27 CSS custom properties
// (design tokens) on :root — e.g. --color-bg-neutral-primary,
// --color-fg-neutral-secondary — and nearly every component on the site
// reads its colors from them instead of hardcoding hex values. Medium even
// ships an unused "color-scheme: light" declaration and a disabled
// "enableDarkModeV0" feature flag, suggesting a dark token set was planned.
//
// Instead of inverting pixels (which desaturates/muddies real colors and
// can't distinguish "this should stay a photo" from "this should stay
// text"), we simply redefine Medium's own tokens. Every component that
// already reads var(--color-bg-neutral-primary) re-themes itself for free.

export type ThemeId = "darkGray" | "oledBlack" | "claude" | "custom";
export type Mode = "system" | "off" | "on";

/** Mirrors Medium's real --color-* token set (see lite-color-scheme-tokens). */
export interface MediumTokens {
  bgNeutralPrimary: string;
  bgNeutralSecondary: string;
  bgNeutralTertiary: string;
  bgNeutralQuaternary: string;
  bgBrandPrimary: string;
  bgBrandPrimaryHover: string;
  bgAccentSecondary: string;
  bgAccentSecondaryHover: string;
  bgAccentTertiary: string;
  bgAccentQuaternary: string;
  bgErrorPrimary: string;
  bgErrorPrimaryHover: string;
  bgUtilityYellowPrimary: string;
  bgUtilityBluePrimary: string;
  fgNeutralPrimary: string;
  fgNeutralPrimaryHover: string;
  fgNeutralSecondary: string;
  fgNeutralSecondaryHover: string;
  fgNeutralTertiary: string; // text color used ON TOP of brand/inverse fills
  fgAccentPrimary: string; // e.g. the green "Following" text
  fgAccentPrimaryHover: string;
  fgErrorPrimary: string;
  fgErrorPrimaryHover: string;
  borderNeutralPrimary: string;
  borderNeutralPrimaryHover: string;
  borderNeutralSecondary: string; // e.g. active tab underline
  borderNeutralSecondaryHover: string;
  borderNeutralTertiary: string;
  borderNeutralTertiaryHover: string;
  borderBrandPrimary: string;
  borderErrorPrimary: string;
  borderErrorPrimaryHover: string;
}

export const BUILTIN_TOKEN_THEMES: Record<Exclude<ThemeId, "custom">, MediumTokens> = {
  darkGray: {
  bgNeutralPrimary: "#1a1a1a",
  bgNeutralSecondary: "#242424",
  bgNeutralTertiary: "#2a2a2a",
  bgNeutralQuaternary: "#3a3a3a",

  bgBrandPrimary: "#f2f2f2",
  // bgBrandPrimary: "#1a1a1a",
  bgBrandPrimaryHover: "#ffffff",
  // bgBrandPrimaryHover: "#1a1a1a",

  bgAccentSecondary: "#e8e8e8",
  bgAccentSecondaryHover: "#f2f2f2",
  bgAccentTertiary: "#dcdcdc",
  bgAccentQuaternary: "#cfcfcf",

  bgErrorPrimary: "#c94a4a",
  bgErrorPrimaryHover: "#b63636",

  bgUtilityYellowPrimary: "#2b260f",
  bgUtilityBluePrimary: "#10202b",

  fgNeutralPrimary: "#e6e6e6",
  fgNeutralPrimaryHover: "#ffffff",
  fgNeutralSecondary: "#a8a8a8",
  fgNeutralSecondaryHover: "#cfcfcf",
  fgNeutralTertiary: "#1a1a1a",

  fgAccentPrimary: "#f2f2f2",
  fgAccentPrimaryHover: "#ffffff",

  fgErrorPrimary: "#ff6b6b",
  fgErrorPrimaryHover: "#ff8787",

  borderNeutralPrimary: "#3a3a3a",
  borderNeutralPrimaryHover: "#4a4a4a",
  borderNeutralSecondary: "#e6e6e6",
  borderNeutralSecondaryHover: "#ffffff",
  borderNeutralTertiary: "#333333",
  borderNeutralTertiaryHover: "#444444",

  borderBrandPrimary: "#e6e6e6",

  borderErrorPrimary: "#c94a4a",
  borderErrorPrimaryHover: "#b63636",
},
  oledBlack: {
    bgNeutralPrimary: "#000000",
    bgNeutralSecondary: "#0d0d0d",
    bgNeutralTertiary: "#141414",
    bgNeutralQuaternary: "#262626",
    bgBrandPrimary: "#f2f2f2",
    bgBrandPrimaryHover: "#ffffff",
    bgAccentSecondary: "#122313",
    bgAccentSecondaryHover: "#1a301b",
    bgAccentTertiary: "#0e1c0f",
    bgAccentQuaternary: "#0a140b",
    bgErrorPrimary: "#c94a4a",
    bgErrorPrimaryHover: "#b63636",
    bgUtilityYellowPrimary: "#1f1b08",
    bgUtilityBluePrimary: "#0a1620",
    fgNeutralPrimary: "#f2f2f2",
    fgNeutralPrimaryHover: "#ffffff",
    fgNeutralSecondary: "#9a9a9a",
    fgNeutralSecondaryHover: "#c2c2c2",
    fgNeutralTertiary: "#000000",
    fgAccentPrimary: "#3fce3a",
    fgAccentPrimaryHover: "#5fe85a",
    fgErrorPrimary: "#ff6b6b",
    fgErrorPrimaryHover: "#ff8787",
    borderNeutralPrimary: "#262626",
    borderNeutralPrimaryHover: "#333333",
    borderNeutralSecondary: "#f2f2f2",
    borderNeutralSecondaryHover: "#ffffff",
    borderNeutralTertiary: "#1f1f1f",
    borderNeutralTertiaryHover: "#2c2c2c",
    borderBrandPrimary: "#f2f2f2",
    borderErrorPrimary: "#c94a4a",
    borderErrorPrimaryHover: "#b63636",
  },
  claude: {
    bgNeutralPrimary: "#1a1614",
    bgNeutralSecondary: "#241e1a",
    bgNeutralTertiary: "#2a2320",
    bgNeutralQuaternary: "#3a322c",
    bgBrandPrimary: "#cc785c",
    bgBrandPrimaryHover: "#d98a70",
    bgAccentSecondary: "#2e2119",
    bgAccentSecondaryHover: "#3a2a1f",
    bgAccentTertiary: "#261c15",
    bgAccentQuaternary: "#1e1610",
    bgErrorPrimary: "#c94a4a",
    bgErrorPrimaryHover: "#b63636",
    bgUtilityYellowPrimary: "#2b260f",
    bgUtilityBluePrimary: "#101f2a",
    fgNeutralPrimary: "#f2e9df",
    fgNeutralPrimaryHover: "#ffffff",
    fgNeutralSecondary: "#b8a99a",
    fgNeutralSecondaryHover: "#d4c6b8",
    fgNeutralTertiary: "#1a1614",
    fgAccentPrimary: "#e0996f",
    fgAccentPrimaryHover: "#eeb18f",
    fgErrorPrimary: "#ff8080",
    fgErrorPrimaryHover: "#ff9999",
    borderNeutralPrimary: "#3a322c",
    borderNeutralPrimaryHover: "#4a4038",
    borderNeutralSecondary: "#f2e9df",
    borderNeutralSecondaryHover: "#ffffff",
    borderNeutralTertiary: "#332b25",
    borderNeutralTertiaryHover: "#453b33",
    borderBrandPrimary: "#cc785c",
    borderErrorPrimary: "#c94a4a",
    borderErrorPrimaryHover: "#b63636",
  },
};

/** What the popup's 3 color pickers collect for the Custom skin. */
export interface CustomSeed {
  bg: string;
  text: string;
  accent: string;
}

export const DEFAULT_CUSTOM_SEED: CustomSeed = {
  bg: "#1a1a1a",
  text: "#e6e6e6",
  accent: "#7c5cff",
};

// --- tiny color math (no deps, runs in the content script) ---

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return "#" + [r, g, b].map((c) => clamp(c).toString(16).padStart(2, "0")).join("");
}

/** Mix `hex` toward `target` by `amount` (0 = hex, 1 = target). */
function mix(hex: string, target: string, amount: number): string {
  const a = hexToRgb(hex);
  const b = hexToRgb(target);
  const blended: [number, number, number] = [
    a[0] + (b[0] - a[0]) * amount,
    a[1] + (b[1] - a[1]) * amount,
    a[2] + (b[2] - a[2]) * amount,
  ];
  return rgbToHex(blended);
}

const lighten = (hex: string, amount: number) => mix(hex, "#ffffff", amount);

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => c / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const isLight = (hex: string) => relativeLuminance(hex) > 0.5;

/**
 * Derives a full Medium token set from the 3 colors the user picks in the
 * popup (background, text, accent). Everything else — hover states,
 * secondary surfaces, borders — is computed relative to those.
 */
export function deriveTokensFromSeed(seed: CustomSeed): MediumTokens {
  const { bg, text, accent } = seed;
  const towardText = (h: string, amount: number) =>
    isLight(bg) ? mix(h, text, amount) : lighten(h, amount);
  const bgSecondary = towardText(bg, 0.08);
  const bgTertiary = towardText(bg, 0.14);
  const bgQuaternary = towardText(bg, 0.28);
  const textMuted = mix(text, bg, 0.4);
  const border = towardText(bg, 0.18);
  const borderHover = towardText(bg, 0.26);
  const accentHover = lighten(accent, 0.12);
  const onAccentText = isLight(accent) ? "#1a1a1a" : "#ffffff";

  return {
    bgNeutralPrimary: bg,
    bgNeutralSecondary: bgSecondary,
    bgNeutralTertiary: bgTertiary,
    bgNeutralQuaternary: bgQuaternary,
    bgBrandPrimary: accent,
    bgBrandPrimaryHover: accentHover,
    bgAccentSecondary: mix(accent, bg, 0.8),
    bgAccentSecondaryHover: mix(accent, bg, 0.7),
    bgAccentTertiary: mix(accent, bg, 0.85),
    bgAccentQuaternary: mix(accent, bg, 0.9),
    bgErrorPrimary: "#c94a4a",
    bgErrorPrimaryHover: "#b63636",
    bgUtilityYellowPrimary: mix("#fffae1", bg, 0.85),
    bgUtilityBluePrimary: mix("#e5f2ff", bg, 0.85),
    fgNeutralPrimary: text,
    fgNeutralPrimaryHover: isLight(bg) ? mix(text, "#000000", 0.2) : lighten(text, 0.15),
    fgNeutralSecondary: textMuted,
    fgNeutralSecondaryHover: mix(textMuted, text, 0.4),
    fgNeutralTertiary: onAccentText,
    fgAccentPrimary: accent,
    fgAccentPrimaryHover: accentHover,
    fgErrorPrimary: "#ff6b6b",
    fgErrorPrimaryHover: "#ff8787",
    borderNeutralPrimary: border,
    borderNeutralPrimaryHover: borderHover,
    borderNeutralSecondary: text,
    borderNeutralSecondaryHover: mix(text, "#ffffff", 0.2),
    borderNeutralTertiary: border,
    borderNeutralTertiaryHover: borderHover,
    borderBrandPrimary: accent,
    borderErrorPrimary: "#c94a4a",
    borderErrorPrimaryHover: "#b63636",
  };
}

/** Converts our camelCase token object into Medium's real --color-* var names. */
export function tokensToCssVars(t: MediumTokens): string {
  const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
  return Object.entries(t)
    .map(([key, value]) => `--color-${kebab(key)}: ${value};`)
    .join("\n      ");
}
