import type { CommitVisibilityMode } from "../types";
import { commitPageSelectors, GIT_MATTER_CLASSES } from "./selectors";
import { collectCommitRowsFromNode } from "./commitPageItems";
import { getCommitAuthors, shouldFilterCommit } from "./authorFiltering";
import { applySingleCommitVisibility } from "./commitVisibility";

export function observeCommitPage(
  getMode: () => CommitVisibilityMode,
  reconcile: () => void,
  onPageChange: () => void,
): void {
  let pageChangeId = 0;
  let pendingFrameId: number | undefined;
  let currentUrl = location.href;

  function scheduleReconcile(): void {
    const scheduledPageChangeId = pageChangeId;
    if (pendingFrameId !== undefined) {
      cancelAnimationFrame(pendingFrameId);
    }

    pendingFrameId = requestAnimationFrame(() => {
      pendingFrameId = undefined;
      if (scheduledPageChangeId !== pageChangeId) return;
      reconcile();
    });
  }

  function handlePageChange(): void {
    pageChangeId++;
    currentUrl = location.href;
    onPageChange();
    scheduleReconcile();
  }

  observeNavigation(handlePageChange);

  const observer = new MutationObserver((mutations) => {
    const urlChanged = currentUrl !== location.href;
    if (urlChanged) {
      handlePageChange();
    }

    let shouldReconcile = urlChanged;

    mutations.forEach((mutation) => {
      if (applyVisibilityToAddedRows(mutation.addedNodes, getMode())) {
        shouldReconcile = true;
      }

      if (removedCommitPageContent(mutation.removedNodes)) {
        shouldReconcile = true;
      }
    });

    if (shouldReconcile) {
      scheduleReconcile();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function observeNavigation(onChange: () => void): void {
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function pushState(...args) {
    originalPushState.apply(this, args);
    onChange();
  };

  history.replaceState = function replaceState(...args) {
    originalReplaceState.apply(this, args);
    onChange();
  };

  window.addEventListener("popstate", onChange);
}

function applyVisibilityToAddedRows(
  nodes: NodeList,
  mode: CommitVisibilityMode,
): boolean {
  let foundCommitPageContent = false;

  nodes.forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    if (isGitMatterNode(node)) return;

    const rows = collectCommitRowsFromNode(node);
    rows.forEach((row) => {
      const authors = getCommitAuthors(row);
      applySingleCommitVisibility(
        {
          row,
          authors,
          filtered: shouldFilterCommit(authors),
        },
        mode,
      );
    });

    if (rows.length > 0 || containsCommitPageStructure(node)) {
      foundCommitPageContent = true;
    }
  });

  return foundCommitPageContent;
}

function removedCommitPageContent(nodes: NodeList): boolean {
  return Array.from(nodes).some((node) => {
    if (!(node instanceof HTMLElement)) return false;
    if (isGitMatterNode(node)) return false;

    return (
      node.matches(commitPageSelectors.commitRow) ||
      node.matches(commitPageSelectors.commitGroupPanel) ||
      node.matches(commitPageSelectors.timelineRow) ||
      containsCommitPageStructure(node)
    );
  });
}

function isGitMatterNode(node: HTMLElement): boolean {
  return Boolean(
    node.closest(`[${GIT_MATTER_CLASSES.componentMarker}]`) ||
      node.matches(`[${GIT_MATTER_CLASSES.componentMarker}]`),
  );
}

function containsCommitPageStructure(node: HTMLElement): boolean {
  return Boolean(
    node.querySelector(
      [
        commitPageSelectors.commitRow,
        commitPageSelectors.commitGroupPanel,
        commitPageSelectors.timelineRow,
      ].join(", "),
    ),
  );
}
