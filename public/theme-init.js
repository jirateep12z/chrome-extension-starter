(function () {
  const STORAGE_KEY = 'settings';
  const LOCAL_STORAGE_KEY = 'starter_settings';
  const VALID_THEMES = ['light', 'dark', 'system'];

  function NormalizeTheme(theme) {
    return VALID_THEMES.includes(theme) ? theme : 'system';
  }

  function ApplyTheme(theme) {
    const normalized_theme = NormalizeTheme(theme);
    const is_dark =
      normalized_theme === 'dark' ||
      (normalized_theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    document.documentElement.classList.toggle('dark', is_dark);
  }

  function ReadCachedTheme() {
    const raw_settings = localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsed_settings = raw_settings ? JSON.parse(raw_settings) : null;
    return parsed_settings && typeof parsed_settings === 'object'
      ? parsed_settings.theme
      : 'system';
  }

  function CacheSyncedSettings(settings) {
    if (settings && typeof settings === 'object') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    }
  }

  try {
    ApplyTheme(ReadCachedTheme());

    if (typeof chrome !== 'undefined' && chrome.storage?.sync) {
      chrome.storage.sync
        .get(STORAGE_KEY)
        .then(data => {
          const synced_settings = data?.[STORAGE_KEY];
          if (synced_settings && typeof synced_settings === 'object') {
            CacheSyncedSettings(synced_settings);
            ApplyTheme(synced_settings.theme);
          }
        })
        .catch(error => {
          console.warn('[theme-init] Failed to read synced theme:', error);
        });
    }
  } catch (error) {
    console.warn('[theme-init] Failed to initialize theme:', error);
    ApplyTheme('system');
  }
})();
