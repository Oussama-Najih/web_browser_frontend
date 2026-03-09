"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import TabList from "@/components/TabList";
import HistoryList from "@/components/HistoryList";
import { Button } from "@/components/ui/button";
import { Tab } from "@/lib/types";

type HistoryEntry = { url: string };

export default function Home() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeId, setActiveId] = useState<number>(1);
  const [urlInput, setUrlInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const fetchTabs = async () => {
    const tabs = await api.get<Tab[]>("/tabs").then((res) => res.data);
    setTabs(tabs);
    console.log("Fetched tabs:", tabs);
    setHistory(tabs[0]?.history || []);
    setCurrentIndex(tabs[0]?.currentIndex);
  };

  const updateHistoryList = (tab: Tab) => {
    setCurrentIndex(tab.currentIndex);
    setHistory(tab.history);
  };

  const onSelectTab = (id: number) => {
    setActiveId(id);
    const selectedTab = tabs.find((t) => t.id === id);
    if (selectedTab) {
      setHistory(selectedTab.history);
      setCurrentIndex(selectedTab.currentIndex);
    }
  };

  useEffect(() => {
    fetchTabs();
  }, []);

  const visitUrl = async () => {
    if (activeId === null || !urlInput) return;
    const { data: tab } = await api.post<Tab>(`/tab/${activeId}/visit`, {
      url: urlInput,
    });
    setUrlInput("");
    updateHistoryList(tab);
  };

  const navigate = async (direction: "back" | "forward") => {
    if (activeId === null) return;
    const { data: tab } = await api.post(`/tab/${activeId}/navigate`, {
      direction,
    });
    updateHistoryList(tab);
  };

  const deleteEntry = async (url: string) => {
    if (activeId === null) return;
    const { data: tab } = await api.delete(`/tab/${activeId}/entry`, {
      data: { url },
    });
    updateHistoryList(tab);
  };

  const renameEntryUrl = async (oldUrl: string) => {
    if (activeId === null) return;
    const newUrl = prompt("Enter the new URL:", oldUrl);
    if (!newUrl || newUrl === oldUrl) return;
    const { data: tab } = await api.put(`/tab/${activeId}/entry`, {
      url: oldUrl,
      newUrl,
    });
    updateHistoryList(tab);
  };

  const canGoBack = currentIndex !== null && currentIndex > 0;

  const canGoForward =
    currentIndex !== null && currentIndex < history.length - 1;

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Mini Browser</h1>

      <TabList
        activeId={activeId}
        onSelect={onSelectTab}
        setTabs={setTabs}
        tabs={tabs}
      />

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

          <div className="flex space-x-2 items-center">
            <Button onClick={() => navigate("back")} disabled={!canGoBack}>
              ◀ Back
            </Button>
            <Button
              onClick={() => navigate("forward")}
              disabled={!canGoForward}
            >
              Forward ▶
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowHistory((h) => !h)}
            >
              {showHistory ? "Hide History" : "Show History"}
            </Button>
          </div>

          {currentIndex !== null ? (
            <div className="border p-4 rounded bg-gray-100">
              <h2 className="font-medium">Currently Viewing: {currentIndex}</h2>
              <p>{history[currentIndex]?.url}</p>
            </div>
          ) : (
            <p className="text-gray-500">No page visited yet .</p>
          )}

          {showHistory && (
            <HistoryList
              tabId={activeId}
              history={history}
              renameEntry={renameEntryUrl}
              deleteEntry={deleteEntry}
            />
          )}
        </div>
      )}
    </main>
  );
}
