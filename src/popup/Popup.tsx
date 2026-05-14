import { useState, useEffect } from "react";
import {
  type CommitVisibilityMode,
  type PopupThemeMode,
  DEFAULT_COMMIT_VISIBILITY_MODE,
  DEFAULT_POPUP_THEME_MODE,
} from "../types";
import {
  getStoredCommitVisibilityMode,
  getStoredPopupThemeMode,
  setStoredCommitVisibilityMode,
  setStoredPopupThemeMode,
} from "../utils/storage";
import { CommitVisibilityOptions } from "./CommitVisibilityOptions";
import { getPopupThemeClasses, resolvePopupColorMode } from "./githubTheme";
import { ThemeModeToggle } from "./ThemeModeToggle";

export function Popup() {
  const [mode, setMode] = useState<CommitVisibilityMode>(DEFAULT_COMMIT_VISIBILITY_MODE);
  const [themeMode, setThemeMode] = useState<PopupThemeMode>(
    DEFAULT_POPUP_THEME_MODE,
  );
  const [loading, setLoading] = useState(true);
  const theme = getPopupThemeClasses(resolvePopupColorMode(themeMode));

  useEffect(() => {
    Promise.all([
      getStoredCommitVisibilityMode(),
      getStoredPopupThemeMode(),
    ]).then(([storedMode, storedThemeMode]) => {
      setMode(storedMode);
      setThemeMode(storedThemeMode);
      setLoading(false);
    });
  }, []);

  async function handleModeChange(newMode: CommitVisibilityMode) {
    setMode(newMode);
    await setStoredCommitVisibilityMode(newMode);
    await sendCommitVisibilityModeToActiveTab(newMode);
  }

  async function handleThemeModeChange(newMode: PopupThemeMode) {
    setThemeMode(newMode);
    await setStoredPopupThemeMode(newMode);
  }

  if (loading) {
    return <div className={`${theme.shell} ${theme.mutedText}`}>Loading...</div>;
  }

  return (
    <div className={theme.shell}>
      <h1 className="text-lg font-semibold mb-4">Git Matter</h1>

      <CommitVisibilityOptions
        mode={mode}
        mutedTextClassName={theme.mutedText}
        optionClassName={theme.option}
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
