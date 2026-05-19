import type { CommitItem } from '../types';

export function getHiddenCommitCount(commits: CommitItem[]): number {
  return commits.filter((commit) => commit.filtered).length;
}
