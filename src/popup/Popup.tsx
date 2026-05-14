import { useState, useEffect } from "react";
import {
  type CommitVisibilityMode,
  type ColorMode,
  DEFAULT_COMMIT_VISIBILITY_MODE,
} from "../types";
import {
  getStoredCommitVisibilityMode,
  setStoredCommitVisibilityMode,
} from "../utils/storage";
import { CommitVisibilityOptions } from "./CommitVisibilityOptions";
import {
  getActiveGithubColorMode,
  getPopupThemeClasses,
  getPreferredColorMode,
} from "./githubTheme";

export function Popup() {
  const [mode, setMode] = useState<CommitVisibilityMode>(
    DEFAULT_COMMIT_VISIBILITY_MODE,
  );
  const [colorMode, setColorMode] = useState<ColorMode>(getPreferredColorMode);
  const [loading, setLoading] = useState(true);
  const theme = getPopupThemeClasses(colorMode);

  useEffect(() => {
    getStoredCommitVisibilityMode().then((storedMode) => {
      setMode(storedMode);
      setLoading(false);
    });

    getActiveGithubColorMode().then((githubColorMode) => {
      if (githubColorMode) setColorMode(githubColorMode);
    });
  }, []);

  async function handleModeChange(newMode: CommitVisibilityMode) {
    setMode(newMode);
    await setStoredCommitVisibilityMode(newMode);
    await sendCommitVisibilityModeToActiveTab(newMode);
  }

  if (loading) {
    return (
      <div className={`${theme.shell} ${theme.mutedText}`}>Loading...</div>
    );
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
