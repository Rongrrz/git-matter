import type { CommitItem, CommitPanel } from '../types';
import { getCommitAuthors, shouldFilterCommit } from './authors';
import {
  findCommitGroupPanels,
  findCommitRows,
  findCommitRowsWithinNode,
  findTimelineRowForPanel,
} from './commits';

export function getCommitPanels(): CommitPanel[] {
  const panels = findCommitGroupPanels();

  return panels.flatMap((panel) => {
    const timelineRow = findTimelineRowForPanel(panel);
    if (!timelineRow) return [];

    const commits: CommitItem[] = findCommitRows(panel).map((row) => {
      const authors = getCommitAuthors(row);
      return {
        row,
        authors,
        filtered: shouldFilterCommit(authors),
      };
    });

    if (commits.length === 0) return [];

    return [{ panel, timelineRow, commits }];
  });
}

export function collectCommitRowsFromNode(node: HTMLElement): HTMLElement[] {
  return findCommitRowsWithinNode(node);
}
