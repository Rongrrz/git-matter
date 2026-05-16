import { createElement } from "react";
import { HiddenCommitsStreak } from "../../components/HiddenCommitsStreak";
import { CommitVisibility } from "../visibility";
import type { TimelineGroup } from "../types";
import { getFilteredCommitCount } from "../../utils/getFilteredCommitCount";
import { _controlRegistry } from "./controlRegistry";

export function _mountStreak(groups: TimelineGroup[]): void {
  const [firstGroup] = groups;
  const parent = firstGroup.timelineRow.parentElement;
  if (!parent) return;

  const root = _controlRegistry.mountControl("git-matter-streak-root", (container) => {
    parent.insertBefore(container, firstGroup.timelineRow);
  });

  const hiddenCommitCount = getFilteredCommitCount(groups.flatMap((group) => group.commits));

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
