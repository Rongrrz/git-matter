import { createElement } from "react";
import { HiddenCommitsStreak } from "../components/HiddenCommitsStreak";
import { HiddenCommitsToggle } from "../components/HiddenCommitsToggle";
import { createReactMount } from "../utils/createReactMount";
import { commitPageSelectors } from "./selectors";
import { hideRow, revealRow } from "./commitVisibility";
import type { CommitPanelItem, HiddenPanelGroup, MountedControl } from "./types";

const controls = new Set<MountedControl>();

export function clearHiddenCommitControls(): void {
  controls.forEach(({ container, root }) => {
    root.unmount();
    container.remove();
  });
  controls.clear();
}

export function renderHiddenCommitControls(items: CommitPanelItem[]): void {
  clearHiddenCommitControls();

  let streak: HiddenPanelGroup[] = [];

  function flushStreak(): void {
    if (streak.length === 0) return;

    if (streak.length === 1) {
      const [group] = streak;
      revealRow(group.timelineRow);
      const panel = group.hiddenRows[0].closest<HTMLElement>(
        commitPageSelectors.commitGroupPanel,
      );
      if (panel) {
        mountToggle(panel, group.hiddenRows, false);
      }
    } else {
      streak.forEach((group) => hideRow(group.timelineRow));
      mountStreak(streak);
    }

    streak = [];
  }

  items.forEach((item) => {
    const hiddenRows = item.commits
      .filter((commit) => commit.filtered)
      .map((commit) => commit.row);
    const visibleCount = item.commits.length - hiddenRows.length;

    if (hiddenRows.length === 0) {
      flushStreak();
      return;
    }

    if (visibleCount === 0) {
      streak.push({
        timelineRow: item.timelineRow,
        hiddenRows,
      });
      return;
    }

    flushStreak();
    mountToggle(item.panel, hiddenRows, true);
  });

  flushStreak();
}

function mountToggle(
  panel: HTMLElement,
  hiddenRows: HTMLElement[],
  hasVisibleBelow: boolean,
): void {
  const { container, root } = createReactMount("git-matter-toggle-root");
  container.dataset.gitMatterComponent = "";
  controls.add({ container, root });
  panel.insertBefore(container, panel.firstChild);

  let expanded = false;
  const render = () => {
    root.render(
      createElement(HiddenCommitsToggle, {
        expanded,
        hiddenCommitCount: hiddenRows.length,
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

function mountStreak(groups: HiddenPanelGroup[]): void {
  const [firstGroup] = groups;
  const { container, root } = createReactMount("git-matter-streak-root");
  container.dataset.gitMatterComponent = "";
  controls.add({ container, root });
  firstGroup.timelineRow.parentElement?.insertBefore(
    container,
    firstGroup.timelineRow,
  );

  const hiddenCommitCount = groups.reduce(
    (total, group) => total + group.hiddenRows.length,
    0,
  );

  let expanded = false;
  const render = () => {
    root.render(
      createElement(HiddenCommitsStreak, {
        expanded,
        hiddenCommitCount,
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
