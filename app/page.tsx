"use client";
import { useState } from "react";
import TabList from "@/components/TabList";
import Input from "@/components/Input";

export default function Home() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Mini Browser</h1>

      <TabList activeId={active} onSelect={setActive} />
    </main>
  );
}
