// app/page.tsx
"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import TabList from "@/components/TabList";

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

          <div className="border rounded p-4">
            <h2 className="font-medium mb-2">History for Tab #{active}</h2>
            {history.length > 0 ? (
              <ul className="divide-y">
                {history.map((h, idx) => (
                  <li key={idx} className="py-2">
                    <div className="flex justify-between">
                      <span>{h.title}</span>
                      <span className="text-gray-500 text-sm">{h.url}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No history yet</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
