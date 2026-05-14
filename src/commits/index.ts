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
let navigationId = 0;
let currentNavigationId = 0;

function applyDisplayModeToCommitRow(row: HTMLElement): void {
  if (commitDisplayMode === "off") {
    resetCommitRow(row);
    return;
  }

  if (!isBotOnlyCommitRow(row)) {
    return;
  }

  if (commitDisplayMode === "dim") {
    dimCommitRow(row);
  }
}

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
  let pendingTimeoutId: ReturnType<typeof setTimeout> | undefined;

  function scheduleFullReconciliation(): void {
    clearTimeout(pendingTimeoutId);
    pendingTimeoutId = setTimeout(() => {
      if (currentNavigationId !== navigationId) {
        return;
      }
      resetAllCommitDisplayState();
      executeCommitDisplayPipeline();
    }, 300);
  }

  const hasUrlChanged = createDirtyTracker(() => location.href);

  const hasNewCommitNodes = (mutations: MutationRecord[]) => {
    return mutations.some((mutation) =>
      Array.from(mutation.addedNodes).some((node) => {
        if (!(node instanceof HTMLElement)) return false;
        if (node.closest("[data-git-matter-component]")) return false;
        return node.querySelector<HTMLElement>(commitPageSelectors.commitRow);
      }),
    );
  };

  function processImmediateCommitRows(nodes: NodeList): void {
    nodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      if (node.closest("[data-git-matter-component]")) return;

      const newRows = node.querySelectorAll<HTMLElement>(commitPageSelectors.commitRow);
      newRows.forEach(applyDisplayModeToCommitRow);
    });
  }

  new MutationObserver((mutations) => {
    const urlChanged = hasUrlChanged();
    const hasNewNodes = hasNewCommitNodes(mutations);

    if (urlChanged) {
      navigationId++;
      currentNavigationId = navigationId;
      resetAllCommitDisplayState();
    }

    if (hasNewNodes) {
      mutations.forEach((mutation) => {
        processImmediateCommitRows(mutation.addedNodes);
      });
    }

    if (urlChanged || hasNewNodes) {
      scheduleFullReconciliation();
    }
  }).observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Run immediately on initial page load - no debounce needed since page is already ready
  // Use debounced version only for GitHub-driven DOM changes (navigation, filters, etc.)
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", runCommitFiltering, { once: true });
  } else {
    runCommitFiltering();
  }
});
