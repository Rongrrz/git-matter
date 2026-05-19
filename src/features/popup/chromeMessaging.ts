import type { CommitVisibilityMode } from '@/shared/types/userPreferenceOptions';

const GITHUB_URL_PATTERN = 'https://github.com/*';

// Updates the commit visibility mode in all open GitHub tabs
// This is so the tabs can get the most receent mode.
export async function broadcastCommitVisibilityMode(mode: CommitVisibilityMode): Promise<void> {
  const tabs = await chrome.tabs.query({
    url: GITHUB_URL_PATTERN,
  });

  await Promise.all(
    tabs.map((tab) => {
      if (!tab.id) return undefined;

      return chrome.tabs
        .sendMessage(tab.id, {
          type: 'SET_COMMIT_VISIBILITY_MODE',
          mode,
        })
        .catch(() => undefined);
    }),
  );
}
