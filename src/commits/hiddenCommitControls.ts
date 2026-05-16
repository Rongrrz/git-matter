import { createElement } from "react";
import { HiddenCommitsStreak } from "../components/HiddenCommitsStreak";
import { HiddenCommitsToggle } from "../components/HiddenCommitsToggle";
import { createReactMount } from "../utils/createReactMount";
import { CommitPageSelectors } from "./selectors";
import { CommitVisibility } from "./visibility";
import type { CommitItem, CommitPanelItem, HiddenPanelGroup, MountedControl } from "./types";

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
      const panel = group.commits[0].row.closest<HTMLElement>(CommitPageSelectors.commitGroupPanel);
      if (panel) {
        mountToggle(panel, group.commits, false);
      }
    } else {
      CommitVisibility.setHiddenPanelGroupsExpanded(streak, false);
      mountStreak(streak);
    }

    streak = [];
  }

  items.forEach((item) => {
    const hiddenCommitCount = getHiddenCommitCount(item.commits);
    const visibleCount = item.commits.length - hiddenCommitCount;

    if (hiddenCommitCount === 0) {
      flushStreak();
      return;
    }

    if (visibleCount === 0) {
      streak.push({
        timelineRow: item.timelineRow,
        commits: item.commits,
      });
      return;
    }

    flushStreak();
    mountToggle(item.panel, item.commits, true);
  });

  flushStreak();
}

function mountToggle(panel: HTMLElement, commits: CommitItem[], hasVisibleBelow: boolean): void {
  const hiddenCommitCount = getHiddenCommitCount(commits);
  const { container, root } = createReactMount("git-matter-toggle-root");
  container.dataset.gitMatterComponent = "";
  controls.add({ container, root });
  panel.insertBefore(container, panel.firstChild);

  let expanded = false;
  const render = () => {
    root.render(
      createElement(HiddenCommitsToggle, {
        expanded,
        hiddenCommitCount,
        hasVisibleBelow,
        onToggle: () => {
          expanded = !expanded;
          CommitVisibility.setFilteredCommitsExpanded(commits, expanded);
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
  firstGroup.timelineRow.parentElement?.insertBefore(container, firstGroup.timelineRow);

  const hiddenCommitCount = groups.reduce(
    (total, group) => total + getHiddenCommitCount(group.commits),
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
          CommitVisibility.setHiddenPanelGroupsExpanded(groups, expanded);
          render();
        },
      }),
    );
  };

  render();
}

function getHiddenCommitCount(commits: CommitItem[]): number {
  return commits.filter((commit) => commit.filtered).length;
}
