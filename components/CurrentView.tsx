"use client";

import { FC } from "react";

type HistoryEntry = { url: string; title: string };

type CurrentViewProps = {
  current: HistoryEntry | null;
};

const CurrentView: FC<CurrentViewProps> = ({ current }) => {
  if (!current) {
    return;
  }

  return (
    <div className="border p-4 rounded bg-gray-100">
      <h2 className="font-medium">Currently Viewing:</h2>
      <p>{current.title}</p>
    </div>
  );
};

export default CurrentView;
