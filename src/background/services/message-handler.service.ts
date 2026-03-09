import { DEFAULT_SETTINGS } from '@/constants/settings';
import { CHROME_STORAGE_KEY } from '@/constants/storage';
import { MergeSettings } from '@/lib/merge-settings';
import type { GetSettingsMessage, SaveSettingsMessage } from '@/types/message';
import type { Settings } from '@/types/settings';

type IncomingMessage = GetSettingsMessage | SaveSettingsMessage;

export function HandleMessage(
  message: IncomingMessage,
  _: chrome.runtime.MessageSender,
  SendResponse: (response: unknown) => void
): boolean {
  if (message.action === 'get-settings') {
    chrome.storage.sync
      .get(CHROME_STORAGE_KEY)
      .then(data => {
        const stored = data[CHROME_STORAGE_KEY] as
          | Partial<Settings>
          | undefined;
        SendResponse(MergeSettings(stored ?? {}));
      })
      .catch(error => {
        console.error(
          '[background] Failed to read settings from storage:',
          error
        );
        SendResponse(DEFAULT_SETTINGS);
      });
    return true;
  }
  if (message.action === 'save-settings') {
    const validated = MergeSettings(message.settings as Partial<Settings>);
    chrome.storage.sync
      .set({ [CHROME_STORAGE_KEY]: validated })
      .then(() => {
        SendResponse({ success: true });
      })
      .catch(error => {
        SendResponse({ success: false, error: (error as Error).message });
      });
    return true;
  }
  return false;
}
