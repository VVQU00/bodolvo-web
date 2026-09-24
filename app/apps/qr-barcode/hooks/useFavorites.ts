// app/apps/qr-barcode/hooks/useFavorites.ts

"use client";

import { useEffect, useState } from "react";

import {
  addFavorite,
  clearFavorites,
  deleteFavorite,
  loadFavorites,
  type FavoriteItem,
} from "../utils/favoritesStorage";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    async function initialize() {
      const stored = await loadFavorites();
      setFavorites(stored);
    }

    initialize();
  }, []);

  async function favorite(
    value: string,
    type: "qr" | "barcode",
  ) {
    const updated = await addFavorite(value, type);

    setFavorites(updated);

    setFavorited(true);

    window.setTimeout(() => {
      setFavorited(false);
    }, 1500);
  }

  async function remove(id: string) {
    const updated = await deleteFavorite(id);
    setFavorites(updated);
  }

  async function clear() {
    await clearFavorites();
    setFavorites([]);
  }

  return {
    favorites,
    favorited,
    favorite,
    remove,
    clear,
    setFavorites,
  };
}