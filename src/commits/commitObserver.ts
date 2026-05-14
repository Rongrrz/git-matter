import { createDirtyTracker } from "../utils/createDirtyTracker";
import { commitPageSelectors, GIT_MATTER_CLASSES } from "./selectors";
import { isBotOnlyCommitRow } from "./commitAuthors";
import { applyImmediateDimToRow } from "./commitDimDisplay";
import { resetCommitRow } from "./commitRowDisplay";

let navigationId = 0;
let currentNavigationId = 0;

export function applyImmediateDisplayToRow(row: HTMLElement, currentMode: string): void {
  if (currentMode === "off") {
    resetCommitRow(row);
    return;
  }

  if (!isBotOnlyCommitRow(row)) return;

  if (currentMode === "dim") {
    applyImmediateDimToRow(row);
  }
}

export function setupCommitObserver(
  getCurrentMode: () => string,
  runFullPipeline: () => void,
  resetState: () => void,
): void {
  let pendingTimeoutId: ReturnType<typeof setTimeout> | undefined;

  function scheduleReconciliation(): void {
    clearTimeout(pendingTimeoutId);
    pendingTimeoutId = setTimeout(() => {
      if (currentNavigationId !== navigationId) return;
      runFullPipeline();
    }, 300);
  }

  const hasUrlChanged = createDirtyTracker(() => location.href);

  function hasNewCommitRows(mutations: MutationRecord[]): boolean {
    return mutations.some((mutation) =>
      Array.from(mutation.addedNodes).some((node) => {
        if (!(node instanceof HTMLElement)) return false;
        if (node.closest(`[${GIT_MATTER_CLASSES.componentMarker}]`)) return false;
        return node.querySelector<HTMLElement>(commitPageSelectors.commitRow);
      }),
    );
  }

  function processNewCommitRows(nodes: NodeList): void {
    const currentMode = getCurrentMode();
    nodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      if (node.closest(`[${GIT_MATTER_CLASSES.componentMarker}]`)) return;
      const newRows = node.querySelectorAll<HTMLElement>(commitPageSelectors.commitRow);
      newRows.forEach((row) => applyImmediateDisplayToRow(row, currentMode));
    });
  }

  new MutationObserver((mutations) => {
    const urlChanged = hasUrlChanged();
    const hasNewNodes = hasNewCommitRows(mutations);

    if (urlChanged) {
      navigationId++;
      currentNavigationId = navigationId;
      resetState();
    }

    if (hasNewNodes) {
      mutations.forEach((mutation) => {
        processNewCommitRows(mutation.addedNodes);
      });
    }

    if (urlChanged || hasNewNodes) {
      scheduleReconciliation();
    }
  }).observe(document.body, { childList: true, subtree: true });
}

export function runInitialFiltering(runFullPipeline: () => void): void {
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", runFullPipeline, { once: true });
  } else {
    runFullPipeline();
  }
}