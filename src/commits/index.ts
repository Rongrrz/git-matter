import type { CommitVisibilityMode, ExtensionMessage } from "../types";
import { getStoredCommitVisibility } from "../storage";
import { runOnce } from "../utils/runOnce";
import { getCommitPanels } from "./commitPageItems";
import { CommitVisibility } from "./visibility";
import { clearHiddenCommitControls, renderHiddenCommitControls } from "./hiddenCommitControls";
import { observeCommitPage } from "./commitPageObserver";

let commitVisibilityMode: CommitVisibilityMode = "hide";

/**
 * Resets the commit page and re-applies DOM changes based on the current mode.
 */
export function runCommitFiltering(): void {
  CommitVisibility.resetAll();
  const items = getCommitPanels();

  clearHiddenCommitControls();
  CommitVisibility.applyPanel(items, commitVisibilityMode);

  if (commitVisibilityMode === "hide") {
    renderHiddenCommitControls(items);
  }
}

// This is where ~ALL~ the magic happens
export const initializeCommitFiltering = runOnce(async () => {
  commitVisibilityMode = await getStoredCommitVisibility();

  // Set up observer for DOM changes
  observeCommitPage({
    getMode: () => commitVisibilityMode,
    filter: runCommitFiltering,
    onPageChange: clearHiddenCommitControls,
  });

  // Set up listener for popup setting changes.
  chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
    if (message.type !== "SET_COMMIT_VISIBILITY_MODE") return;
    commitVisibilityMode = message.mode;
    runCommitFiltering();
  });

  // Initial reconciliation when we first load the page.
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", runCommitFiltering, {
      once: true,
    });
  } else {
    runCommitFiltering();
  }
});
