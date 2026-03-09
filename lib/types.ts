export type HistoryEntry = {
  url: string;
};

export type Tab = {
  id: number;
  current?: HistoryEntry;
  history: HistoryEntry[];
};
