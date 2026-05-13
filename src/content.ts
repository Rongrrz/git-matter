import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import "./index.css";
import { HiddenCommitsToggle } from "./components/HiddenCommitsToggle";
import { HiddenCommitStreak } from "./components/HiddenCommitsStreak";
import { botAuthors } from "./constants/botAuthors";

type HiddenGroup = {
  timelineRow: HTMLElement;
  hiddenRows: HTMLElement[];
};

// Track roots globally so we can properly unmount them during cleanup
const mountedRoots = new Map<HTMLElement, Root>();

function getCommitAuthor(row: HTMLElement): string | null {
  const ariaAuthor = row
    .querySelector('[aria-label^="commits by "]')
    ?.getAttribute("aria-label");

  if (ariaAuthor) {
    return ariaAuthor.replace("commits by ", "").trim().toLowerCase();
  }

  const links = Array.from(row.querySelectorAll<HTMLAnchorElement>("a"));
  for (const link of links) {
    const text = link.textContent?.trim().toLowerCase();
    if (text && botAuthors.has(text)) return text;
  }

  const authorLink = row.querySelector<HTMLAnchorElement>('a[href*="author="]');
  if (authorLink) {
    try {
      const url = new URL(authorLink.href);
      return url.searchParams.get("author")?.trim().toLowerCase() || null;
    } catch {
      /* ignore */
    }
  }

  return null;
}

function revealRow(row: HTMLElement) {
  row.style.display = "";

  row.animate(
    [
      {
        opacity: 0,
        transform: "translateY(-6px)",
      },
      {
        opacity: 1,
        transform: "translateY(0)",
      },
    ],
    {
      duration: 180,
      easing: "ease-out",
    },
  );
}

function hideRow(row: HTMLElement) {
  const animation = row.animate(
    [
      {
        opacity: 1,
        transform: "translateY(0)",
      },
      {
        opacity: 0,
        transform: "translateY(-6px)",
      },
    ],
    {
      duration: 140,
      easing: "ease-in",
    },
  );

  animation.onfinish = () => {
    row.style.display = "none";
  };
}

function hideRowImmediately(row: HTMLElement) {
  row.style.display = "none";
}

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
    document.querySelectorAll<HTMLElement>('div[class*="CommitGroup-module__panel"]'),
  );

  let streak: HiddenGroup[] = [];

  function flushStreak() {
    if (streak.length === 0) return;

    if (streak.length >= 2) {
      mountHiddenStreak(streak);
    } else {
      const single = streak[0];
      single.timelineRow.style.display = "";
      const panel = single.hiddenRows[0].closest('div[class*="CommitGroup-module__panel"]') as HTMLElement | null;
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

function mountSingleToggle(panel: HTMLElement, hiddenRows: HTMLElement[], hasVisibleBelow: boolean) {
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
            if (expanded) {
              revealRow(row);
            } else {
              hideRow(row);
            }
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
            if (expanded) {
              revealRow(group.timelineRow);
            } else {
              hideRow(group.timelineRow);
            }

            group.hiddenRows.forEach((row) => {
              if (expanded) {
                revealRow(row);
              } else {
                hideRow(row);
              }
            });
          });

          render();
        },
      }),
    );
  };

  render();
}

// Execution Logic
let rerunTimeout: ReturnType<typeof setTimeout>;

function scheduleRerun() {
  clearTimeout(rerunTimeout);

  rerunTimeout = setTimeout(() => {
    cleanupGitMatter();
    filterCommits();
  }, 300);
}

// 1. Observe DOM changes, crucial for client-side navigation
const observer = new MutationObserver((mutations) => {
  const hasNewCommits = mutations.some((mutation) =>
    Array.from(mutation.addedNodes).some(
      (node) =>
        node instanceof HTMLElement &&
        node.querySelector?.('[data-testid="commit-row-item"]'),
    ),
  );

  if (hasNewCommits) {
    scheduleRerun();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// 2. Browser Back/Forward buttons
// window.addEventListener("popstate", scheduleRerun);

// // 3. GitHub Turbo events
// document.addEventListener("turbo:load", scheduleRerun);
// document.addEventListener("turbo:frame-load", scheduleRerun);
// document.addEventListener("turbo:render", scheduleRerun);

// Initial run
if (document.readyState === "complete") {
  scheduleRerun();
} else {
  window.addEventListener("load", scheduleRerun);
}
