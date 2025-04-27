"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";

type NavigationControlsProps = {
  canBack: boolean;
  canForward: boolean;
  showHistory: boolean;
  onBack: () => void;
  onForward: () => void;
  toggleHistory: () => void;
};

const NavigationControls: FC<NavigationControlsProps> = ({
  canBack,
  canForward,
  showHistory,
  onBack,
  onForward,
  toggleHistory,
}) => (
  <div className="flex space-x-2 items-center">
    <Button onClick={onBack} disabled={!canBack}>
      ◀ Back
    </Button>
    <Button onClick={onForward} disabled={!canForward}>
      Forward ▶
    </Button>
    <Button variant="secondary" onClick={toggleHistory}>
      {showHistory ? "Hide History" : "Show History"}
    </Button>
  </div>
);

export default NavigationControls;
