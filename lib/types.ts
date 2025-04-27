// types.ts
export type HistoryEntry = {
  url: string;
  title: string;
};

export type Tab = {
  id: number;
  current?: HistoryEntry;
  history: HistoryEntry[];
};
