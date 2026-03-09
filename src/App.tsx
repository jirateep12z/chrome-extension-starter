import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { SettingsPanel } from '@/components/settings-panel';
import { StatisticsCard } from '@/components/statistics-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { TAB_VALUES } from '@/constants/app';
import { UseChromeStorage } from '@/hooks/use-chrome-storage';
import { UseTheme } from '@/hooks/use-theme';
import { Cn } from '@/lib/utils';
import type { TabValue } from '@/types/app';
import type { Theme } from '@/types/theme';
import { BarChart3, Settings } from 'lucide-react';
import { useCallback, useState } from 'react';

const LOADING_VIEW = (
  <div className="flex h-screen w-[420px] items-center justify-center bg-neutral-50 dark:bg-neutral-950">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
      <p className="text-muted-foreground text-sm">Loading...</p>
    </div>
  </div>
);

function CreateTabTriggerClassName(
  tab_value: TabValue,
  active_tab: TabValue
): string {
  return Cn(
    'px-0 hover:bg-muted/80 focus-visible:ring-[3px]',
    active_tab === tab_value &&
      'bg-background text-foreground hover:bg-background dark:border-input dark:bg-input/30 dark:text-foreground dark:hover:bg-input/30'
  );
}

function App() {
  const {
    settings,
    is_loading,
    save_error_message,
    SaveSettings,
    GetLatestSettings
  } = UseChromeStorage();
  const [active_tab, set_active_tab] = useState<TabValue>('settings');
  UseTheme(settings.theme);

  const HandleThemeChange = useCallback(
    (theme: Theme) => {
      SaveSettings({ ...GetLatestSettings(), theme });
    },
    [SaveSettings, GetLatestSettings]
  );

  const HandleEnabledChange = useCallback(
    (is_enabled: boolean) => {
      SaveSettings({ ...GetLatestSettings(), is_enabled });
    },
    [SaveSettings, GetLatestSettings]
  );

  const HandleTabValueChange = useCallback(
    (next_tab: string) => {
      if (TAB_VALUES.has(next_tab)) {
        set_active_tab(next_tab as TabValue);
      }
    },
    [set_active_tab]
  );

  if (is_loading) {
    return LOADING_VIEW;
  }

  return (
    <div className="h-screen w-[420px] overflow-y-auto bg-neutral-50 p-4 dark:bg-neutral-950">
      <Header />
      <Tabs
        value={active_tab}
        onValueChange={HandleTabValueChange}
        className="mt-4"
      >
        <TooltipProvider>
          <TabsList className="grid w-full grid-cols-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="settings"
                  className={CreateTabTriggerClassName('settings', active_tab)}
                  aria-label="Settings"
                >
                  <Settings />
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Settings</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="statistics"
                  className={CreateTabTriggerClassName(
                    'statistics',
                    active_tab
                  )}
                  aria-label="Statistics"
                >
                  <BarChart3 />
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Statistics</TooltipContent>
            </Tooltip>
          </TabsList>
        </TooltipProvider>
        <TabsContent value="settings" className="mt-4 space-y-4">
          <SettingsPanel
            theme={settings.theme}
            is_enabled={settings.is_enabled}
            OnThemeChange={HandleThemeChange}
            OnEnabledChange={HandleEnabledChange}
          />
        </TabsContent>
        <TabsContent value="statistics" className="mt-4">
          <StatisticsCard statistics={settings.statistics} />
        </TabsContent>
      </Tabs>
      {save_error_message ? (
        <p role="alert" className="text-destructive mt-3 text-center text-xs">
          {save_error_message}
        </p>
      ) : null}
      <Footer />
    </div>
  );
}

export default App;
