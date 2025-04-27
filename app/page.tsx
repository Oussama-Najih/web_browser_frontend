"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import TabList from "@/components/TabList";
import HistoryList from "@/components/HistoryList";
import { Button } from "@/components/ui/button";

type HistoryEntry = { url: string };

export default function Home() {
  const [active, setActive] = useState<number | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [current, setCurrent] = useState<HistoryEntry | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const fetchTab = async (tabId: number) => {
    const tabs = await api
      .get<
        { id: number; current: HistoryEntry | null; history: HistoryEntry[] }[]
      >("/tabs")
      .then((res) => res.data);
    const tab = tabs.find((t) => t.id === tabId);
    setCurrent(tab?.current || null);
    setHistory(tab?.history || []);
  };

  useEffect(() => {
    if (active !== null) fetchTab(active);
    else {
      setCurrent(null);
      setHistory([]);
    }
  }, [active]);

  const visitUrl = async () => {
    if (active === null || !urlInput) return;
    await api.post(`/tab/${active}/visit`, { url: urlInput });
    setUrlInput("");
    fetchTab(active);
  };

  const navigate = async (direction: "back" | "forward") => {
    if (active === null) return;
    await api.post(`/tab/${active}/navigate`, { direction });
    fetchTab(active);
  };

  const deleteEntry = async (url: string) => {
    if (active === null) return;
    await api.delete(`/tab/${active}/entry`, { data: { url } });
    fetchTab(active);
  };

  const renameEntryUrl = async (oldUrl: string) => {
    if (active === null) return;
    const newUrl = prompt("Enter the new URL:", oldUrl);
    if (!newUrl || newUrl === oldUrl) return;
    await api.put(`/tab/${active}/entry`, { url: oldUrl, newUrl });
    fetchTab(active);
  };

  const canGoBack = () => {
    if (!current) return false;
    const idx = history.findIndex((h) => h.url === current.url);
    return idx > 0;
  };

  const canGoForward = () => {
    if (!current) return false;
    const idx = history.findIndex((h) => h.url === current.url);
    return idx !== -1 && idx < history.length - 1;
  };

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Mini Browser</h1>

      <TabList activeId={active} onSelect={setActive} />

      {active !== null && (
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
            <Button onClick={() => navigate("back")} disabled={!canGoBack()}>
              ◀ Back
            </Button>
            <Button
              onClick={() => navigate("forward")}
              disabled={!canGoForward()}
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

          {current ? (
            <div className="border p-4 rounded bg-gray-100">
              <h2 className="font-medium">Currently Viewing:</h2>
              <p>{current.url}</p>
            </div>
          ) : (
            <p className="text-gray-500">No page visited yet.</p>
          )}

          {showHistory && (
            <HistoryList
              tabId={active}
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
