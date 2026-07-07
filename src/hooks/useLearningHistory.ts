import { useState } from "react";
import type { LearningRecord } from "../types";

const historyStorageKey = "reading-5step-history";

export function useLearningHistory() {
  const [learningHistory, setLearningHistory] = useState<LearningRecord[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(historyStorageKey) ?? "[]") as LearningRecord[];
    } catch {
      return [];
    }
  });

  const addLearningRecord = (record: LearningRecord) => {
    setLearningHistory((previous) => {
      const next = [record, ...previous].slice(0, 50);
      localStorage.setItem(historyStorageKey, JSON.stringify(next));
      return next;
    });
  };

  return { learningHistory, addLearningRecord };
}
