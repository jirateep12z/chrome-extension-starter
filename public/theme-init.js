(function () {
  try {
    var s = localStorage.getItem('starter_settings');
    var theme = s ? JSON.parse(s).theme : 'system';
    if (
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    }
  } catch (error) {
    console.warn('[theme-init] Failed to initialize theme:', error);
  }
})();
