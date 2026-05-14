import { createElement } from "react";
import { HiddenCommitStreak } from "../components/HiddenCommitsStreak";
import { createReactMount } from "../utils/createReactMount";
import type { HiddenGroup } from "./types";
import type { Root } from "react-dom/client";
import { HiddenCommitsToggle } from "../components/HiddenCommitsToggle";
import { hideRow, revealRow } from "./commitRowAnimations";

// Tracks React roots so we can properly unmount them during cleanup
export const mountedRoots = new Map<HTMLElement, Root>();

export function mountHiddenCommitToggle(
  panel: HTMLElement,
  hiddenRows: HTMLElement[],
  hasVisibleBelow: boolean,
) {
  const { container, root } = createReactMount("git-matter-toggle-root");
  mountedRoots.set(container, root);

  // Put the container as the first child of the panel
  panel.insertBefore(container, panel.firstChild);

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

export function mountHiddenCommitStreak(groups: HiddenGroup[]) {
  const { container, root } = createReactMount("git-matter-streak-root");
  mountedRoots.set(container, root);

  const firstRow = groups[0].timelineRow;
  firstRow.parentElement?.insertBefore(container, firstRow);

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
