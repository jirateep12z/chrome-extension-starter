import { CHROME_STORAGE_KEY, DEFAULT_SETTINGS } from '@/constants';
import type {
  GetSettingsMessage,
  SaveSettingsMessage,
  Settings
} from '@/types';
import { MergeSettings } from '@/utils';

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
    chrome.storage.sync
      .set({ [CHROME_STORAGE_KEY]: message.settings })
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
