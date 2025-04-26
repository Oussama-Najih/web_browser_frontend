"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type ListProps = {
  activeId: number | null;
  // pass in a setter so we can update the tab list on success
  setTabs: (tabs: any[]) => void;
};

export default function List({ activeId, setTabs }: ListProps) {
  const [url, setUrl] = useState("");

  const addUrlToActiveTab = async () => {
    if (activeId == null || !url.trim()) return;

    const res = await fetch(
      `/tab/${activeId}/entry?url=${encodeURIComponent(url.trim())}`,
      { method: "POST" }
    );
    if (res.ok) {
      const data = await res.json();
      setTabs(data);
      setUrl("");
    } else {
      console.error("Failed to add URL:", res.statusText);
    }
  };

  return (
    <div className="flex space-x-2">
      <Input
        placeholder="add a url…"
        value={url}
        onChange={(e) => setUrl(e.currentTarget.value)}
        onKeyDown={(e) => e.key === "Enter" && addUrlToActiveTab()}
      />
      <Button onClick={addUrlToActiveTab} variant="secondary">
        Add
      </Button>
    </div>
  );
}
