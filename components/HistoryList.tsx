// components/HistoryList.tsx
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Tab } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export interface HistoryEntry {
  url: string;
  title: string;
}

interface HistoryListProps {
  activeId: number | null;
  setTabs: (tabs: Tab[]) => void;
}

export default function HistoryList({ activeId, setTabs }: HistoryListProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [url, setUrl] = useState("");

  // Reload history whenever the active tab changes
  useEffect(() => {
    if (activeId == null) {
      setHistory([]);
      return;
    }
    api
      .get<HistoryEntry[]>(`/tab/${activeId}/history`)
      .then((res) => setHistory(res.data))
      .catch((err) => console.error("Load history failed:", err));
  }, [activeId]);

  // Add a new URL entry
  const addUrlToActiveTab = async () => {
    if (activeId == null || !url.trim()) return;

    try {
      // POST to C-server and update tabs
      const res = await api.post<Tab[]>(`/tab/${activeId}/entry`, null, {
        params: { url: url.trim() },
      });
      setTabs(res.data);
      setUrl("");

      // Re-fetch the updated history
      const hist = await api.get<HistoryEntry[]>(`/tab/${activeId}/history`);
      setHistory(hist.data);
    } catch (err) {
      console.error("Add entry failed:", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="add a url…"
          value={url}
          onChange={(e) => setUrl(e.currentTarget.value)}
          onKeyDown={(e) => e.key === "Enter" && addUrlToActiveTab()}
        />
        <Button onClick={addUrlToActiveTab} variant="secondary">
          Add
        </Button>
      </div>
      <ul className="list-disc pl-5 space-y-1">
        {history.map((h, i) => (
          <li key={i}>
            <a
              href={h.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {h.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
