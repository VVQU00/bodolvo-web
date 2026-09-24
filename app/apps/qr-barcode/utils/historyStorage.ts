// app/apps/qr-barcode/utils/historyStorage.ts

export type HistoryItem = {
  id: string;
  value: string;
  type: "qr" | "barcode";
  createdAt: number;
};

const HISTORY_KEY = "fbqg_history";
const MAX_HISTORY_ITEMS = 20;

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export async function loadHistory(): Promise<HistoryItem[]> {
  try {
    const storage = getStorage();

    if (!storage) {
      return [];
    }

    const storedHistory = storage.getItem(HISTORY_KEY);

    if (!storedHistory) {
      return [];
    }

    const parsedHistory = JSON.parse(storedHistory);

    if (!Array.isArray(parsedHistory)) {
      return [];
    }

    return parsedHistory;
  } catch (error) {
    console.error("Failed to load history:", error);
    return [];
  }
}

export async function addHistoryItem(
  value: string,
  type: "qr" | "barcode",
): Promise<HistoryItem[]> {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return loadHistory();
  }

  const currentHistory = await loadHistory();

  const withoutDuplicate = currentHistory.filter(
    (item) =>
      !(
        item.value === trimmedValue &&
        item.type === type
      ),
  );

  const newItem: HistoryItem = {
    id: `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 9)}`,
    value: trimmedValue,
    type,
    createdAt: Date.now(),
  };

  const updatedHistory = [
    newItem,
    ...withoutDuplicate,
  ].slice(0, MAX_HISTORY_ITEMS);

  const storage = getStorage();

  if (storage) {
    storage.setItem(
      HISTORY_KEY,
      JSON.stringify(updatedHistory),
    );
  }

  return updatedHistory;
}

export async function deleteHistoryItem(
  id: string,
): Promise<HistoryItem[]> {
  const currentHistory = await loadHistory();

  const updatedHistory = currentHistory.filter(
    (item) => item.id !== id,
  );

  const storage = getStorage();

  if (storage) {
    storage.setItem(
      HISTORY_KEY,
      JSON.stringify(updatedHistory),
    );
  }

  return updatedHistory;
}

export async function clearHistory(): Promise<void> {
  const storage = getStorage();

  if (storage) {
    storage.removeItem(HISTORY_KEY);
  }
}