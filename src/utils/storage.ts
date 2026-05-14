import {
  type CommitVisibilityMode,
  type PopupThemeMode,
  COMMIT_VISIBILITY_MODE_STORAGE_KEY,
  DEFAULT_COMMIT_VISIBILITY_MODE,
  DEFAULT_POPUP_THEME_MODE,
  POPUP_THEME_MODE_STORAGE_KEY,
} from "../types";

export async function getStoredCommitVisibilityMode(): Promise<CommitVisibilityMode> {
  const result = await readStorage(COMMIT_VISIBILITY_MODE_STORAGE_KEY);
  const stored = result[COMMIT_VISIBILITY_MODE_STORAGE_KEY] as string | undefined;

  if (stored === "off" || stored === "dim" || stored === "hide") {
    return stored;
  }

  return DEFAULT_COMMIT_VISIBILITY_MODE;
}

export async function setStoredCommitVisibilityMode(mode: CommitVisibilityMode): Promise<void> {
  await chrome.storage.local.set({
    [COMMIT_VISIBILITY_MODE_STORAGE_KEY]: mode,
  });
}

export async function getStoredPopupThemeMode(): Promise<PopupThemeMode> {
  const result = await readStorage(POPUP_THEME_MODE_STORAGE_KEY);
  const stored = result[POPUP_THEME_MODE_STORAGE_KEY] as string | undefined;

  if (stored === "auto" || stored === "light" || stored === "dark") {
    return stored;
  }

  return DEFAULT_POPUP_THEME_MODE;
}

export async function setStoredPopupThemeMode(
  mode: PopupThemeMode,
): Promise<void> {
  await chrome.storage.local.set({
    [POPUP_THEME_MODE_STORAGE_KEY]: mode,
  });
}

async function readStorage(key: string): Promise<Record<string, unknown>> {
  return chrome.storage.local.get(key).catch(() => ({}));
}
