import { debounce } from "../utils/debounce";
import { runOnce } from "../utils/runOnce";
import { createDirtyTracker } from "../utils/createDirtyTracker";
import { hideRowImmediately, resetCommitRow, dimCommitRow, hideCommitRow } from "./commitRowAnimations";
import { commitPageSelectors } from "./selectors";
import { isAllBotCommitRow } from "./commitAuthors";
import type { HiddenGroup } from "./types";
import {
  mountedRoots,
  mountHiddenCommitStreak,
  mountHiddenCommitToggle,
} from "./hiddenCommit";

type FilteredCommitDisplayMode = "off" | "dim" | "hide";

let commitDisplayMode: FilteredCommitDisplayMode = "hide";

function applyFilteredCommitDisplayMode(filteredRows: HTMLElement[], mode: FilteredCommitDisplayMode): void {
  if (mode === "off") {
    filteredRows.forEach(resetCommitRow);
  } else if (mode === "dim") {
    filteredRows.forEach((row) => {
      resetCommitRow(row);
      dimCommitRow(row);
    });
  } else if (mode === "hide") {
    filteredRows.forEach(hideCommitRow);
  }
}

function findFilteredRows(panels: HTMLElement[]): HTMLElement[] {
  const filteredRows: HTMLElement[] = [];

  panels.forEach((panel) => {
    const commitRows = Array.from(
      panel.querySelectorAll<HTMLElement>(commitPageSelectors.commitRow),
    );

    commitRows.forEach((row) => {
      if (isAllBotCommitRow(row)) {
        filteredRows.push(row);
      }
    });
  });

  return filteredRows;
}

function cleanup(): void {
  mountedRoots.forEach((root) => root.unmount());
  mountedRoots.clear();

  const injectedElements = document.querySelectorAll(
    commitPageSelectors.gitMatterCommitComponent,
  );
  injectedElements.forEach((element) => element.remove());

  const rowsToReset = document.querySelectorAll<HTMLElement>(
    commitPageSelectors.rowsToReset,
  );
  rowsToReset.forEach(resetCommitRow);
}

function filterCommits() {
  if (commitDisplayMode === "off") {
    return;
  }

  const panels = Array.from(
    document.querySelectorAll<HTMLElement>(
      commitPageSelectors.commitGroupPanel,
    ),
  );

  const filteredRows = findFilteredRows(panels);

  applyFilteredCommitDisplayMode(filteredRows, commitDisplayMode);

  if (commitDisplayMode !== "hide") {
    return;
  }

  const hiddenRows = filteredRows;
  const panelsWithHiddenRows = panels.filter((panel) => {
    const rowsInPanel = panel.querySelectorAll<HTMLElement>(commitPageSelectors.commitRow);
    return Array.from(rowsInPanel).some((row) => hiddenRows.includes(row));
  });

  let streak: HiddenGroup[] = [];

  function flushStreakAndMountUi() {
    if (streak.length === 0) return;

    if (streak.length >= 2) {
      mountHiddenCommitStreak(streak);
    } else {
      const single = streak[0];
      single.timelineRow.style.display = "";
      const panel = single.hiddenRows[0].closest(
        commitPageSelectors.commitGroupPanel,
      ) as HTMLElement | null;
      if (panel) {
        mountHiddenCommitToggle(panel, single.hiddenRows, false);
      }
    }

    streak = [];
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
      hiddenRows.includes(row),
    );

    const visibleCount = commitRows.length - panelHiddenRows.length;

    const marker = document.createElement("div");
    marker.className = "git-matter-processed";
    marker.style.display = "none";
    panel.appendChild(marker);

    if (panelHiddenRows.length > 0 && visibleCount === 0) {
      hideRowImmediately(timelineRow);
      streak.push({ timelineRow, hiddenRows: panelHiddenRows });
      return;
    }

    flushStreakAndMountUi();

    if (panelHiddenRows.length > 0) {
      mountHiddenCommitToggle(panel, panelHiddenRows, true);
    }
  });

  flushStreakAndMountUi();
}

export type { FilteredCommitDisplayMode };

export function setCommitDisplayMode(mode: FilteredCommitDisplayMode): void {
  commitDisplayMode = mode;
}

export function runCommitFiltering(): void {
  cleanup();
  filterCommits();
}

export const initializeCommitFiltering = runOnce(() => {
  let scheduleRerun = debounce(() => {
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
  document.readyState === "loading"
    ? window.addEventListener("DOMContentLoaded", scheduleRerun, { once: true })
    : scheduleRerun();
});
