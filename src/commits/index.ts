import { runOnce } from "../utils/runOnce";
import { hideRowImmediately, resetCommitRow, hideCommitRow } from "./commitRowDisplay";
import { commitPageSelectors, GIT_MATTER_CLASSES } from "./selectors";
import { visibleCommitRoots, mountHiddenCommitStreak, mountHiddenCommitToggle } from "./commitVisibilityControls";
import type { FilteredCommitDisplayMode } from "../types";
import type { HiddenGroup } from "./types";

import { collectCommitPanels, collectCommitRowsInPanel, collectFilteredCommitRows } from "./commitDetection";
import { applyDimmedDisplay } from "./commitDimDisplay";
import { setupCommitObserver, runInitialFiltering } from "./commitObserver";

// State
let commitDisplayMode: FilteredCommitDisplayMode = "hide";

// Reset
function resetAllCommitDisplayState(): void {
  visibleCommitRoots.forEach((root) => root.unmount());
  visibleCommitRoots.clear();

  const injectedElements = document.querySelectorAll(
    commitPageSelectors.gitMatterCommitComponent,
  );
  injectedElements.forEach((element) => element.remove());

  const rowsToReset = document.querySelectorAll<HTMLElement>(
    commitPageSelectors.rowsToReset,
  );
  rowsToReset.forEach(resetCommitRow);
}

// Hide Mode
function applyHiddenDisplayWithControls(
  filteredRows: HTMLElement[],
  commitPanels: HTMLElement[],
): void {
  filteredRows.forEach(hideCommitRow);

let hiddenStreak: HiddenGroup[] = [];

  function flushStreak() {
    if (hiddenStreak.length === 0) return;
    if (hiddenStreak.length >= 2) {
      mountHiddenCommitStreak(hiddenStreak);
    } else {
      const single = hiddenStreak[0];
      single.timelineRow.style.display = "";
      const panel = single.hiddenRows[0].closest(
        commitPageSelectors.commitGroupPanel,
      ) as HTMLElement | null;
      if (panel) mountHiddenCommitToggle(panel, single.hiddenRows, false);
    }
    hiddenStreak = [];
  }

  commitPanels.forEach((panel) => {
    if (panel.querySelector(GIT_MATTER_CLASSES.processedMarker)) return;
    const timelineRow = panel.closest(commitPageSelectors.timelineRow) as HTMLElement | null;
    if (!timelineRow) return;

    const commitRows = collectCommitRowsInPanel(panel);
    if (commitRows.length === 0) return;

    const panelHiddenRows = commitRows.filter((row) => filteredRows.includes(row));
    const visibleCount = commitRows.length - panelHiddenRows.length;

    if (panelHiddenRows.length === 0) {
      flushStreak();
      return;
    }

    const marker = document.createElement("div");
    marker.className = "git-matter-processed";
    marker.style.display = "none";
    panel.appendChild(marker);

    if (panelHiddenRows.length > 0 && visibleCount === 0) {
      hideRowImmediately(timelineRow);
      hiddenStreak.push({ timelineRow, hiddenRows: panelHiddenRows });
      return;
    }

    flushStreak();
    if (panelHiddenRows.length > 0) {
      mountHiddenCommitToggle(panel, panelHiddenRows, true);
    }
  });

  flushStreak();
}

function runFullDisplayPipeline(): void {
  const panels = collectCommitPanels();
  const filteredRows = collectFilteredCommitRows(panels);

  switch (commitDisplayMode) {
    case "off":
      resetAllCommitDisplayState();
      break;
    case "dim":
      applyDimmedDisplay(filteredRows);
      break;
    case "hide":
      applyHiddenDisplayWithControls(filteredRows, panels);
      break;
  }
}

export type { FilteredCommitDisplayMode };

export function setCommitDisplayMode(mode: FilteredCommitDisplayMode): void {
  commitDisplayMode = mode;
}

export function runCommitFiltering(): void {
  resetAllCommitDisplayState();
  runFullDisplayPipeline();
}

export const initializeCommitFiltering = runOnce(() => {
  setupCommitObserver(
    () => commitDisplayMode,
    runFullDisplayPipeline,
    resetAllCommitDisplayState,
  );
  runInitialFiltering(runFullDisplayPipeline);
});
