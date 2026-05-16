import type { Root } from "react-dom/client";

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

export type HiddenPanelGroup = {
  timelineRow: HTMLElement;
  commits: CommitItem[];
};

export type MountedControl = {
  container: HTMLElement;
  root: Root;
};
