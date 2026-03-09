"use client";

import api from "@/lib/api";
import { HistoryEntry, Tab } from "@/lib/types";

export default function TabList({
  activeId,
  onSelect,
  setTabs,
  tabs,
}: {
  activeId: number | null;
  onSelect: (id: number) => void;
  setTabs: (tabs: Tab[]) => void;
  tabs: Tab[];
}) {
  const handleDelete = async (id: number) => {
    const { data: tabs } = await api.delete<Tab[]>(`/tab/${id}`);
    setTabs(tabs);
    const idx = tabs.findIndex((t) => t.id === id);
    if (idx !== -1) {
      onSelect(id);
    } else if (tabs.length > 0) {
      const previousTab = tabs.find((t) => t.id === id - 1) as Tab;
      onSelect(previousTab?.id);
    }
  };

  const handleCreate = async () => {
    const { data: tabs } = await api.post<Tab[]>("/tabs");
    setTabs(tabs);
    onSelect(tabs[tabs.length - 1].id);
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
