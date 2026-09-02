"use client";

import type { ReactNode } from "react";

interface QuestionProps {
  children: ReactNode;

  animationKey: string | number;

  direction: "forward" | "backward";
}

export default function Question({
  children,
  animationKey,
  direction,
}: QuestionProps) {
  return (
    <div
      key={animationKey}
      className={
        direction === "forward"
          ? "animate-question-forward"
          : "animate-question-backward"
      }
    >
      {children}
    </div>
  );
}