export type CommitItem = {
  row: HTMLElement;
  authors: string[];
  filtered: boolean;
};

export type CommitPanelItem = {
  panel: HTMLElement;
  timelineRow: HTMLElement;
  commits: CommitItem[];
};

export type TimelineGroup = Omit<CommitPanelItem, 'panel'>;
