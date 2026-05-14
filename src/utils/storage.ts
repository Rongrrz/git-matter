import {
  type CommitVisibilityMode,
  COMMIT_VISIBILITY_MODE_STORAGE_KEY,
  DEFAULT_COMMIT_VISIBILITY_MODE,
} from "../types";

export async function getStoredCommitVisibilityMode(): Promise<CommitVisibilityMode> {
  const result = await chrome.storage.local.get(COMMIT_VISIBILITY_MODE_STORAGE_KEY);
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
