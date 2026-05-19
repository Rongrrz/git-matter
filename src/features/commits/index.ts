import { collectCommitPanels } from '@/features/commits/dom/panels';
import { renderHiddenCommitUi } from '@/features/commits/hiddenCommitUi/index';
import { clearMountedHiddenCommitUi } from '@/features/commits/hiddenCommitUi/uiRegistry';
import { observeCommitPage } from '@/features/commits/observer';
import {
  applyPanelCommitVisibility,
  resetAllCommitVisibility,
} from '@/features/commits/visibility/applyVisibility';
import { commitVisibilityPreference } from '@/shared/storage/preferences/definitions';
import type { ExtensionMessage } from '@/shared/types/messages';
import {
  CommitVisibilityModeMap,
  type CommitVisibilityMode,
} from '@/shared/types/userPreferenceOptions';
import { runOnce } from '@/shared/utils/runOnce';

let commitVisibilityMode: CommitVisibilityMode = CommitVisibilityModeMap.Dim;

/**
 * Resets the commit page and re-applies DOM changes based on the current mode.
 */
export function runCommitFiltering(): void {
  resetAllCommitVisibility();
  const items = collectCommitPanels();

  clearMountedHiddenCommitUi();
  applyPanelCommitVisibility(items, commitVisibilityMode);

  if (commitVisibilityMode === CommitVisibilityModeMap.Hide) {
    renderHiddenCommitUi(items);
  }
}

// This is where ~ALL~ the magic happens
export const initializeCommitFiltering = runOnce(async () => {
  commitVisibilityMode = await commitVisibilityPreference.get();

  // Set up observer for DOM changes
  observeCommitPage({
    getMode: () => commitVisibilityMode,
    filter: runCommitFiltering,
    onPageChange: clearMountedHiddenCommitUi,
  });

  // Set up listener for popup setting changes.
  chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
    if (message.type !== 'SET_COMMIT_VISIBILITY_MODE') return;
    commitVisibilityMode = message.mode;
    runCommitFiltering();
  });

  // Initial reconciliation when we first load the page.
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', runCommitFiltering, {
      once: true,
    });
  } else {
    runCommitFiltering();
  }
});
