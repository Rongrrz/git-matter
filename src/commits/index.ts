import type { CommitVisibilityMode } from "../types";
import { runOnce } from "../utils/runOnce";
import { collectCommitPageItems } from "./commitPageItems";
import { applyCommitVisibility, resetAllCommitVisibility } from "./commitVisibility";
import { clearHiddenCommitControls, renderHiddenCommitControls } from "./hiddenCommitControls";
import { observeCommitPage } from "./commitPageObserver";

let commitVisibilityMode: CommitVisibilityMode = "hide";

function reconcileCommitPage(): void {
  const items = collectCommitPageItems();

  clearHiddenCommitControls();
  applyCommitVisibility(items, commitVisibilityMode);

  if (commitVisibilityMode === "hide") {
    renderHiddenCommitControls(items);
  }
}

function clearInjectedUi(): void {
  clearHiddenCommitControls();
}

export function setCommitVisibilityMode(mode: CommitVisibilityMode): void {
  commitVisibilityMode = mode;
}

export function runCommitFiltering(): void {
  clearHiddenCommitControls();
  resetAllCommitVisibility();
  reconcileCommitPage();
}

export const initializeCommitFiltering = runOnce(() => {
  observeCommitPage(() => commitVisibilityMode, reconcileCommitPage, clearInjectedUi);

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", reconcileCommitPage, {
      once: true,
    });
  } else {
    reconcileCommitPage();
  }
});
