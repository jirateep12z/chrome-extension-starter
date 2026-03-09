import { CHROME_STORAGE_KEY } from '@/constants';
import type { Settings } from '@/types';
import { MergeSettings } from '@/utils';
import { HandleMessage } from './services';

chrome.runtime.onInstalled.addListener(async () => {
  const stored = (await chrome.storage.sync.get(CHROME_STORAGE_KEY)) as Record<
    string,
    Settings | undefined
  >;
  const prev = stored[CHROME_STORAGE_KEY];
  await chrome.storage.sync.set({
    [CHROME_STORAGE_KEY]: MergeSettings(prev ?? {})
  });
});

chrome.runtime.onMessage.addListener(HandleMessage);
