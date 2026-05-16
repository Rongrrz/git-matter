import type { CommitVisibilityMode, ExtensionMessage } from "../types";
import { getStoredCommitVisibility } from "../storage";
import { runOnce } from "../utils/runOnce";
import { getCommitPanels } from "./getPanels";
import { CommitVisibility } from "./visibility";
import { observeCommitPage } from "./commitPageObserver";
import { HiddenCommitControls } from "./hiddenCommitControls/";

let commitVisibilityMode: CommitVisibilityMode = "hide";

/**
 * Resets the commit page and re-applies DOM changes based on the current mode.
 */
export function runCommitFiltering(): void {
  CommitVisibility.resetAll();
  const items = getCommitPanels();

  HiddenCommitControls.clear();
  CommitVisibility.applyPanel(items, commitVisibilityMode);

  if (commitVisibilityMode === "hide") {
    HiddenCommitControls.render(items);
  }
}

// This is where ~ALL~ the magic happens
export const initializeCommitFiltering = runOnce(async () => {
  commitVisibilityMode = await getStoredCommitVisibility();

  // Set up observer for DOM changes
  observeCommitPage({
    getMode: () => commitVisibilityMode,
    filter: runCommitFiltering,
    onPageChange: HiddenCommitControls.clear,
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
