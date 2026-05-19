import { BrowserStorage } from '../storage';
import {
  CommitVisibilityModeMap,
  type CommitVisibilityMode,
  type ExtensionMessage,
} from '../types';
import { runOnce } from '../utils/runOnce';
import { CommitDom } from './dom';
import { HiddenCommitUi } from './hiddenCommitUi/';
import { observeCommitPage } from './observer';
import { CommitVisibility } from './visibility';

let commitVisibilityMode: CommitVisibilityMode = CommitVisibilityModeMap.Dim;

/**
 * Resets the commit page and re-applies DOM changes based on the current mode.
 */
export function runCommitFiltering(): void {
  CommitVisibility.resetAll();
  const items = CommitDom.panels.collect();

  HiddenCommitUi.clear();
  CommitVisibility.applyPanel(items, commitVisibilityMode);

  if (commitVisibilityMode === CommitVisibilityModeMap.Dim) {
    HiddenCommitUi.render(items);
  }
}

// This is where ~ALL~ the magic happens
export const initializeCommitFiltering = runOnce(async () => {
  commitVisibilityMode = await BrowserStorage.userPreferences.commitVisibility.get();

  // Set up observer for DOM changes
  observeCommitPage({
    getMode: () => commitVisibilityMode,
    filter: runCommitFiltering,
    onPageChange: HiddenCommitUi.clear,
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
