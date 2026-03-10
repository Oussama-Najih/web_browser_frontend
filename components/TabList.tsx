"use client";

import api from "@/lib/api";
import { HistoryEntry, Tab } from "@/lib/types";
import { useState, useEffect } from "react";
import HistoryList from "./HistoryList";
import { Button } from "./ui/button";

export default function TabList() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const onSelectTab = (updatedTabs: Tab[], id: number) => {
    setActiveId(id);
    const selectedTab = updatedTabs.find((t) => t.id === id);
    if (selectedTab) {
      setHistory(selectedTab.history);
      setCurrentIndex(selectedTab.currentIndex);
    }
  };

  const updateCurrentTab = (updatedTab: Tab) => {
    tabs.forEach((t) => {
      if (t.id === activeId) {
        t.currentIndex = updatedTab.currentIndex;
        t.history = updatedTab.history;
      }
    });
  };

  const navigate = async (direction: "back" | "forward") => {
    if (activeId === null) return;
    const { data: updatedTab } = await api.post<Tab>(
      `/tab/${activeId}/navigate`,
      {
        direction,
      },
    );
    updateCurrentTab(updatedTab);
    setCurrentIndex(updatedTab.currentIndex);
  };

  useEffect(() => {
    const loadTabs = async () => {
      const { data: existingTabs } = await api.get<Tab[]>("/tabs");
      setTabs(existingTabs);
      setHistory(existingTabs[0].history);
      setCurrentIndex(existingTabs[0].currentIndex ?? null);
      setActiveId(existingTabs[0].id);
    };
    loadTabs();
  }, []);

  const updateHistoryList = (tab: Tab) => {
    setHistory(tab.history);
    setCurrentIndex(tab.currentIndex ?? null);
  };

  const handleDelete = async (id: number) => {
    const { data: updatedTabs } = await api.delete<Tab[]>(`/tab/${id}`);
    setTabs(updatedTabs);
    const idx = updatedTabs.findIndex((t) => t.id === id);
    if (idx !== -1) {
      onSelectTab(updatedTabs, updatedTabs[idx].id);
    } else {
      const previousTab = updatedTabs.find((t) => t.id === id - 1) as Tab;
      onSelectTab(updatedTabs, previousTab?.id);
    }
  };

  const handleCreate = async () => {
    const { data: updatedTabs } = await api.post<Tab[]>("/tabs");
    setTabs(updatedTabs);
    onSelectTab(updatedTabs, updatedTabs[updatedTabs.length - 1].id);
  };

  const visitUrl = async () => {
    if (activeId === null || !urlInput) return;
    const { data: tab } = await api.post<Tab>(`/tab/${activeId}/visit`, {
      url: urlInput,
    });
    updateCurrentTab(tab);
    setUrlInput("");
    updateHistoryList(tab);
  };

  return (
    <div className="flex flex-col">
      <div className="flex space-x-2 mb-4">
        {activeId}:{currentIndex}
        {tabs.map((t) => (
          <div key={t.id} className="relative">
            <button
              onClick={() => onSelectTab(tabs, t.id)}
              className={`px-3 py0 rounded flex flex-col items-start ${
                t.id === activeId ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <span>Tab #{t.id}</span>
            </button>
            {t.id !== 1 && (
              <button
                onClick={() => handleDelete(t.id)}
                className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full
                         w-5 h-5 text-xs flex items-center justify-center leading-none"
                title="Close tab"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          onClick={handleCreate}
          className="px-3 py0 rounded bg-green-400 text-white"
        >
          +
        </button>
      </div>
      <div>
        {activeId !== null && (
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter URL"
                className="border p-2 rounded flex-grow"
                onKeyDown={(e) => e.key === "Enter" && visitUrl()}
              />
              <Button
                onClick={visitUrl}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Visit
              </Button>
            </div>

            <HistoryList
              tabId={activeId}
              history={history}
              currentIndex={currentIndex}
              navigate={navigate}
            />
          </div>
        )}
      </div>
    </div>
  );
}
