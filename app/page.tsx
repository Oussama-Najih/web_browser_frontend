// app/page.tsx
"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import TabList from "@/components/TabList";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [active, setActive] = useState<number | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [history, setHistory] = useState<{ url: string; title: string }[]>([]);

  // Fetch history for the active tab
  const fetchHistory = async (tabId: number) => {
    const tabs = await api
      .get<
        {
          id: number;
          history: { url: string; title: string }[];
        }[]
      >("/tabs")
      .then((res) => res.data);
    const tab = tabs.find((t) => t.id === tabId);
    setHistory(tab?.history || []);
  };

  // When active tab changes, reload its history
  useEffect(() => {
    if (active !== null) {
      fetchHistory(active);
    } else {
      setHistory([]);
    }
  }, [active]);

  // Visit a new URL in the active tab
  const visitUrl = async () => {
    if (active === null || !urlInput) return;
    await api.post(`/tab/${active}/visit`, {
      url: urlInput,
      title: `Visited: ${urlInput}`,
    });
    setUrlInput("");
    fetchHistory(active);
  };

  const deleteEntry = async (url: string) => {
    if (active === null) return;
    await api.delete(`/tab/${active}/entry`, { data: { url } });
    fetchHistory(active);
  };

  const renameEntry = async (url: string) => {
    if (active === null) return;
    const newTitle = prompt("Enter new title for this entry:");
    if (!newTitle) return;

    await api.put(`/tab/${active}/entry`, {
      url,
      title: newTitle,
    });

    fetchHistory(active);
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
            <button
              onClick={visitUrl}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Visit
            </button>
          </div>

          <h2 className="font-medium mb-2">History for Tab #{active}</h2>
          {history.length > 0 ? (
            <ul className="space-y-3">
              {history.map((h, idx) => (
                <li
                  key={idx}
                  className="py-2 relative border h-20 flex items-center"
                >
                  <span>{h.title}</span>
                  <Button
                    variant="ghost"
                    className="absolute top-2 right-4 text-destructive"
                    onClick={() => deleteEntry(h.url)}
                  >
                    X
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-blue-600"
                    onClick={() => renameEntry(h.url)}
                  >
                    Rename
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No history yet</p>
          )}
        </div>
      )}
    </main>
  );
}
