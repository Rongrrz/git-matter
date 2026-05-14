import { debounce } from "../utils/debounce";
import { runOnce } from "../utils/runOnce";
import { createDirtyTracker } from "../utils/dirtyTracker";
import { hideRowImmediately } from "./commitRowAnimations";
import { commitPageSelectors } from "./selectors";
import { isAllBotCommitRow } from "./getCommitAuthor";
import type { HiddenGroup } from "./types";
import {
  mountedRoots,
  mountHiddenCommitStreak,
  mountHiddenCommitToggle,
} from "./hiddenCommit";

function cleanup(): void {
  // Internally:
  // 1. Unmount React roots before removing DOM nodes
  // 2. Remove injected GitMatter elements
  // 3. Reset visibility of all GitHub rows
  mountedRoots.forEach((root) => root.unmount());
  mountedRoots.clear();

  const injectedElements = document.querySelectorAll(
    commitPageSelectors.gitMatterCommitComponent,
  );
  injectedElements.forEach((element) => element.remove());

  const rowsToReset = document.querySelectorAll<HTMLElement>(
    commitPageSelectors.rowsToReset,
  );
  rowsToReset.forEach((row) => (row.style.display = ""));
}

function filterCommits() {
  const panels = Array.from(
    document.querySelectorAll<HTMLElement>(
      commitPageSelectors.commitGroupPanel,
    ),
  );

  let streak: HiddenGroup[] = [];

  function flushStreak() {
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

  panels.forEach((panel) => {
    // Skip if processed but not cleaned up
    if (panel.querySelector(".git-matter-processed")) return;

    const timelineRow = panel.closest(
      commitPageSelectors.timelineRow,
    ) as HTMLElement | null;
    if (!timelineRow) return;

    const commitRows = Array.from(
      panel.querySelectorAll<HTMLElement>(commitPageSelectors.commitRow),
    );
    if (commitRows.length === 0) return;

    const hiddenRows: HTMLElement[] = [];
    commitRows.forEach((row) => {
      // We don't want to hide: UserA and Copilot coauthored commit.
      if (isAllBotCommitRow(row)) {
        hideRowImmediately(row);
        hiddenRows.push(row);
      }
    });

    const visibleCount = commitRows.length - hiddenRows.length;

    const marker = document.createElement("div");
    marker.className = "git-matter-processed";
    marker.style.display = "none";
    panel.appendChild(marker);

    if (hiddenRows.length > 0 && visibleCount === 0) {
      hideRowImmediately(timelineRow);
      streak.push({ timelineRow, hiddenRows });
      return;
    }

    flushStreak();

    if (hiddenRows.length > 0) {
      mountHiddenCommitToggle(panel, hiddenRows, true);
    }
  });

  flushStreak();
}

export const initializeCommitFiltering = runOnce(() => {
  let scheduleRerun = debounce(() => {
    cleanup();
    filterCommits();
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
          '[data-testid="commit-row-item"]',
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
