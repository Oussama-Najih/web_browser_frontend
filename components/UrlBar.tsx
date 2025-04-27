"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";

type UrlBarProps = {
  urlInput: string;
  onChange: (v: string) => void;
  onVisit: () => void;
};

const UrlBar: FC<UrlBarProps> = ({ urlInput, onChange, onVisit }) => (
  <div className="flex space-x-2">
    <input
      type="text"
      value={urlInput}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter URL"
      className="border p-2 rounded flex-grow"
      onKeyDown={(e) => e.key === "Enter" && onVisit()}
    />
    <Button onClick={onVisit}>Visit</Button>
  </div>
);

export default UrlBar;
