export type CommitItem = {
  row: HTMLElement;
  authors: string[];
  filtered: boolean;
};

export type CommitPanelContent = {
  timelineRow: HTMLElement;
  commits: CommitItem[];
};

export type CommitPanel = CommitPanelContent & {
  panel: HTMLElement;
};
