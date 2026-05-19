import type { CommitVisibilityMode } from '@/shared/types/userPreferenceOptions';

import { getCommitAuthors, shouldFilterCommit } from './dom/authors';
import { containsCommitPageDom, findCommitRows, isCommitPageDomNode } from './dom/commits';
import { GitMatterSelectors } from './selectors';
import { applySingleCommitVisibility } from './visibility/applyVisibility';

function removedCommitPageContent(nodes: NodeList): boolean {
  return Array.from(nodes).some((node) => {
    if (!(node instanceof HTMLElement)) return false;
    if (isGitMatterNode(node)) return false;

    return isCommitPageDomNode(node);
  });
}

function isGitMatterNode(node: HTMLElement): boolean {
  return Boolean(
    node.closest(`[${GitMatterSelectors.componentMarker}]`) ||
    node.matches(`[${GitMatterSelectors.componentMarker}]`),
  );
}

function applyVisibilityToAddedRows(nodes: NodeList, mode: CommitVisibilityMode): boolean {
  let foundCommitPageContent = false;

  nodes.forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    if (isGitMatterNode(node)) return;

    const rows = findCommitRows(node);
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

    if (rows.length > 0 || containsCommitPageDom(node)) {
      foundCommitPageContent = true;
    }
  });

  return foundCommitPageContent;
}

export function observeCommitPage({
  getMode,
  filter,
  onPageChange,
}: {
  getMode: () => CommitVisibilityMode;
  filter: () => void;
  onPageChange: () => void;
}): void {
  let pageChangeId = 0;
  let pendingFrameId: number | undefined;
  let currentUrl = location.href;

  function scheduleFiltering(): void {
    const scheduledPageChangeId = pageChangeId;
    if (pendingFrameId !== undefined) {
      cancelAnimationFrame(pendingFrameId);
    }

    pendingFrameId = requestAnimationFrame(() => {
      pendingFrameId = undefined;
      if (scheduledPageChangeId !== pageChangeId) return;
      filter();
    });
  }

  function handlePageChange(): void {
    pageChangeId++;
    currentUrl = location.href;
    onPageChange();
    scheduleFiltering();
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
      scheduleFiltering();
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

  window.addEventListener('popstate', onChange);
}
