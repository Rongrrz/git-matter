import { createElement } from "react";
import { HiddenCommitStreak } from "../components/HiddenCommitsStreak";
import { createReactMount } from "../utils/createReactMount";
import type { HiddenGroup } from "./types";
import type { Root } from "react-dom/client";
import { HiddenCommitsToggle } from "../components/HiddenCommitsToggle";
import { hideRow, revealRow } from "./commitRowDisplay";

// Tracks React roots so we can properly unmount them during cleanup
export const visibleCommitRoots = new Map<HTMLElement, Root>();

export function mountHiddenCommitToggle(
  panel: HTMLElement,
  hiddenRows: HTMLElement[],
  hasVisibleBelow: boolean,
) {
  if (panel.querySelector(".git-matter-toggle-root")) {
    return;
  }

  const { container, root } = createReactMount("git-matter-toggle-root");
  visibleCommitRoots.set(container, root);

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

export function mountHiddenCommitStreak(groups: HiddenGroup[]) {
  const firstRow = groups[0].timelineRow;
  if (firstRow.parentElement?.querySelector(".git-matter-streak-root")) {
    return;
  }

  const { container, root } = createReactMount("git-matter-streak-root");
  visibleCommitRoots.set(container, root);

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
