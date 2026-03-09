import {
  CHROME_STORAGE_KEY,
  HandleMessage,
  MergeSettings,
  type Settings
} from '@/features/settings';

chrome.runtime.onInstalled.addListener(async () => {
  try {
    const stored = (await chrome.storage.sync.get(
      CHROME_STORAGE_KEY
    )) as Record<string, Settings | undefined>;
    const prev = stored[CHROME_STORAGE_KEY];

    await chrome.storage.sync.set({
      [CHROME_STORAGE_KEY]: MergeSettings(prev ?? {})
    });
  } catch (error) {
    console.error(
      '[background] Failed to initialize settings on install:',
      error
    );
  }
});

chrome.runtime.onMessage.addListener(HandleMessage);
