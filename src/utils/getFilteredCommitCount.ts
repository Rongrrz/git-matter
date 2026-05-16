import type { CommitItem } from "../commits/types";

export function getFilteredCommitCount(commits: CommitItem[]): number {
  return commits.filter((commit) => commit.filtered).length;
}
