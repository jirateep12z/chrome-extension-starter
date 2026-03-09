import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { SettingsPanel } from '@/components/settings-panel';
import { StatisticsCard } from '@/components/statistics-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UseChromeStorage } from '@/hooks/use-chrome-storage';
import { UseTheme } from '@/hooks/use-theme';
import type { Theme } from '@/types';
import { BarChart3, Settings } from 'lucide-react';
import { useEffect } from 'react';

function App() {
  const { settings, is_loading, SaveSettings } = UseChromeStorage();

  const { ChangeTheme } = UseTheme();

  useEffect(() => {
    ChangeTheme(settings.theme);
  }, [settings.theme, ChangeTheme]);

  const HandleThemeChange = (theme: Theme) => {
    SaveSettings({ ...settings, theme });
  };

  const HandleEnabledChange = (is_enabled: boolean) => {
    SaveSettings({ ...settings, is_enabled });
  };

  if (is_loading) {
    return (
      <div className="flex h-[600px] w-[420px] items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[600px] w-[420px] bg-neutral-50 p-4 dark:bg-neutral-950">
      <Header />
      <Tabs defaultValue="settings" className="mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings" className="text-xs">
            <Settings className="mr-1 h-3.5 w-3.5" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="stats" className="text-xs">
            <BarChart3 className="mr-1 h-3.5 w-3.5" />
            Stats
          </TabsTrigger>
        </TabsList>
        <TabsContent value="settings" className="mt-4 space-y-4">
          <SettingsPanel
            theme={settings.theme}
            is_enabled={settings.is_enabled}
            OnThemeChange={HandleThemeChange}
            OnEnabledChange={HandleEnabledChange}
          />
        </TabsContent>
        <TabsContent value="stats" className="mt-4">
          <StatisticsCard statistics={settings.statistics} />
        </TabsContent>
      </Tabs>
      <Footer />
    </div>
  );
}

export default App;
