import {
  type FilteredCommitDisplayMode,
  COMMIT_DISPLAY_MODE_STORAGE_KEY,
  DEFAULT_COMMIT_DISPLAY_MODE,
} from "../types";

export async function getStoredCommitDisplayMode(): Promise<FilteredCommitDisplayMode> {
  const result = await chrome.storage.local.get(COMMIT_DISPLAY_MODE_STORAGE_KEY);
  const stored = result[COMMIT_DISPLAY_MODE_STORAGE_KEY] as string | undefined;

  if (stored === "off" || stored === "dim" || stored === "hide") {
    return stored;
  }

  return DEFAULT_COMMIT_DISPLAY_MODE;
}

export async function setStoredCommitDisplayMode(mode: FilteredCommitDisplayMode): Promise<void> {
  await chrome.storage.local.set({
    [COMMIT_DISPLAY_MODE_STORAGE_KEY]: mode,
  });
}
