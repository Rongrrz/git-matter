import type { CommitItem } from '@/features/commits/types';

export function getHiddenCommitCount(commits: CommitItem[]): number {
  return commits.filter((commit) => commit.filtered).length;
}
