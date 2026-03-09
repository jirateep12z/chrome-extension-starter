# Chrome Extension Starter

A minimal Chrome Extension starter template — ready to use as a foundation for your next Chrome Extension.

Chrome Extension Starter helps developers start a Manifest V3 extension with the popup, background service worker, and settings storage already connected. It ships a React 19 popup built with Vite, TypeScript, Tailwind CSS v4, and shadcn/ui, with light, dark, and system themes, and a background service worker that validates and persists settings through `chrome.storage.sync`.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Features](#features)
- [Project Structure](#project-structure)
- [Customization](#customization)
- [Limitations](#limitations)
- [Show your support](#show-your-support)
- [Author](#author)
- [API](#api)
- [License](#license)

## Install

Prerequisites:

- Node.js `^20.19.0` or `>=22.12.0` (required by Vite 8) and npm
- Google Chrome or another Chromium-based browser that supports Manifest V3

Install the dependencies from the project root:

```sh
npm install
```

## Usage

### Build and Load the Extension

Build the extension into the `dist` folder:

```sh
npm run build
```

The build type-checks the project with `tsc -b`, then writes the popup, the service worker, and the files from `public/` into `dist`:

```text
dist/
  assets/
  icons/
  background.js
  index.html
  manifest.json
```

To load the build in Chrome:

1. Open `chrome://extensions/`.
2. Turn on **Developer mode** in the top-right corner.
3. Click **Load unpacked**.
4. Select the `dist` folder from this project.

After you change the source, run `npm run build` again and click the reload button on the extension card.

### Preview the Popup in a Browser Tab

Start the Vite dev server:

```sh
npm run dev
```

Open the local address that Vite prints. Outside the extension context, the popup stores settings in `localStorage` instead of `chrome.storage.sync`, and the background service worker does not run.

### Scripts

| Command            | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| `npm run dev`      | Start the Vite dev server to preview the popup in a browser tab. |
| `npm run build`    | Type-check with `tsc -b` and build the extension into `dist`.    |
| `npm run lint`     | Lint files in `src`.                                             |
| `npm run lint:fix` | Lint files in `src` and apply automatic fixes.                   |
| `npm run format`   | Format files in `src` with Prettier.                             |

## Features

### Popup UI

- **Fixed Popup Size**: Renders at 420 × 600 px, set in `src/app.css`.
- **Tabbed Layout**: Switches between Settings and Statistics through icon tabs that have tooltips and accessible labels.
- **Settings Panel**: Provides a theme selector (Light, Dark, or System) and an **Extension enabled** switch.
- **Statistics Card**: Shows the total count, abbreviated from 1,000 upward (for example, `1.2K`), and the last updated date, or `Never` when no date is stored.
- **Loading State**: Shows a spinner with `Loading...` until the settings finish loading.
- **Save Error Feedback**: Announces a failed save in an alert below the tabs and reverts the popup to the last saved settings.
- **Footer**: Shows the author credit and a **Buy me a coffee** button that opens the donation page in a new tab.

### Theming

- **Light, Dark, and System Modes**: System mode follows the operating system's `prefers-color-scheme` setting and updates when it changes while the popup is open.
- **Early Theme Application**: `src/theme-init.ts` applies the theme cached in `localStorage` before React renders, then refreshes it from `chrome.storage.sync`, to reduce theme flashing.
- **Bundled Fonts**: Includes the Inter and Noto Sans Thai variable fonts through Fontsource.

### Settings and Storage

- **Chrome Storage Sync**: Persists settings in `chrome.storage.sync` under the `settings` key and keeps open popups in sync through `chrome.storage.onChanged`.
- **Settings Validation**: `MergeSettings` fills missing fields with defaults and replaces invalid values, such as unknown themes, negative or non-finite counts, and unparsable dates, with their defaults.
- **Serialized Saves**: Runs one save at a time. Changes made during a save are coalesced, so only the latest pending settings are saved next.
- **Browser Fallback**: Stores settings in `localStorage` under the `starter_settings` key when the popup runs outside the extension context, such as with `npm run dev`.

### Background Service Worker

- **Install Initialization**: Merges stored settings with defaults and writes them back on `chrome.runtime.onInstalled`.
- **Message Handling**: Handles `get-settings` and `save-settings` messages, validates saved settings, and ignores messages from other extensions. See [API](#api).

### Developer Tooling

- **shadcn/ui Components**: Includes a full set of UI components in `src/components/ui`.
- **Strict TypeScript**: Enables strict type checking, including checks for unused locals and parameters.
- **Linting and Formatting**: Configures ESLint with Perfectionist, React, React Hooks, and stylistic rules, and Prettier with import organizing and Tailwind class sorting.
- **Path Alias**: Resolves `@/` to `src/`.

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
- **Default Settings**: Edit `src/features/settings/constants/settings.ts`, and extend `MergeSettings` in `src/features/settings/lib/merge-settings.ts` to validate any new fields. `MergeSettings` returns only the fields it validates.
- **Popup Size**: Change the `width` and `height` in `src/app.css`.

## Limitations

> [!NOTE]
> The statistics values (`total_count` and `last_date`) are placeholders. The template displays and validates them but does not update them; add your own logic to record activity.

- The **Extension enabled** switch only stores `is_enabled`. Read that value in your own logic to turn features on or off.
- The project has no automated tests.

## Show your support

Give a ⭐️ if this project helped you!

## Author

**Made with ❤️ by @jirateep12z**

## API

The background service worker answers messages sent with `chrome.runtime.sendMessage` from this extension. It ignores messages from other extensions.

### Settings Shape

```ts
type Settings = {
  theme: 'light' | 'dark' | 'system';
  is_enabled: boolean;
  statistics: {
    total_count: number;
    last_date: string | null;
  };
};
```

The defaults are `theme: 'system'`, `is_enabled: true`, `total_count: 0`, and `last_date: null`.

### `get-settings`

Returns the stored settings merged with the defaults. If storage cannot be read, it returns the defaults.

```ts
const settings = await chrome.runtime.sendMessage({ action: 'get-settings' });
```

### `save-settings`

Validates `settings` with `MergeSettings` and stores the result in `chrome.storage.sync`. It responds with `{ success: true }` on success, or `{ success: false, error: string }` when the payload is not an object or the write fails.

```ts
const response = await chrome.runtime.sendMessage({
  action: 'save-settings',
  settings: { theme: 'dark', is_enabled: true }
});
```

Fields you leave out of `settings` are reset to their defaults, so send the complete settings object to keep the current values.

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2026 Jirateep Lumvasana
