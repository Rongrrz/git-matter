import { GitMatterSelectors } from "../selectors";
import type { CommitItem } from "../types";

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

export const _lastCommitStyling = {
  clear: clearLastCommitStyling,
  sync: syncLastCommitStyling,
} as const;
