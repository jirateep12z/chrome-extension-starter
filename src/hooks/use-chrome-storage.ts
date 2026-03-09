import { DEFAULT_SETTINGS } from '@/constants/settings';
import {
  CHROME_STORAGE_AREA,
  CHROME_STORAGE_KEY,
  LOCAL_STORAGE_KEY
} from '@/constants/storage';
import { IsChromeExtension } from '@/libs/is-chrome-extension';
import { MergeSettings } from '@/libs/merge-settings';
import type { Settings } from '@/types/settings';
import { useCallback, useEffect, useRef, useState } from 'react';

export function UseChromeStorage() {
  const [settings, set_settings] = useState<Settings>(DEFAULT_SETTINGS);
  const [is_loading, set_is_loading] = useState(true);
  const settings_ref = useRef<Settings>(DEFAULT_SETTINGS);
  const save_in_flight = useRef<number>(0);

  const LoadSettings = useCallback(async () => {
    set_is_loading(true);
    try {
      if (IsChromeExtension()) {
        const response = await chrome.runtime.sendMessage({
          action: 'get-settings'
        });
        const partial = response as Partial<Settings>;
        set_settings(MergeSettings(partial));
      } else {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            set_settings(MergeSettings(parsed as Partial<Settings>));
          }
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      set_is_loading(false);
    }
  }, []);

  const SaveSettings = useCallback(async (new_settings: Settings) => {
    const previous_settings = settings_ref.current;
    save_in_flight.current += 1;
    set_settings(new_settings);
    try {
      if (IsChromeExtension()) {
        const response = await chrome.runtime.sendMessage({
          action: 'save-settings',
          settings: new_settings
        });
        if (!response?.success) {
          console.error('Failed to save settings:', response?.error);
          set_settings(previous_settings);
        }
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(new_settings));
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      set_settings(previous_settings);
    } finally {
      save_in_flight.current -= 1;
    }
  }, []);

  useEffect(() => {
    settings_ref.current = settings;
  }, [settings]);

  useEffect(() => {
    LoadSettings();
  }, [LoadSettings]);

  useEffect(() => {
    if (!IsChromeExtension()) return;
    const HandleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      area_name: string
    ) => {
      if (save_in_flight.current > 0) return;
      if (area_name === CHROME_STORAGE_AREA && changes[CHROME_STORAGE_KEY]) {
        const new_value = changes[CHROME_STORAGE_KEY].newValue;
        if (new_value && typeof new_value === 'object') {
          set_settings(current => {
            const next = MergeSettings(new_value as Partial<Settings>);
            return JSON.stringify(current) === JSON.stringify(next)
              ? current
              : next;
          });
        } else {
          set_settings(DEFAULT_SETTINGS);
        }
      }
    };
    chrome.storage.onChanged.addListener(HandleStorageChange);
    return () => {
      chrome.storage.onChanged.removeListener(HandleStorageChange);
    };
  }, []);

  return { settings, is_loading, SaveSettings, settings_ref };
}
