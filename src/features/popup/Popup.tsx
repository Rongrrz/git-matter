import { useState, useEffect } from 'react';

import { broadcastCommitVisibilityMode } from '@/features/popup/chromeMessaging';
import { CommitVisibilityModeControl } from '@/features/popup/components/CommitVisibilityModeControl';
import { PopupThemeControl } from '@/features/popup/components/PopupThemeControl';
import { getPopupThemeClasses, resolvePopupThemeColor } from '@/features/popup/theme/popupTheme';
import {
  commitVisibilityPreference,
  popupThemePreference,
} from '@/shared/storage/preferences/definitions';
import { type CommitVisibilityMode, type PopupTheme } from '@/shared/types/userPreferenceOptions';

export function Popup() {
  const [mode, setMode] = useState<CommitVisibilityMode>(commitVisibilityPreference.default);
  const [themeMode, setThemeMode] = useState<PopupTheme>(popupThemePreference.default);
  const [loading, setLoading] = useState(true);
  const theme = getPopupThemeClasses(resolvePopupThemeColor(themeMode));

  useEffect(() => {
    Promise.all([commitVisibilityPreference.get(), popupThemePreference.get()]).then(
      ([storedMode, storedThemeMode]) => {
        setMode(storedMode);
        setThemeMode(storedThemeMode);
        setLoading(false);
      },
    );
  }, []);

  async function handleModeChange(newMode: CommitVisibilityMode) {
    setMode(newMode);
    await commitVisibilityPreference.set(newMode);
    await broadcastCommitVisibilityMode(newMode);
  }

  async function handleThemeModeChange(newMode: PopupTheme) {
    setThemeMode(newMode);
    await popupThemePreference.set(newMode);
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
