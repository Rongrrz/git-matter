import { commitPageSelectors } from "./selectors";
import { getCommitAuthors, shouldFilterCommit } from "./authorFiltering";
import type { CommitItem, CommitPanelItem } from "./types";

export function collectCommitPageItems(): CommitPanelItem[] {
  const panels = document.querySelectorAll<HTMLElement>(
    commitPageSelectors.commitGroupPanel,
  );

  return Array.from(panels).flatMap((panel) => {
    const timelineRow = panel.closest<HTMLElement>(
      commitPageSelectors.timelineRow,
    );
    if (!timelineRow) return [];

    const commitRows = panel.querySelectorAll<HTMLElement>(
      commitPageSelectors.commitRow,
    );
    const commits: CommitItem[] = Array.from(commitRows, (row) => {
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
  const rows: HTMLElement[] = [];

  if (node.matches(commitPageSelectors.commitRow)) {
    rows.push(node);
  }

  rows.push(
    ...Array.from(
      node.querySelectorAll<HTMLElement>(commitPageSelectors.commitRow),
    ),
  );

  return rows;
}
