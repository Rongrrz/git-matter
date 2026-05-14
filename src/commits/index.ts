import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { HiddenCommitsToggle } from "../components/HiddenCommitsToggle";
import { HiddenCommitStreak } from "../components/HiddenCommitsStreak";
import { botAuthors } from "../constants/botAuthors";
import { debounce } from "../utils/debounce";
import { runOnce } from "../utils/runOnce";
import { getCommitAuthor } from "./getCommitAuthor";
import { createDirtyTracker } from "../utils/dirtyTracker";
import { hideRow, hideRowImmediately, revealRow } from "./commitRowAnimations";

type HiddenGroup = {
  timelineRow: HTMLElement;
  hiddenRows: HTMLElement[];
};

// Track roots globally so we can properly unmount them during cleanup
const mountedRoots = new Map<HTMLElement, Root>();

function cleanupGitMatter() {
  // 1. Properly unmount React roots before removing DOM nodes
  mountedRoots.forEach((root) => {
    try {
      root.unmount();
    } catch {
      /* root might already be gone */
    }
  });

  mountedRoots.clear();

  // 2. Remove injected elements
  document
    .querySelectorAll(
      ".git-matter-toggle-root, .git-matter-streak-root, .git-matter-processed",
    )
    .forEach((el) => el.remove());

  // 3. Reset visibility
  document
    .querySelectorAll<HTMLElement>(
      '[data-testid="commit-row-item"], div[class*="TimelineRow-module__timelineRowItem"]',
    )
    .forEach((row) => {
      row.style.display = "";
    });
}

function filterCommits() {
  const panels = Array.from(
    document.querySelectorAll<HTMLElement>(
      'div[class*="CommitGroup-module__panel"]',
    ),
  );

  let streak: HiddenGroup[] = [];

  function flushStreak() {
    if (streak.length === 0) return;

    if (streak.length >= 2) {
      mountHiddenStreak(streak);
    } else {
      const single = streak[0];
      single.timelineRow.style.display = "";
      const panel = single.hiddenRows[0].closest(
        'div[class*="CommitGroup-module__panel"]',
      ) as HTMLElement | null;
      if (panel) {
        mountSingleToggle(panel, single.hiddenRows, false);
      }
    }

    streak = [];
  }

  panels.forEach((panel) => {
    // If already processed and not cleaned up, skip
    if (panel.querySelector(".git-matter-processed")) return;

    const timelineRow = panel.closest(
      'div[class*="TimelineRow-module__timelineRowItem"]',
    ) as HTMLElement | null;

    if (!timelineRow) return;

    const commitRows = Array.from(
      panel.querySelectorAll<HTMLElement>('[data-testid="commit-row-item"]'),
    );

    if (commitRows.length === 0) return;

    const hiddenRows: HTMLElement[] = [];

    commitRows.forEach((row) => {
      const author = getCommitAuthor(row);

      if (author && botAuthors.has(author)) {
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
      mountSingleToggle(panel, hiddenRows, visibleCount > 0);
    }
  });

  flushStreak();
}

function mountSingleToggle(
  panel: HTMLElement,
  hiddenRows: HTMLElement[],
  hasVisibleBelow: boolean,
) {
  const container = document.createElement("div");
  container.className = "git-matter-toggle-root";

  panel.insertBefore(container, panel.firstChild);

  const root = createRoot(container);
  mountedRoots.set(container, root);

  let expanded = false;

  const render = () => {
    root.render(
      createElement(HiddenCommitsToggle, {
        expanded,
        hiddenCount: hiddenRows.length,
        hasVisibleBelow,
        onToggle: () => {
          expanded = !expanded;

          hiddenRows.forEach((row) => {
            expanded ? revealRow(row) : hideRow(row);
          });

          render();
        },
      }),
    );
  };

  render();
}

function mountHiddenStreak(groups: HiddenGroup[]) {
  const firstRow = groups[0].timelineRow;

  const container = document.createElement("div");
  container.className = "git-matter-streak-root";

  firstRow.parentElement?.insertBefore(container, firstRow);

  const root = createRoot(container);
  mountedRoots.set(container, root);

  const totalHiddenCommits = groups.reduce(
    (sum, group) => sum + group.hiddenRows.length,
    0,
  );

  let expanded = false;

  const render = () => {
    root.render(
      createElement(HiddenCommitStreak, {
        expanded,
        hiddenCommitCount: totalHiddenCommits,
        hiddenDayCount: groups.length,
        onToggle: () => {
          expanded = !expanded;

          groups.forEach((group) => {
            expanded
              ? revealRow(group.timelineRow)
              : hideRow(group.timelineRow);

            group.hiddenRows.forEach((row) => {
              expanded ? revealRow(row) : hideRow(row);
            });
          });

          render();
        },
      }),
    );
  };

  render();
}

export const startFilteringCommits = runOnce(() => {
  let scheduleRerun = debounce(() => {
    cleanupGitMatter();
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

  // Initial run
  document.readyState === "loading"
    ? window.addEventListener("DOMContentLoaded", scheduleRerun, { once: true })
    : scheduleRerun();
});
