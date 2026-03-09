"use client";

import api from "@/lib/api";
import { HistoryEntry } from "@/lib/types";
import { useEffect, useState } from "react";

export type Tab = {
  id: number;
  current?: { url: string };
  history: { url: string }[];
};

export default function TabList({
  activeId,
  onSelect,
  setHistory,
  setCurrent,
}: {
  activeId: number | null;
  onSelect: (id: number | null) => void;
  setHistory: (history: HistoryEntry[]) => void;
  setCurrent: (current: HistoryEntry | null) => void;
}) {
  const [tabs, setTabs] = useState<Tab[]>([]);

  const fetchTabs = async () => {
    const tabs = await api.get<Tab[]>("/tabs").then((res) => res.data);
    setTabs(tabs);
    onSelect(tabs[0]?.id || null);
  };

  useEffect(() => {
    fetchTabs();
  }, []);

  const handleDelete = async (id: number) => {
    const { data: tabs } = await api.delete<Tab[]>(`/tab/${id}`);
    setTabs(tabs);
    const idx = tabs.findIndex((t) => t.id === id);
    if (idx !== -1) {
      onSelect(tabs[idx].id);
      setHistory(tabs[idx].history);
      setCurrent(tabs[idx].current || null);
    } else if (tabs.length > 0) {
      const previousTab = tabs.find((t) => t.id === id - 1) as Tab;
      onSelect(previousTab?.id);
      setHistory(previousTab?.history);
      setCurrent(previousTab?.current || null);
    }
  };

  const handleCreate = async () => {
    const { data: tabs } = await api.post<Tab[]>("/tabs");
    setTabs(tabs);
    onSelect(tabs[tabs.length - 1].id);
    setHistory([]);
    setCurrent(null);
  };

  return (
    <div className="flex space-x-2 mb-4">
      {tabs.map((t) => (
        <div key={t.id} className="relative">
          <button
            onClick={() => onSelect(t.id)}
            className={`px-3 py-1 rounded flex flex-col items-start ${
              t.id === activeId ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            <span>Tab #{t.id}</span>
          </button>
          <button
            onClick={() => handleDelete(t.id)}
            className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full
                       w-5 h-5 text-xs flex items-center justify-center leading-none"
            title="Close tab"
            disabled={tabs.length === 1}
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={handleCreate}
        className="px-3 py-1 rounded bg-green-400 text-white"
      >
        +
      </button>
    </div>
  );
}
