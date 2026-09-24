// app/apps/qr-barcode/components/FavoritesList.tsx

"use client";

import type { FavoriteItem } from "../utils/favoritesStorage";

type FavoritesListProps = {
  favorites: FavoriteItem[];
  onSelect: (item: FavoriteItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
};

export default function FavoritesList({
  favorites,
  onSelect,
  onDelete,
  onClear,
}: FavoritesListProps) {
  function confirmClear() {
    const confirmed = window.confirm(
      "Clear favorites?\n\nRemove every saved favorite?",
    );

    if (confirmed) {
      onClear();
    }
  }

  if (favorites.length === 0) {
    return (
      <section className="section">
        <div className="headerRow">
          <div>
            <div className="eyebrow">
              FAVORITES
            </div>

            <div className="title">
              Saved Codes
            </div>
          </div>
        </div>

        <div className="emptyCard">
          <div className="webStar">☆</div>

          <div className="emptyTitle">
            No favorites yet
          </div>

          <div className="emptyText">
            Save your most-used QR codes and barcodes here.
          </div>
        </div>

        <style jsx>{styles}</style>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="headerRow">
        <div>
          <div className="eyebrow">
            FAVORITES
          </div>

          <div className="title">
            Saved Codes
          </div>
        </div>

        <button
          type="button"
          className="clearButton"
          onClick={confirmClear}
        >
          Clear
        </button>
      </div>

      {favorites.map((item) => (
        <button
          key={item.id}
          type="button"
          className="item"
          onClick={() => onSelect(item)}
        >
          <span className="icon">
            <span className="itemStar">★</span>
          </span>

          <span className="itemContent">
            <span className="value">
              {item.value}
            </span>

            <span className="type">
              {item.type === "qr"
                ? "QR Code"
                : "Barcode"}
            </span>
          </span>

          <button
            type="button"
            className="deleteButton"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(item.id);
            }}
            aria-label="Delete favorite"
          >
            <span className="webTrash">×</span>
          </button>
        </button>
      ))}

      <style jsx>{styles}</style>
    </section>
  );
}

const styles = `
  .section {
    margin-top: 28px;
  }

  .headerRow {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .eyebrow {
    color: #171717;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 1.3px;
  }

  .title {
    color: #f8fafc;
    font-size: 20px;
    font-weight: 800;
    margin-top: 3px;
  }

  .clearButton {
    border: 0;
    background: transparent;
    color: #f87171;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    padding: 6px;
  }

  .clearButton:active {
    opacity: 0.65;
  }

  .emptyCard {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #0b1220;
    border: 1px solid #1e293b;
    border-radius: 20px;
    padding: 24px;
  }

  .emptyTitle {
    color: #171717;
    font-size: 15px;
    font-weight: 800;
    margin-top: 10px;
  }

  .emptyText {
    color: #64748b;
    text-align: center;
    margin-top: 6px;
  }

  .item {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #0b1220;
    border: 1px solid #1e293b;
    border-radius: 18px;
    padding: 14px;
    margin-bottom: 10px;
    text-align: left;
    cursor: pointer;
    color: inherit;
    transition: opacity 120ms ease;
  }

  .item:active {
    opacity: 0.82;
  }

  .icon {
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    border-radius: 14px;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
  }

  .itemStar {
    color: #171717;
    font-size: 20px;
    line-height: 1;
  }

  .itemContent {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .value {
    color: #f8fafc;
    font-weight: 700;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .type {
    color: #64748b;
    margin-top: 3px;
    font-size: 11px;
  }

  .deleteButton {
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    background: transparent;
    border-radius: 12px;
    cursor: pointer;
  }

  .deleteButton:active {
    opacity: 0.65;
  }

  .webStar {
    color: #171717;
    font-size: 28px;
    line-height: 31px;
  }

  .webTrash {
    color: #94a3b8;
    font-size: 25px;
    line-height: 26px;
  }
`;