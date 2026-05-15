import {
  CommitVisibility_DEFAULT,
  CommitVisibility_KEY,
  PopupTheme_DEFAULT,
  PopupTheme_KEY,
} from "./constants/storage";
import { type CommitVisibilityMode, type PopupTheme } from "./types";

export async function getStoredCommitVisibility(): Promise<CommitVisibilityMode> {
  const result = await readStorage(CommitVisibility_KEY);
  const stored = result[CommitVisibility_KEY] as string | undefined;

  if (stored === "off" || stored === "dim" || stored === "hide") {
    return stored;
  } else {
    return CommitVisibility_DEFAULT;
  }
}

export async function setStoredCommitVisibility(visibility: CommitVisibilityMode): Promise<void> {
  await chrome.storage.local.set({
    [CommitVisibility_KEY]: visibility,
  });
}

export async function getStoredPopupTheme(): Promise<PopupTheme> {
  const result = await readStorage(PopupTheme_KEY);
  const stored = result[PopupTheme_KEY] as string | undefined;

  if (stored === "auto" || stored === "light" || stored === "dark") {
    return stored;
  } else {
    return PopupTheme_DEFAULT;
  }
}

export async function setStoredPopupTheme(theme: PopupTheme): Promise<void> {
  await chrome.storage.local.set({
    [PopupTheme_KEY]: theme,
  });
}

async function readStorage(key: string): Promise<Record<string, unknown>> {
  return chrome.storage.local.get(key).catch(() => ({}));
}
