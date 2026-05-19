import type { CommitVisibilityMode } from '../types';

export async function sendCommitVisibilityModeToActiveTab(
  mode: CommitVisibilityMode,
): Promise<void> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  if (!tab.url?.includes('github.com')) return;

  await chrome.tabs
    .sendMessage(tab.id, {
      type: 'SET_COMMIT_VISIBILITY_MODE',
      mode,
    })
    .catch(() => undefined);
}
