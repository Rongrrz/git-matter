import type { CommitVisibilityMode } from "../types";
import { CommitPageSelectors, GitMatterSelectors } from "./selectors";
import type { CommitItem, CommitPanelItem, HiddenPanelGroup } from "./types";

function stopRowAnimations(row: HTMLElement): void {
  row.getAnimations().forEach((animation) => animation.cancel());
}

function resetRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.classList.remove(
    GitMatterSelectors.dimmed,
    GitMatterSelectors.hidden,
    GitMatterSelectors.lastCommit,
  );
}

function dimRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.classList.remove(GitMatterSelectors.hidden);
  row.classList.add(GitMatterSelectors.dimmed);
}

function hideRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.classList.remove(GitMatterSelectors.dimmed);
  row.classList.add(GitMatterSelectors.hidden);
}

function revealRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.classList.remove(GitMatterSelectors.hidden, GitMatterSelectors.lastCommit);
}

function applyExpandedState(rows: HTMLElement[], expanded: boolean): void {
  rows.forEach((row) => (expanded ? revealRow(row) : hideRow(row)));
}

function setFilteredCommitsExpanded(commits: CommitItem[], expanded: boolean): void {
  const hiddenRows = commits.filter((commit) => commit.filtered).map((commit) => commit.row);
  applyExpandedState(hiddenRows, expanded);

  if (expanded) {
    clearLastCommitStyling(commits);
  } else {
    syncLastCommitStyling(commits);
  }
}

function setHiddenPanelGroupsExpanded(groups: HiddenPanelGroup[], expanded: boolean): void {
  groups.forEach((group) => {
    applyExpandedState([group.timelineRow], expanded);
    setFilteredCommitsExpanded(group.commits, expanded);
  });
}

export const visibilityControls = {
  setFilteredCommitsExpanded,
  setHiddenPanelGroupsExpanded,
} as const;

export function applyCommitVisibility(panels: CommitPanelItem[], mode: CommitVisibilityMode): void {
  panels.forEach((panel) => {
    resetRow(panel.timelineRow);

    panel.commits.forEach((commit) => {
      applySingleCommitVisibility(commit, mode);
    });

    // We need to check for an edge case where our current commit will be the "last child"
    // after filtering, so that we do not apply a bottom border.
    if (mode === "hide") syncLastCommitStyling(panel.commits);
  });
}

function clearLastCommitStyling(commits: CommitItem[]): void {
  commits.forEach((commit) => {
    commit.row.classList.remove(GitMatterSelectors.lastCommit);
  });
}

function syncLastCommitStyling(commits: CommitItem[]): void {
  clearLastCommitStyling(commits);

  commits.forEach((commit, index) => {
    if (commit.filtered) return;

    const futureCommits = commits.slice(index + 1);
    const followedOnlyByFilteredCommits =
      futureCommits.length > 0 && futureCommits.every((futureCommit) => futureCommit.filtered);

    if (followedOnlyByFilteredCommits) {
      commit.row.classList.add(GitMatterSelectors.lastCommit);
    }
  });
}

export function applySingleCommitVisibility(commit: CommitItem, mode: CommitVisibilityMode): void {
  resetRow(commit.row);
  if (!commit.filtered || mode === "off") return;
  if (mode === "dim") return dimRow(commit.row);
  if (mode === "hide") return hideRow(commit.row);
}

export function resetAllCommitVisibility(): void {
  document.querySelectorAll<HTMLElement>(CommitPageSelectors.allCommitPageRows).forEach(resetRow);
}
