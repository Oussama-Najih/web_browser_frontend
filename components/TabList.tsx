"use client";

import api from "@/lib/api";
import { useEffect, useState } from "react";

export type Tab = {
  id: number;
  current?: { url: string };
  history: { url: string }[];
};

export default function TabList({
  activeId,
  onSelect,
}: {
  activeId: number | null;
  onSelect: (id: number | null) => void;
}) {
  const [tabs, setTabs] = useState<Tab[]>([]);

  const refreshTabs = async (selectAfterDelete = false, deletedId?: number) => {
    const response = await api.get<Tab[]>("/tabs");
    const newTabs = response.data.sort((a, b) => a.id - b.id);
    setTabs(newTabs);

    if (selectAfterDelete && deletedId !== undefined) {
      const idx = newTabs.findIndex((t) => t.id > deletedId);
      if (idx !== -1) onSelect(newTabs[idx].id);
      else if (newTabs.length > 0) onSelect(newTabs[0].id);
      else onSelect(null);
    }
  };

  useEffect(() => {
    refreshTabs();
  }, []);

  const handleDelete = async (id: number) => {
    await api.delete(`/tab/${id}`);
    await refreshTabs(true, id);
  };

  const handleCreate = async () => {
    await api.post("/tabs");
    await refreshTabs();
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
