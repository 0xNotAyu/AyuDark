# PRD — Medium Dark Mode Extension

## 1. Problem
Medium has no native dark mode anymore. Existing third-party extensions only reskin the article read/write page — profile, settings, lists, search, and other Medium routes stay bright white. Since Medium is a single-page app (SPA), most naive extensions also break when navigating between pages without a full reload.

## 2. Goal
A lightweight browser extension (HTML/CSS/TS, Manifest V3) that applies a consistent dark theme across **every** `medium.com` page (and custom Medium domains, e.g. publications on their own domain) — home feed, article read view, editor/write view, profile, settings, lists, search, notifications, stats/dashboard, responses/comments — and keeps working as the user navigates without refreshing.

## 3. Target Browsers
Any Chromium-based browser: Chrome, Brave, Edge, Opera, Vivaldi, Arc. Built on Manifest V3, no Chrome-only APIs, so it should load unmodified in all of them (Brave/Edge/Opera all support the Chrome Web Store MV3 API surface).

## 4. Core Features

### 4.1 Site-wide coverage
- Injects on `*.medium.com/*` and (v1.1+) user-added custom domains for Medium-powered publications.
- A single global content script + CSS variable layer applies to every route, not just `/[user]/[slug]`.
- Medium is a client-side-routed SPA — a `MutationObserver` on `<body>` (plus `history.pushState`/`popstate` hooks) re-applies/adjusts the theme on route changes, lazy-loaded content, and infinite-scroll feed items, without a full page reload.

### 4.2 Modes (how dark mode turns on)
Three modes, selectable in the popup:
1. **System** (default) — follows OS/browser `prefers-color-scheme`. Switches live if the OS theme changes mid-session.
2. **Off** — always show Medium's normal light theme.
3. **On** — always dark, regardless of system setting.

### 4.3 Themes (what dark looks like)
When dark is active (via System-resolved-dark or On), the user picks a skin:
- **Dark Gray** — soft dark, close to Medium's old official dark mode (`#1a1a1a` background, warm off-white text, muted borders). Default skin.
- **OLED Black** — true black (`#000000`) background for OLED screens, high-contrast text.
- **Claude** — warm dark theme using Anthropic/Claude-inspired palette (near-black warm base, cream text, terracotta/orange accent for links and highlights).
- **Custom** — user picks background, text, and accent colors via color pickers in the popup; saved as a 4th persisted skin slot.

Each skin is defined as a CSS custom-property set (`--md-bg`, `--md-bg-elevated`, `--md-text`, `--md-text-muted`, `--md-border`, `--md-accent`, `--md-link`) injected as an inline `<style>` block, so switching skins is instant with no re-injection cost.

### 4.4 Popup UI
Small popup (HTML/CSS/TS, no framework needed):
- Mode selector: System / Off / On (segmented control)
- Theme skin selector: 4 swatches (Dark Gray, OLED Black, Claude, Custom) — disabled/greyed when mode is Off
- Custom theme: expandable section with 3 color pickers (background, text, accent) + live preview swatch, shown only when Custom is selected
- Footer: version number, "Report an issue" link

### 4.5 Persistence & sync
- Settings stored via `chrome.storage.sync` (mode, selected skin, custom colors) so they follow the user across signed-in Chrome profiles/devices.
- Falls back to `chrome.storage.local` if sync is unavailable.

## 5. Non-goals (v1)
- No theming of embedded third-party content Medium can't control (e.g. embedded tweets, YouTube players) beyond a dim/invert wrapper if trivial.
- No Firefox support in v1 (revisit post-launch; MV3 content-script code is largely portable).
- No per-article theme overrides.
- No image inversion/filtering (leave images/photos untouched — only chrome/UI/text surfaces are themed).

## 6. Key Technical Risks & Handling
| Risk | Handling |
|---|---|
| Medium ships frequent UI/DOM changes | Theme via CSS custom properties + broad selector strategy (semantic tags, `prefers-color-scheme`-style overrides, `filter`-based fallback for unstyled areas) rather than brittle class-name targeting |
| SPA route changes don't re-trigger content scripts | `MutationObserver` + History API patch to detect navigation and re-scan new DOM subtrees |
| Flash of light content (FOUC) before script runs | Inject a blocking `<style>` tag at `document_start` (before Medium's own styles paint) with base dark background, then refine with full stylesheet once DOM is ready |
| Editor page (write view) uses rich contenteditable areas | Explicit, tested override rules for the editor's toolbar, contenteditable body, and image caption inputs, verified separately from read view |
| Settings/profile pages use different layout components than articles | QA checklist covers every route in section 7, not just article view |

## 7. Pages That Must Be Themed (QA checklist)
- Home feed (`/`)
- Article read view (`/@user/slug`)
- Editor / write view (`/new-story`, `/p/{id}/edit`)
- Profile (`/@user`)
- Followers/Following lists
- Settings (`/me/settings`)
- Notifications (`/me/notifications`)
- Stats dashboard (`/me/stats`)
- Search results (`/search`)
- Publication pages
- Responses/comments panel (side drawer)
- Lists (`/@user/list/...`)

## 8. Success Criteria
- Every route in section 7 renders with no unstyled white flashes or bright panels, verified manually per route.
- No visible FOUC on cold page load.
- Theme survives SPA navigation without extension reload.
- Popup settings persist across browser restarts and apply within 1 render frame of toggling.
