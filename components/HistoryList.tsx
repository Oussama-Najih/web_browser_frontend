"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { HistoryEntry, Tab } from "@/lib/types";

type HistoryListProps = {
  tabId: number;
  history: HistoryEntry[];
  currentIndex: number;
  navigate: (direction: "back" | "forward") => void;
};

const HistoryList: FC<HistoryListProps> = ({
  tabId,
  history,
  currentIndex,
  navigate,
}) => {
  const [showHistory, setShowHistory] = useState(false);

  const canGoBack = currentIndex !== -1 && currentIndex > 0;
  const canGoForward = currentIndex !== -1 && currentIndex < history.length - 1;

  const currentUrl = currentIndex !== -1 ? history[currentIndex]?.url : null;

  return (
    <div>
      <div className="flex space-x-2 items-center">
        <Button onClick={() => navigate("back")} disabled={!canGoBack}>
          ◀ Back
        </Button>
        <Button onClick={() => navigate("forward")} disabled={!canGoForward}>
          Forward ▶
        </Button>
        <Button variant="secondary" onClick={() => setShowHistory((h) => !h)}>
          {showHistory ? "Hide History" : "Show History"}
        </Button>
      </div>

      {currentUrl !== null ? (
        <div className="border p-4 rounded bg-gray-100 mt-2">
          <h2 className="font-medium text-sm text-gray-500">
            Currently Viewing
          </h2>
          <p className="font-semibold truncate">{currentUrl}</p>
        </div>
      ) : (
        <p className="text-gray-500 mt-2">No page visited yet.</p>
      )}

      {showHistory && (
        <>
          <h2 className="font-medium mb-2 mt-4">History for Tab #{tabId}</h2>
          {history.length > 0 ? (
            <ul className="space-y-3">
              {[...history].reverse().map((h, idx) => (
                <li
                  key={idx}
                  className={`p-3 rounded cursor-pointer ${
                    history.length - 1 - idx === currentIndex
                      ? "bg-blue-400 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  <div>
                    <p className="cursor-pointer font-semibold">{h.url}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No history yet.</p>
          )}
        </>
      )}
    </div>
  );
};

export default HistoryList;
