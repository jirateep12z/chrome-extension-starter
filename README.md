# Chrome Extension Starter

A minimal Chrome Extension (Manifest V3) starter template — ready to use as a foundation for your next Chrome Extension. It ships a React 19 popup built with Vite, TypeScript, Tailwind CSS v4, and shadcn/ui, plus a background service worker that persists settings through `chrome.storage.sync`.

## Features

### Popup UI

- **Tabbed Layout**: Two icon tabs with tooltips — Settings and Statistics — in a 420px-wide popup.
- **Settings Panel**: Theme selector (Light / Dark / System) and an enable/disable toggle.
- **Statistics Card**: Displays a compact-formatted total count and the last updated date.
- **Save Error Feedback**: Shows an inline alert and reverts to the last saved settings when a save fails.

### Theming

- **Light / Dark / System Modes**: System mode follows the OS `prefers-color-scheme` setting and reacts to changes while the popup is open.
- **Early Theme Application**: `src/theme-init.ts` applies the cached theme before React renders to reduce theme flashing.
- **Bundled Fonts**: Inter and Noto Sans Thai variable fonts via Fontsource.

### Settings and Storage

- **Chrome Storage Sync**: Settings persist in `chrome.storage.sync` and stay in sync across open popups through `chrome.storage.onChanged`.
- **Settings Validation**: `MergeSettings` fills missing fields with defaults and discards invalid values, such as unknown themes or negative counts.
- **Serialized Saves**: Rapid setting changes are queued and saved in order.
- **Browser Fallback**: Outside the extension context (for example, `npm run dev`), settings are stored in `localStorage`.

### Background Service Worker

- **Install Initialization**: On `chrome.runtime.onInstalled`, stored settings are merged with defaults and written back.
- **Message Handling**: Handles `get-settings` and `save-settings` messages and ignores messages from other extensions.

### Developer Tooling

- **shadcn/ui Components**: A full set of UI components in `src/components/ui`.
- **Linting and Formatting**: ESLint (with Perfectionist, React, and stylistic rules) and Prettier (with import organizing and Tailwind class sorting).
- **Path Alias**: `@/` resolves to `src/`.

## Getting Started

### Prerequisites

- Node.js and npm
- Google Chrome (or another Chromium-based browser that supports Manifest V3)

### Installation

```bash
npm install
```

### Scripts

| Command            | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| `npm run dev`      | Start the Vite dev server to preview the popup in a browser tab. |
| `npm run build`    | Type-check with `tsc -b` and build the extension into `dist`.    |
| `npm run lint`     | Lint files in `src`.                                             |
| `npm run lint:fix` | Lint files in `src` and apply automatic fixes.                   |
| `npm run format`   | Format files in `src` with Prettier.                             |

### Load the Extension in Chrome

1. Build the extension: `npm run build`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked"
5. Select the `dist` folder from this project

After changing the source, run `npm run build` again and click the reload button on the extension card.

## Project Structure

```text
public/
  icons/                 # Extension icons (PNG and SVG)
  manifest.json          # Manifest V3 definition
src/
  background/            # Background service worker entry
  components/ui/         # shadcn/ui components
  features/
    popup/               # Popup app, components, and formatters
    settings/            # Settings types, storage hook, merge logic, message handler
    theme/               # Theme types, hook, and ApplyTheme helper
  hooks/                 # Shared React hooks
  lib/                   # Shared utilities
  main.tsx               # Popup entry point
  theme-init.ts          # Pre-render theme initialization
index.html               # Popup HTML
vite.config.ts           # Builds the popup and background.js into dist
```

## Customization

- **Extension Metadata**: Update the name, description, version, and icons in `public/manifest.json`.
- **Permissions**: The manifest requests only the `storage` permission. Add others in `public/manifest.json` as your extension needs them.
- **Default Settings**: Edit `src/features/settings/constants/settings.ts`, and extend `MergeSettings` to validate any new fields.

> [!NOTE]
> The statistics values (`total_count` and `last_date`) are placeholders. The template displays and validates them but does not update them; add your own logic to record activity.

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions, issues and feature requests are welcome!

## Show your support

Give a ⭐️ if this project helped you!

## Author

**Made with ❤️ by @jirateep12z**
