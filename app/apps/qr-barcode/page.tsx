// app/apps/qr-barcode/page.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import ActionButtons from "./components/ActionButtons";
import AppHeader from "./components/AppHeader";
import BarcodePreview, {
  type BarcodePreviewHandle,
} from "./components/BarcodePreview";
import CodeTypeSelector, {
  type CodeType,
} from "./components/CodeTypeSelector";
import FavoritesList from "./components/FavoritesList";
import HistoryList from "./components/HistoryList";
import QRInput from "./components/QRInput";
import QRPreview, {
  type QRPreviewHandle,
} from "./components/QRPreview";
import ScanButton from "./components/ScanButton";
import SettingsButton from "./components/SettingsButton";

import { useClipboard } from "./hooks/useClipboard";
import { useFavorites } from "./hooks/useFavorites";
import { useHistory } from "./hooks/useHistory";
import { useSaving } from "./hooks/useSaving";
import { useSharing } from "./hooks/useSharing";

import type { FavoriteItem } from "./utils/favoritesStorage";
import type { HistoryItem } from "./utils/historyStorage";
import { loadDefaultCodeType } from "./utils/settingsStorage";

export default function HomeScreen() {
  const searchParams = useSearchParams();

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [value, setValue] = useState(
    "https://google.com",
  );

  const [codeType, setCodeType] =
    useState<CodeType>("qr");

  const qrRef =
    useRef<QRPreviewHandle>(null);

  const barcodeRef =
    useRef<BarcodePreviewHandle>(null);

  const {
    favorites,
    favorited,
    favorite,
    remove: removeFavorite,
    clear: clearFavorites,
  } = useFavorites();

  const {
    history,
    add: addHistory,
    remove: removeHistory,
    clear: clearHistory,
  } = useHistory();

  const {
    copied,
    copy,
  } = useClipboard();

  const {
    isSaving,
    save,
  } = useSaving();

  const {
    isSharing,
    share,
  } = useSharing();

  const isTablet =
    width > 0 &&
    height > 0 &&
    Math.min(width, height) >= 450;

  const isLandscapeTablet =
    isTablet &&
    width > height &&
    width >= 700;

  useEffect(() => {
    function updateDimensions() {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }

    updateDimensions();

    window.addEventListener(
      "resize",
      updateDimensions,
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateDimensions,
      );
    };
  }, []);

  useEffect(() => {
    async function initializeDefaultGenerator() {
      const defaultType =
        await loadDefaultCodeType();

      setCodeType(defaultType);
    }

    initializeDefaultGenerator();
  }, []);

  useEffect(() => {
    const scannedValue =
      searchParams.get("scannedValue");

    const scannedType =
      searchParams.get("scannedType");

    if (!scannedValue) {
      return;
    }

    const detectedType: CodeType =
      scannedType === "qr"
        ? "qr"
        : "barcode";

    setValue(scannedValue);
    setCodeType(detectedType);

    addHistory(
      scannedValue,
      detectedType,
    );
  }, [searchParams]);

  function getActiveCodeRef() {
    return codeType === "qr"
      ? qrRef
      : barcodeRef;
  }

  async function handleCopy() {
    const succeeded =
      await copy(value);

    if (succeeded) {
      await addHistory(
        value,
        codeType,
      );
    }
  }

  async function handleSave() {
    const succeeded = await save(
      value,
      codeType,
      getActiveCodeRef(),
    );

    if (succeeded) {
      await addHistory(
        value,
        codeType,
      );
    }
  }

  async function handleShare() {
    const succeeded = await share(
      value,
      codeType,
      getActiveCodeRef(),
    );

    if (succeeded) {
      await addHistory(
        value,
        codeType,
      );
    }
  }

  async function handleAddFavorite() {
    const text = value.trim();

    if (!text) {
      window.alert(
        "Nothing to favorite\n\nEnter some text, a URL, or a product code first.",
      );

      return;
    }

    try {
      await favorite(
        text,
        codeType,
      );
    } catch (error) {
      console.error(
        "Favorite failed:",
        error,
      );

      window.alert(
        "Favorite failed\n\nBodolvo Scanner could not add this code to Favorites.",
      );
    }
  }

  function handleFavoriteSelect(
    item: FavoriteItem,
  ) {
    setCodeType(item.type);
    setValue(item.value);
  }

  function handleHistorySelect(
    item: HistoryItem,
  ) {
    setCodeType(item.type);
    setValue(item.value);
  }

  function renderPreview() {
    return (
      <div className="previewWrapper">
        {codeType === "qr" ? (
          <QRPreview
            ref={qrRef}
            value={value}
          />
        ) : (
          <BarcodePreview
            ref={barcodeRef}
            value={value}
          />
        )}
      </div>
    );
  }

  function renderActions() {
    return (
      <div className="section">
        <ActionButtons
          isSaving={isSaving}
          isSharing={isSharing}
          copied={copied}
          onSave={handleSave}
          onShare={handleShare}
          onCopy={handleCopy}
        />

        <button
          type="button"
          className={`favoriteButton ${
            favorited
              ? "favoriteButtonActive"
              : ""
          }`}
          onClick={handleAddFavorite}
        >
          <span
            className={`webStar ${
              favorited
                ? "webStarActive"
                : ""
            }`}
          >
            {favorited ? "★" : "☆"}
          </span>

          <span
            className={`favoriteButtonText ${
              favorited
                ? "favoriteButtonTextActive"
                : ""
            }`}
          >
            {favorited
              ? "Added to Favorites"
              : "Add to Favorites"}
          </span>
        </button>
      </div>
    );
  }

  return (
    <main className="safeArea">
      <div
        className={`scrollContent ${
          isTablet
            ? "scrollContentTablet"
            : ""
        } ${
          isLandscapeTablet
            ? "scrollContentLandscape"
            : ""
        }`}
      >
        <div
          className={`pageShell ${
            isTablet
              ? "pageShellTablet"
              : ""
          } ${
            isLandscapeTablet
              ? "pageShellLandscape"
              : ""
          }`}
        >
          {isLandscapeTablet ? (
            <>
              <div className="landscapeGrid">
                <div className="landscapeLeft">
                  <div className="fadeInDown">
                    <AppHeader />
                  </div>

                  <div className="fadeInUp delay100">
                    <ScanButton />
                  </div>

                  <div className="fadeInUp delay140">
                    <SettingsButton />
                  </div>

                  <div className="fadeInUp delay180">
                    <CodeTypeSelector
                      selectedType={
                        codeType
                      }
                      onChange={
                        setCodeType
                      }
                    />
                  </div>

                  <div className="section">
                    <QRInput
                      value={value}
                      onChangeText={
                        setValue
                      }
                    />
                  </div>
                </div>

                <div className="landscapeRight">
                  {renderPreview()}

                  <div className="landscapeActions">
                    {renderActions()}
                  </div>
                </div>
              </div>

              <div className="landscapeLists">
                <div className="landscapeListColumn">
                  <FavoritesList
                    favorites={
                      favorites
                    }
                    onSelect={
                      handleFavoriteSelect
                    }
                    onDelete={
                      removeFavorite
                    }
                    onClear={
                      clearFavorites
                    }
                  />
                </div>

                <div className="landscapeListColumn">
                  <HistoryList
                    history={
                      history
                    }
                    onSelect={
                      handleHistorySelect
                    }
                    onDelete={
                      removeHistory
                    }
                    onClear={
                      clearHistory
                    }
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="fadeInDown">
                <AppHeader />
              </div>

              <div className="fadeInUp delay100">
                <ScanButton />
              </div>

              <div className="fadeInUp delay140">
                <SettingsButton />
              </div>

              <div className="fadeInUp delay180">
                <CodeTypeSelector
                  selectedType={
                    codeType
                  }
                  onChange={
                    setCodeType
                  }
                />
              </div>

              {renderPreview()}

              <div className="section">
                <QRInput
                  value={value}
                  onChangeText={
                    setValue
                  }
                />
              </div>

              {renderActions()}

              <div className="listSection">
                <FavoritesList
                  favorites={
                    favorites
                  }
                  onSelect={
                    handleFavoriteSelect
                  }
                  onDelete={
                    removeFavorite
                  }
                  onClear={
                    clearFavorites
                  }
                />
              </div>

              <div className="listSection">
                <HistoryList
                  history={history}
                  onSelect={
                    handleHistorySelect
                  }
                  onDelete={
                    removeHistory
                  }
                  onClear={
                    clearHistory
                  }
                />
              </div>
            </>
          )}

          <p className="privacy fadePrivacy">
            Private by design. Your information
            stays on your device.
          </p>
        </div>
      </div>

      <style jsx>{`
        .safeArea {
          width: 100%;
          min-height: 100vh;
          background-color: #07090d;
        }

        .scrollContent {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-left: 16px;
          padding-right: 16px;
          padding-top: 20px;
          padding-bottom: 36px;
        }

        .scrollContentTablet {
          padding-left: 24px;
          padding-right: 24px;
          padding-top: 24px;
          padding-bottom: 48px;
        }

        .scrollContentLandscape {
          padding-left: 28px;
          padding-right: 28px;
          padding-top: 20px;
          padding-bottom: 36px;
        }

        .pageShell {
          width: 100%;
          max-width: 640px;
          margin-left: auto;
          margin-right: auto;
        }

        .pageShellTablet {
          max-width: 1000px;
        }

        .pageShellLandscape {
          max-width: 1180px;
        }

        .landscapeGrid {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          gap: 24px;
        }

        .landscapeLeft {
          flex: 0.9;
          min-width: 0;
        }

        .landscapeRight {
          flex: 1.1;
          min-width: 0;
        }

        .landscapeActions {
          width: 100%;
          margin-top: 16px;
        }

        .landscapeLists {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          gap: 24px;
          margin-top: 24px;
        }

        .landscapeListColumn {
          flex: 1;
          min-width: 0;
        }

        .previewWrapper {
          width: 100%;
          position: relative;
        }

        .section {
          width: 100%;
        }

        .listSection {
          width: 100%;
          position: relative;
        }

        .favoriteButton {
          width: 100%;
          min-height: 52px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 9px;
          background-color: #10141c;
          border: 1px solid #28303d;
          border-radius: 16px;
          margin-top: 12px;
          padding: 0 16px;
          cursor: pointer;
          transition:
            opacity 120ms ease,
            transform 120ms ease;
        }

        .favoriteButton:hover {
          opacity: 0.9;
        }

        .favoriteButton:active {
          opacity: 0.72;
          transform: scale(0.98);
        }

        .favoriteButtonActive {
          background-color: #332701;
          border-color: #a16207;
        }

        .favoriteButtonText {
          color: #ffffff;
          font-size: 15px;
          font-weight: 800;
        }

        .favoriteButtonTextActive {
          color: #fbbf24;
        }

        .webStar {
          color: #ffffff;
          font-size: 22px;
          line-height: 24px;
        }

        .webStarActive {
          color: #fbbf24;
        }

        .privacy {
          color: #596273;
          font-size: 12px;
          text-align: center;
          margin: 24px 0 0;
        }

        .fadeInDown {
          animation: fadeInDown 500ms ease both;
        }

        .fadeInUp {
          animation: fadeInUp 450ms ease both;
        }

        .delay100 {
          animation-delay: 100ms;
        }

        .delay140 {
          animation-delay: 140ms;
        }

        .delay180 {
          animation-delay: 180ms;
        }

        .fadePrivacy {
          animation: fadeIn 400ms ease 550ms both;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .fadeInDown,
          .fadeInUp,
          .fadePrivacy {
            animation: none;
          }

          .favoriteButton {
            transition: none;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          background-color: #07090d;
        }

        * {
          box-sizing: border-box;
        }

        button,
        input,
        textarea,
        select {
          font: inherit;
        }
      `}</style>
    </main>
  );
}