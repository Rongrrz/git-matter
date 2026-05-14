/** Represents a group of consecutive hidden commits grouped under a single timeline row. */
export type HiddenGroup = {
  /** The parent timeline row that contains the hidden commits */
  timelineRow: HTMLElement;
  /** The commit rows that were hidden */
  hiddenRows: HTMLElement[];
};
