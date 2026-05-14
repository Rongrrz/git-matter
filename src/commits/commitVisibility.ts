import type { CommitVisibilityMode } from "../types";
import { CommitPageSelectors, GitMatterSelectosr } from "./selectors";
import type { CommitItem, CommitPanelItem } from "./types";

function stopRowAnimations(row: HTMLElement): void {
  row.getAnimations().forEach((animation) => animation.cancel());
}

export function resetRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.style.display = "";
  row.classList.remove(GitMatterSelectosr.dimmed);
}

export function dimRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.style.display = "";
  row.classList.add(GitMatterSelectosr.dimmed);
}

export function hideRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.classList.remove(GitMatterSelectosr.dimmed);
  row.style.display = "none";
}

export function revealRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.style.display = "";
}

export function applyCommitVisibility(items: CommitPanelItem[], mode: CommitVisibilityMode): void {
  items.forEach((item) => {
    resetRow(item.timelineRow);

    item.commits.forEach((commit) => {
      applySingleCommitVisibility(commit, mode);
    });
  });
}

export function applySingleCommitVisibility(commit: CommitItem, mode: CommitVisibilityMode): void {
  resetRow(commit.row);

  if (!commit.filtered || mode === "off") return;

  if (mode === "dim") {
    dimRow(commit.row);
    return;
  }

  hideRow(commit.row);
}

export function resetAllCommitVisibility(): void {
  document.querySelectorAll<HTMLElement>(CommitPageSelectors.allCommitPageRows).forEach(resetRow);
}
