import { CommitAuthors } from './authors';
import { CommitPageDom, CommitRows } from './commits';
import { CommitPanels } from './panels';

export const CommitDom = {
  authors: CommitAuthors,
  panels: CommitPanels,
  rows: CommitRows,
  page: CommitPageDom,
} as const;
