// app/apps/qr-barcode/components/HistoryList.tsx

"use client";

import type { HistoryItem } from "../utils/historyStorage";

type HistoryListProps = {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
};

export default function HistoryList({
  history,
  onSelect,
  onDelete,
  onClear,
}: HistoryListProps) {
  function confirmClearHistory() {
    const confirmed = window.confirm(
      "Clear history?\n\nThis will remove all recently generated codes.",
    );

    if (confirmed) {
      onClear();
    }
  }

  if (history.length === 0) {
    return (
      <section className="section">
        <div className="headerRow">
          <div>
            <div className="eyebrow">RECENT</div>
            <div className="title">History</div>
          </div>
        </div>

        <div className="emptyCard">
          <div className="webHistoryIcon">🕘</div>

          <div className="emptyTitle">
            No recent codes yet
          </div>

          <div className="emptyText">
            Generated QR codes and barcodes will appear here.
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
          <div className="eyebrow">RECENT</div>
          <div className="title">History</div>
        </div>

        <button
          type="button"
          className="clearButton"
          onClick={confirmClearHistory}
        >
          Clear all
        </button>
      </div>

      <div className="list">
        {history.map((item) => (
          <div
            key={item.id}
            className="item"
            role="button"
            tabIndex={0}
            onClick={() => onSelect(item)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" ||
                event.key === " "
              ) {
                event.preventDefault();
                onSelect(item);
              }
            }}
          >
            <span className="iconBox">
              <span className="webItemIcon">
                {item.type === "qr" ? "⌗" : "▥"}
              </span>
            </span>

            <span className="itemContent">
              <span className="itemValue">
                {item.value}
              </span>

              <span className="itemType">
                {item.type === "qr"
                  ? "QR Code"
                  : "Code 128 Barcode"}
              </span>
            </span>

            <button
              type="button"
              className="deleteButton"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(item.id);
              }}
              aria-label="Delete history item"
            >
              <span className="webDeleteIcon">×</span>
            </button>
          </div>
        ))}
      </div>

      <style jsx>{styles}</style>
    </section>
  );
}

const styles = `
  .section {
    margin-top: 30px;
  }

  .headerRow {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 13px;
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
    padding: 7px 11px;
    color: #f87171;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }

  .clearButton:active {
    opacity: 0.7;
    transform: scale(0.98);
  }

  .emptyCard {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #0b1220;
    border: 1px solid #1e293b;
    border-radius: 20px;
    padding: 26px 20px;
  }

  .emptyTitle {
    color: #cbd5e1;
    font-size: 15px;
    font-weight: 800;
    margin-top: 10px;
  }

  .emptyText {
    color: #64748b;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    margin-top: 5px;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .item {
    width: 100%;
    min-height: 68px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #0b1220;
    border: 1px solid #1e293b;
    border-radius: 17px;
    padding: 10px 12px;
    text-align: left;
    color: inherit;
    cursor: pointer;
    transition:
      opacity 120ms ease,
      transform 120ms ease;
  }

  .item:active {
    opacity: 0.7;
    transform: scale(0.98);
  }

  .item:focus-visible {
    outline: 2px solid #171717;
    outline-offset: 2px;
  }

  .iconBox {
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #0f1d35;
    border-radius: 13px;
    margin-right: 12px;
  }

  .itemContent {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .itemValue {
    color: #f8fafc;
    font-size: 14px;
    font-weight: 700;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .itemType {
    color: #64748b;
    font-size: 11px;
    margin-top: 4px;
  }

  .deleteButton {
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  .deleteButton:active {
    opacity: 0.7;
    transform: scale(0.96);
  }

  .webHistoryIcon {
    color: #64748b;
    font-size: 26px;
    line-height: 28px;
  }

  .webItemIcon {
    color: #171717;
    font-size: 21px;
    font-weight: 900;
    line-height: 24px;
  }

  .webDeleteIcon {
    color: #94a3b8;
    font-size: 24px;
    line-height: 24px;
  }
`;