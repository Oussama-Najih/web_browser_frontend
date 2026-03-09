"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

type HistoryEntry = { url: string };

type HistoryListProps = {
  tabId: number;
  history: HistoryEntry[];
  renameEntry: (url: string) => void;
  deleteEntry: (url: string) => void;
};

const HistoryList: FC<HistoryListProps> = ({
  tabId,
  history,
  renameEntry,
  deleteEntry,
}) => (
  <div>
    <h2 className="font-medium mb-2">History for Tab #{tabId}</h2>
    {history.length > 0 ? (
      <ul className="space-y-3">
        {[...history].reverse().map((h, idx) => (
          <li
            key={idx}
            className="py-2 relative border h-20 flex items-center justify-between px-4"
          >
            <div>
              <p className="cursor-pointer font-semibold">{h.url}</p>
            </div>
            <div className="flex items-center gap-5">
              <Pencil
                className="hover:cursor-pointer"
                onClick={() => renameEntry(h.url)}
              />
              <Button
                variant="ghost"
                className="text-destructive text-lg"
                onClick={() => deleteEntry(h.url)}
              >
                X
              </Button>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No history yet.</p>
    )}
  </div>
);

export default HistoryList;
