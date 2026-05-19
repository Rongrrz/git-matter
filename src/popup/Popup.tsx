import { useState, useEffect } from 'react';

import { BrowserStorage } from '../storage';
import { type CommitVisibilityMode, type PopupTheme } from '../types';
import { broadcastCommitVisibilityMode } from './chromeMessaging';
import { CommitVisibilityModeControl } from './components/CommitVisibilityModeControl';
import { PopupThemeControl } from './components/PopupThemeControl';
import { getPopupThemeClasses, resolvePopupThemeColor } from './theme/popupTheme';

export function Popup() {
  const [mode, setMode] = useState<CommitVisibilityMode>(
    BrowserStorage.userPreferences.commitVisibility.default,
  );
  const [themeMode, setThemeMode] = useState<PopupTheme>(
    BrowserStorage.userPreferences.popupTheme.default,
  );
  const [loading, setLoading] = useState(true);
  const theme = getPopupThemeClasses(resolvePopupThemeColor(themeMode));

  useEffect(() => {
    Promise.all([
      BrowserStorage.userPreferences.commitVisibility.get(),
      BrowserStorage.userPreferences.popupTheme.get(),
    ]).then(([storedMode, storedThemeMode]) => {
      setMode(storedMode);
      setThemeMode(storedThemeMode);
      setLoading(false);
    });
  }, []);

  async function handleModeChange(newMode: CommitVisibilityMode) {
    setMode(newMode);
    await BrowserStorage.userPreferences.commitVisibility.set(newMode);
    await broadcastCommitVisibilityMode(newMode);
  }

  async function handleThemeModeChange(newMode: PopupTheme) {
    setThemeMode(newMode);
    await BrowserStorage.userPreferences.popupTheme.set(newMode);
  }

  if (loading) {
    return <div className={`${theme.shell} ${theme.mutedText}`}>Loading...</div>;
  }

  return (
    <div className={theme.shell}>
      <h1 className="mb-4 text-lg font-semibold">Git Matter</h1>

      <CommitVisibilityModeControl
        mode={mode}
        borderClassName={theme.border}
        mutedTextClassName={theme.mutedText}
        selectedClassName={theme.selected}
        onChange={handleModeChange}
      />

      <PopupThemeControl
        mode={themeMode}
        borderClassName={theme.border}
        mutedTextClassName={theme.mutedText}
        selectedClassName={theme.selected}
        onChange={handleThemeModeChange}
      />
    </div>
  );
}
