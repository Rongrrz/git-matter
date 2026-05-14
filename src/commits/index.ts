import type { FilteredCommitDisplayMode } from "../types";
import { runOnce } from "../utils/runOnce";
import { collectCommitPageItems } from "./collectRows";
import { applyCommitDisplay, resetAllCommitDisplay } from "./display";
import { clearHiddenControls, renderHiddenControls } from "./hiddenControls";
import { observeCommitPage } from "./observer";

let commitDisplayMode: FilteredCommitDisplayMode = "hide";

function reconcileCommitPage(): void {
  const items = collectCommitPageItems();

  clearHiddenControls();
  applyCommitDisplay(items, commitDisplayMode);

  if (commitDisplayMode === "hide") {
    renderHiddenControls(items);
  }
}

function clearInjectedUi(): void {
  clearHiddenControls();
}

export function setCommitDisplayMode(mode: FilteredCommitDisplayMode): void {
  commitDisplayMode = mode;
}

export function runCommitFiltering(): void {
  clearHiddenControls();
  resetAllCommitDisplay();
  reconcileCommitPage();
}

export const initializeCommitFiltering = runOnce(() => {
  observeCommitPage(
    () => commitDisplayMode,
    reconcileCommitPage,
    clearInjectedUi,
  );

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", reconcileCommitPage, {
      once: true,
    });
  } else {
    reconcileCommitPage();
  }
});
