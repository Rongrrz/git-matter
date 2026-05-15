import type { CommitVisibilityMode } from "../types";
import { CommitPageSelectors, GitMatterSelectors } from "./selectors";
import type { CommitItem, CommitPanelItem } from "./types";

function stopRowAnimations(row: HTMLElement): void {
  row.getAnimations().forEach((animation) => animation.cancel());
}

export function resetRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.style.display = "";
  row.classList.remove(GitMatterSelectors.dimmed);
}

export function dimRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.style.display = "";
  row.classList.add(GitMatterSelectors.dimmed);
}

export function hideRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.classList.remove(GitMatterSelectors.dimmed);
  row.style.display = "none";
}

export function revealRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.style.display = "";
}

export function applyCommitVisibility(panels: CommitPanelItem[], mode: CommitVisibilityMode): void {
  panels.forEach((panel) => {
    resetRow(panel.timelineRow);

    panel.commits.forEach((commit) => {
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
