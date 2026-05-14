import { debounce } from "../utils/debounce";
import { runOnce } from "../utils/runOnce";
import { createDirtyTracker } from "../utils/createDirtyTracker";
import { hideRowImmediately, resetCommitRow, dimCommitRow, hideCommitRow } from "./commitRowDisplay";
import { commitPageSelectors } from "./selectors";
import { isBotOnlyCommitRow } from "./commitAuthors";
import type { FilteredCommitDisplayMode } from "../types";
import type { HiddenGroup } from "./types";
import {
  visibleCommitRoots,
  mountHiddenCommitStreak,
  mountHiddenCommitToggle,
} from "./commitVisibilityControls";

let commitDisplayMode: FilteredCommitDisplayMode = "hide";

function collectFilteredCommitRows(panels: HTMLElement[]): HTMLElement[] {
  const filteredRows: HTMLElement[] = [];

  panels.forEach((panel) => {
    const commitRows = Array.from(
      panel.querySelectorAll<HTMLElement>(commitPageSelectors.commitRow),
    );

    commitRows.forEach((row) => {
      if (isBotOnlyCommitRow(row)) {
        filteredRows.push(row);
      }
    });
  });

  return filteredRows;
}

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

function executeCommitDisplayPipeline() {
  const commitPanels = collectCommitPanels();
  const filteredRows = collectFilteredCommitRows(commitPanels);

  switch (commitDisplayMode) {
    case "off":
      resetAllCommitDisplayState();
      break;

    case "dim":
      applyDimmedCommitDisplay(filteredRows);
      break;

    case "hide":
      applyHiddenCommitDisplay(filteredRows, commitPanels);
      break;
  }
}

function collectCommitPanels(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      commitPageSelectors.commitGroupPanel,
    ),
  );
}

function applyDimmedCommitDisplay(filteredRows: HTMLElement[]): void {
  filteredRows.forEach((row) => {
    resetCommitRow(row);
    dimCommitRow(row);
  });
}

function applyHiddenCommitDisplay(
  filteredRows: HTMLElement[],
  commitPanels: HTMLElement[],
): void {
  filteredRows.forEach(hideCommitRow);

  const panelsWithHiddenRows = commitPanels.filter((panel) => {
    const rowsInPanel = panel.querySelectorAll<HTMLElement>(
      commitPageSelectors.commitRow,
    );
    return Array.from(rowsInPanel).some((row) => filteredRows.includes(row));
  });

  let hiddenStreak: HiddenGroup[] = [];

  function flushHiddenStreak() {
    if (hiddenStreak.length === 0) return;

    if (hiddenStreak.length >= 2) {
      mountHiddenCommitStreak(hiddenStreak);
    } else {
      const single = hiddenStreak[0];
      single.timelineRow.style.display = "";
      const panel = single.hiddenRows[0].closest(
        commitPageSelectors.commitGroupPanel,
      ) as HTMLElement | null;
      if (panel) {
        mountHiddenCommitToggle(panel, single.hiddenRows, false);
      }
    }

    hiddenStreak = [];
  }

  panelsWithHiddenRows.forEach((panel) => {
    if (panel.querySelector(".git-matter-processed")) return;

    const timelineRow = panel.closest(
      commitPageSelectors.timelineRow,
    ) as HTMLElement | null;
    if (!timelineRow) return;

    const commitRows = Array.from(
      panel.querySelectorAll<HTMLElement>(commitPageSelectors.commitRow),
    );
    if (commitRows.length === 0) return;

    const panelHiddenRows = commitRows.filter((row) =>
      filteredRows.includes(row),
    );

    const visibleCount = commitRows.length - panelHiddenRows.length;

    const marker = document.createElement("div");
    marker.className = "git-matter-processed";
    marker.style.display = "none";
    panel.appendChild(marker);

    if (panelHiddenRows.length > 0 && visibleCount === 0) {
      hideRowImmediately(timelineRow);
      hiddenStreak.push({ timelineRow, hiddenRows: panelHiddenRows });
      return;
    }

    flushHiddenStreak();

    if (panelHiddenRows.length > 0) {
      mountHiddenCommitToggle(panel, panelHiddenRows, true);
    }
  });

  flushHiddenStreak();
}

export type { FilteredCommitDisplayMode };

export function setCommitDisplayMode(mode: FilteredCommitDisplayMode): void {
  commitDisplayMode = mode;
}

export function runCommitFiltering(): void {
  resetAllCommitDisplayState();
  executeCommitDisplayPipeline();
}

export const initializeCommitFiltering = runOnce(() => {
  const scheduleRerun = debounce(() => {
    runCommitFiltering();
  }, 300);

  const hasUrlChanged = createDirtyTracker(() => location.href);

  const hasNewCommitNodes = (mutations: MutationRecord[]) => {
    return mutations.some((mutation) =>
      Array.from(mutation.addedNodes).some((node) => {
        if (!(node instanceof HTMLElement)) return false;

        // Prevent detecting nodes WE ourselves added to avoid infinite loops.
        if (node.closest("[data-git-matter-component]")) {
          return false;
        }

        return node.querySelector<HTMLElement>(
          commitPageSelectors.commitRow,
        );
      }),
    );
  };

  // Observe DOM changes to re-apply filtering when new commits are loaded
  // this occurs when the user clicks previous or next page, or filters by date.
  new MutationObserver((mutations) => {
    if (hasUrlChanged() || hasNewCommitNodes(mutations)) {
      scheduleRerun();
    }
  }).observe(document.body, {
    childList: true,
    subtree: true,
  });

  // This does our initial run
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", scheduleRerun, { once: true });
  } else {
    scheduleRerun();
  }
});
