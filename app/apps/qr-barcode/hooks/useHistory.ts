// app/apps/qr-barcode/hooks/useHistory.ts

"use client";

import { useEffect, useState } from "react";

import {
  addHistoryItem,
  clearHistory,
  deleteHistoryItem,
  loadHistory,
  type HistoryItem,
} from "../utils/historyStorage";

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    async function initialize() {
      const stored = await loadHistory();
      setHistory(stored);
    }

    initialize();
  }, []);

  async function add(
    value: string,
    type: "qr" | "barcode",
  ) {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return;
    }

    const updated = await addHistoryItem(
      trimmedValue,
      type,
    );

    setHistory(updated);
  }

  async function remove(id: string) {
    const updated = await deleteHistoryItem(id);
    setHistory(updated);
  }

  async function clear() {
    await clearHistory();
    setHistory([]);
  }

  return {
    history,
    add,
    remove,
    clear,
    setHistory,
  };
}