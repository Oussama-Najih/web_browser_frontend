export type HistoryEntry = {
  url: string;
};

export type Tab = {
  id: number;
  currentIndex: number;
  history: HistoryEntry[];
};
