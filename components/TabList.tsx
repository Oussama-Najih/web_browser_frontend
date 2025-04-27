// components/TabList.tsx
"use client";
import api from "@/lib/api";
import { useEffect, useState } from "react";

export type Tab = {
  id: number;
  current?: { url: string; title: string };
  history: { url: string; title: string }[];
};

export default function TabList({
  activeId,
  onSelect,
}: {
  activeId: number | null;
  onSelect: (id: number) => void;
}) {
  const [tabs, setTabs] = useState<Tab[]>([]);

  const refreshTabs = async () => {
    const response = await api.get<Tab[]>("/tabs");
    setTabs(response.data);
  };

  useEffect(() => {
    refreshTabs();
  }, []);

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
            onClick={() => api.delete(`/tab/${t.id}`).then(refreshTabs)}
            className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full
                       w-5 h-5 text-xs flex items-center justify-center leading-none"
            title="Close tab"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={() => api.post("/tabs").then(refreshTabs)}
        className="px-3 py-1 rounded bg-green-400 text-white"
      >
        +
      </button>
    </div>
  );
}
