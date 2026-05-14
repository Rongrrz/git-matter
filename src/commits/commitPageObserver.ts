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

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function pushState(...args) {
    originalPushState.apply(this, args);
    handlePageChange();
  };

  history.replaceState = function replaceState(...args) {
    originalReplaceState.apply(this, args);
    handlePageChange();
  };

  window.addEventListener("popstate", handlePageChange);

  const observer = new MutationObserver((mutations) => {
    const urlChanged = currentUrl !== location.href;
    if (urlChanged) {
      handlePageChange();
    }

    let shouldReconcile = urlChanged;

    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
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
            getMode(),
          );
        });

        if (rows.length > 0 || containsCommitPageStructure(node)) {
          shouldReconcile = true;
        }
      });

      mutation.removedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (isGitMatterNode(node)) return;
        if (
          node.matches(commitPageSelectors.commitRow) ||
          node.matches(commitPageSelectors.commitGroupPanel) ||
          node.matches(commitPageSelectors.timelineRow) ||
          containsCommitPageStructure(node)
        ) {
          shouldReconcile = true;
        }
      });
    });

    if (shouldReconcile) {
      scheduleReconcile();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
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
