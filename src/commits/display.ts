import type { FilteredCommitDisplayMode } from "../types";
import { commitPageSelectors, GIT_MATTER_CLASSES } from "./selectors";
import type { CommitItem, CommitPanelItem } from "./types";

function stopRowAnimations(row: HTMLElement): void {
  row.getAnimations().forEach((animation) => animation.cancel());
}

export function resetRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.style.display = "";
  row.classList.remove(GIT_MATTER_CLASSES.dimmed);
}

export function dimRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.style.display = "";
  row.classList.add(GIT_MATTER_CLASSES.dimmed);
}

export function hideRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.classList.remove(GIT_MATTER_CLASSES.dimmed);
  row.style.display = "none";
}

export function revealRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.style.display = "";
}

export function applyCommitDisplay(
  items: CommitPanelItem[],
  mode: FilteredCommitDisplayMode,
): void {
  items.forEach((item) => {
    resetRow(item.timelineRow);

    item.commits.forEach((commit) => {
      applySingleCommitDisplay(commit, mode);
    });
  });
}

export function applySingleCommitDisplay(
  commit: CommitItem,
  mode: FilteredCommitDisplayMode,
): void {
  resetRow(commit.row);

  if (!commit.filtered || mode === "off") return;

  if (mode === "dim") {
    dimRow(commit.row);
    return;
  }

  hideRow(commit.row);
}

export function resetAllCommitDisplay(): void {
  document
    .querySelectorAll<HTMLElement>(commitPageSelectors.rowsToReset)
    .forEach(resetRow);
}
