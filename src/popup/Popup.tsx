import { useState, useEffect } from "react";
import { type CommitVisibilityMode, type PopupTheme } from "../types";
import {
  getStoredCommitVisibility,
  getStoredPopupTheme,
  setStoredCommitVisibility,
  setStoredPopupTheme,
} from "../storage";
import { CommitVisibilityOptions } from "./CommitVisibilityToggle";
import { getPopupThemeClasses, resolvePopupColorMode } from "./themeColor";
import { ThemeModeToggle } from "./ThemeColorToggle";
import { CommitVisibility_DEFAULT, PopupTheme_DEFAULT } from "../constants/storage";

export function Popup() {
  const [mode, setMode] = useState<CommitVisibilityMode>(CommitVisibility_DEFAULT);
  const [themeMode, setThemeMode] = useState<PopupTheme>(PopupTheme_DEFAULT);
  const [loading, setLoading] = useState(true);
  const theme = getPopupThemeClasses(resolvePopupColorMode(themeMode));

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
      <h1 className="text-lg font-semibold mb-4">Git Matter</h1>

      <CommitVisibilityOptions
        mode={mode}
        borderClassName={theme.border}
        mutedTextClassName={theme.mutedText}
        selectedClassName={theme.selected}
        onChange={handleModeChange}
      />

      <ThemeModeToggle
        mode={themeMode}
        borderClassName={theme.border}
        mutedTextClassName={theme.mutedText}
        selectedClassName={theme.selected}
        onChange={handleThemeModeChange}
      />
    </div>
  );
}

async function sendCommitVisibilityModeToActiveTab(mode: CommitVisibilityMode) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  if (!tab.url?.includes("github.com")) return;

  await chrome.tabs
    .sendMessage(tab.id, {
      type: "SET_COMMIT_VISIBILITY_MODE",
      mode,
    })
    .catch(() => undefined);
}
