// app/apps/qr-barcode/utils/favoritesStorage.ts

export type FavoriteItem = {
  id: string;
  value: string;
  type: "qr" | "barcode";
  createdAt: number;
};

const FAVORITES_KEY = "fbqg_favorites";

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export async function loadFavorites(): Promise<
  FavoriteItem[]
> {
  try {
    const storage = getStorage();

    if (!storage) {
      return [];
    }

    const stored = storage.getItem(FAVORITES_KEY);

    if (!stored) {
      return [];
    }

    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export async function addFavorite(
  value: string,
  type: "qr" | "barcode",
): Promise<FavoriteItem[]> {
  const trimmed = value.trim();

  if (!trimmed) {
    return loadFavorites();
  }

  const favorites = await loadFavorites();

  const filtered = favorites.filter(
    (item) =>
      !(
        item.value === trimmed &&
        item.type === type
      ),
  );

  const newItem: FavoriteItem = {
    id: `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    value: trimmed,
    type,
    createdAt: Date.now(),
  };

  const updated = [newItem, ...filtered];

  const storage = getStorage();

  if (storage) {
    storage.setItem(
      FAVORITES_KEY,
      JSON.stringify(updated),
    );
  }

  return updated;
}

export async function deleteFavorite(
  id: string,
): Promise<FavoriteItem[]> {
  const favorites = await loadFavorites();

  const updated = favorites.filter(
    (item) => item.id !== id,
  );

  const storage = getStorage();

  if (storage) {
    storage.setItem(
      FAVORITES_KEY,
      JSON.stringify(updated),
    );
  }

  return updated;
}

export async function clearFavorites() {
  const storage = getStorage();

  if (storage) {
    storage.removeItem(FAVORITES_KEY);
  }
}