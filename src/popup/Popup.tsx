import { useState, useEffect } from 'react';

import { CommitVisibility_DEFAULT, PopupTheme_DEFAULT } from '../constants/storage';
import {
  getStoredCommitVisibility,
  getStoredPopupTheme,
  setStoredCommitVisibility,
  setStoredPopupTheme,
} from '../storage';
import { type CommitVisibilityMode, type PopupTheme } from '../types';
import { CommitVisibilityModeControl } from './components/CommitVisibilityModeControl';
import { PopupThemeControl } from './components/PopupThemeControl';
import { sendCommitVisibilityModeToActiveTab } from './sendCommitVisibilityMode';
import { getPopupThemeClasses, resolvePopupThemeColor } from './theme/popupTheme';

export function Popup() {
  const [mode, setMode] = useState<CommitVisibilityMode>(CommitVisibility_DEFAULT);
  const [themeMode, setThemeMode] = useState<PopupTheme>(PopupTheme_DEFAULT);
  const [loading, setLoading] = useState(true);
  const theme = getPopupThemeClasses(resolvePopupThemeColor(themeMode));

  useEffect(() => {
    Promise.all([getStoredCommitVisibility(), getStoredPopupTheme()]).then(
      ([storedMode, storedThemeMode]) => {
        setMode(storedMode);
        setThemeMode(storedThemeMode);
        setLoading(false);
      },
    );
  }, []);

  async function handleModeChange(newMode: CommitVisibilityMode) {
    setMode(newMode);
    await setStoredCommitVisibility(newMode);
    await sendCommitVisibilityModeToActiveTab(newMode);
  }

  async function handleThemeModeChange(newMode: PopupTheme) {
    setThemeMode(newMode);
    await setStoredPopupTheme(newMode);
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
