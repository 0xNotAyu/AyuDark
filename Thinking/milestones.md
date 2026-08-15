# Milestones — Medium Dark Mode Extension

## M1 — Project Scaffold
- Manifest V3 `manifest.json` (content script, popup, storage, host permissions for `*.medium.com`)
- TypeScript + build setup (esbuild or vite, no framework) producing `dist/` for unpacked loading
- Folder structure: `src/content/`, `src/popup/`, `src/shared/` (theme definitions, storage helpers)
- Load unpacked in Chrome, confirm content script fires on a Medium article

## M2 — Theme Engine (core CSS layer)
- Define the 4 skins (Dark Gray, OLED Black, Claude, Custom) as CSS custom-property maps in `src/shared/themes.ts`
- Build the injected stylesheet: base rules mapped to `--md-bg`, `--md-text`, `--md-accent` etc., covering generic surfaces (backgrounds, text, borders, links, buttons, inputs)
- Inject at `document_start` with a minimal blocking style to kill FOUC, then swap in the full stylesheet at `document_idle`
- Manual test: article read view only, all 4 skins render correctly

## M3 — Site-Wide Coverage
- Audit and add override rules per route from the PRD §7 checklist: home feed, profile, settings, notifications, stats, search, lists, publication pages
- Editor/write view special case: contenteditable body, floating toolbar, image caption fields
- Responses/comments side drawer
- Manual pass through every route with dark mode on, fix unstyled elements route by route

## M4 — SPA Navigation Handling
- Patch `history.pushState`/`replaceState`, listen for `popstate`
- `MutationObserver` on root container to catch lazy-loaded/infinite-scroll content and re-apply theme classes to new nodes
- Test: navigate feed → article → profile → settings → back, all in one tab load, without a manual refresh, confirm theme never drops

## M5 — Mode Logic (System / Off / On)
- Read `prefers-color-scheme` via `matchMedia`, live-listen for OS theme changes
- Mode state machine: System (follow OS) / Off (force light) / On (force dark)
- Wire mode to whether the themed stylesheet is injected at all

## M6 — Popup UI
- Build popup HTML/CSS/TS: mode segmented control, 4 theme swatches, custom color pickers with live preview
- Wire popup to `chrome.storage.sync` (fallback `local`), read/write settings
- Content script listens for `storage.onChanged` and re-applies instantly without reload

## M7 — Custom Theme
- Color picker UI (background / text / accent) in popup, disabled until "Custom" skin selected
- Live preview swatch updates as user picks colors
- Persist custom colors separately from the 3 built-in skins so switching away and back preserves them

## M8 — Polish, Cross-Browser QA, Packaging
- Manual QA pass on Chrome, Brave, Edge (confirm MV3 parity, no Chrome-only API usage)
- Icon set, popup visual polish, version bump, `README.md` with install-unpacked instructions
- Zip build for Chrome Web Store submission; write store listing copy and screenshots
