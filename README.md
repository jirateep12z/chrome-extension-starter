# Chrome Extension Starter

A minimal Chrome Extension starter template — ready to use as a foundation for your next Chrome Extension.

## ✨ What's Included

- **Settings Panel** — Theme switcher (Light / Dark / System) and an enable/disable toggle
- **Statistics Card** — Displays total action count and last updated date
- **Chrome Storage Sync** — Settings are persisted via `chrome.storage.sync` with safe migration via `MergeSettings`
- **Background Service Worker** — Handles `onInstalled` initialization and runtime message passing
- **Dark / Light / System Theme** — Automatically follows the OS preference when set to System
- **Tabs Layout** — Two-tab UI: Settings and Stats

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Lint & auto-fix
npm run lint

# Format code
npm run format
```

### Load Extension in Chrome

1. Build the extension: `npm run build`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `dist` folder from this project

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you!

## 📝 Author

**Made with ❤️ by @jirateep12z**
