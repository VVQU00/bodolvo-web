// app/apps/qr-barcode/settings/page.tsx

"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
} from "react";

import {
  loadAppLockEnabled,
  loadDefaultCodeType,
  saveAppLockEnabled,
  saveDefaultCodeType,
  type DefaultCodeType,
} from "../utils/settingsStorage";

export default function SettingsScreen() {
  const router = useRouter();

  const [defaultType, setDefaultType] =
    useState<DefaultCodeType>("qr");

  const [appLockEnabled, setAppLockEnabled] =
    useState(false);

  const [changingAppLock, setChangingAppLock] =
    useState(false);

  useEffect(() => {
    async function loadSettings() {
      const [storedType, storedAppLock] =
        await Promise.all([
          loadDefaultCodeType(),
          loadAppLockEnabled(),
        ]);

      setDefaultType(storedType);
      setAppLockEnabled(storedAppLock);
    }

    loadSettings();
  }, []);

  async function handleTypeChange(
    type: DefaultCodeType,
  ) {
    try {
      setDefaultType(type);
      await saveDefaultCodeType(type);
    } catch (error) {
      console.error(error);

      window.alert(
        "Settings error\n\nBodolvo Scanner could not save this setting.",
      );
    }
  }

  async function handleAppLockChange(
    enabled: boolean,
  ) {
    if (changingAppLock) {
      return;
    }

    try {
      setChangingAppLock(true);

      if (!enabled) {
        const confirmed = window.confirm(
          "Turn off App Lock?\n\nBodolvo Scanner will no longer require authentication when it is opened.",
        );

        if (!confirmed) {
          return;
        }

        await saveAppLockEnabled(false);
        setAppLockEnabled(false);

        return;
      }

      const confirmed = window.confirm(
        "Enable App Lock?\n\nBodolvo Scanner will require authentication when it is opened.",
      );

      if (!confirmed) {
        return;
      }

      await saveAppLockEnabled(true);
      setAppLockEnabled(true);

      window.alert(
        "App Lock enabled\n\nBodolvo Scanner will require authentication when it is opened.",
      );
    } catch (error) {
      console.error(
        "App Lock error:",
        error,
      );

      window.alert(
        "App Lock error\n\nBodolvo Scanner could not change the App Lock setting.",
      );
    } finally {
      setChangingAppLock(false);
    }
  }

  return (
    <>
      <main className="safeArea">
        <div className="content">
          <div className="topBar">
            <button
              type="button"
              className="backButton"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <span className="webBack">
                ‹
              </span>
            </button>

            <div className="titleContainer">
              <span className="eyebrow">
                BODOLVO SCANNER
              </span>

              <h1 className="title">
                Settings
              </h1>
            </div>

            <div className="topBarSpacer" />
          </div>

          <section className="section">
            <p className="sectionLabel">
              GENERATOR
            </p>

            <div className="card">
              <div className="cardHeader">
                <div className="iconBox">
                  <span className="webBlueIcon">
                    ▦
                  </span>
                </div>

                <div className="cardHeaderText">
                  <h2 className="cardTitle">
                    Default generator
                  </h2>

                  <p className="cardDescription">
                    Choose which generator appears when
                    Bodolvo Scanner opens.
                  </p>
                </div>
              </div>

              <div className="options">
                <OptionButton
                  label="QR Code"
                  description="Open directly to QR generation"
                  iconType="qr"
                  selected={
                    defaultType === "qr"
                  }
                  onPress={() =>
                    handleTypeChange("qr")
                  }
                />

                <OptionButton
                  label="Barcode"
                  description="Open directly to Code 128"
                  iconType="barcode"
                  selected={
                    defaultType === "barcode"
                  }
                  onPress={() =>
                    handleTypeChange(
                      "barcode",
                    )
                  }
                />
              </div>
            </div>
          </section>

          <section className="section">
            <p className="sectionLabel">
              PRIVACY & SECURITY
            </p>

            <div className="card">
              <div className="securityRow">
                <div className="lockIconBox">
                  <span
                    className={`webLockIcon ${
                      appLockEnabled
                        ? "webLockIconEnabled"
                        : ""
                    }`}
                  >
                    {appLockEnabled
                      ? "●"
                      : "○"}
                  </span>
                </div>

                <div className="securityText">
                  <h2 className="cardTitle">
                    App Lock
                  </h2>

                  <p className="cardDescription">
                    Require secure
                    authentication before opening
                    Bodolvo Scanner.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={
                    appLockEnabled
                  }
                  aria-label="App Lock"
                  disabled={
                    changingAppLock
                  }
                  className={`switch ${
                    appLockEnabled
                      ? "switchEnabled"
                      : ""
                  }`}
                  onClick={() =>
                    handleAppLockChange(
                      !appLockEnabled,
                    )
                  }
                >
                  <span
                    className={`switchThumb ${
                      appLockEnabled
                        ? "switchThumbEnabled"
                        : ""
                    }`}
                  />
                </button>
              </div>

              <div className="securityNotice">
                <span className="webShield">
                  ✓
                </span>

                <p className="securityNoticeText">
                  Bodolvo never sees or stores your
                  device password, PIN, fingerprint,
                  Touch ID, Face ID, or other secure
                  authentication information.
                  Authentication is handled by your
                  device and browser.
                </p>
              </div>

              <div className="defaultNotice">
                <p className="defaultNoticeText">
                  App Lock is off by default. You
                  can turn it on whenever you want.
                </p>
              </div>
            </div>
          </section>

          <section className="section">
            <p className="sectionLabel">
              INFORMATION
            </p>

            <button
              type="button"
              className="navigationCard"
              onClick={() =>
                router.push(
                  "/apps/qr-barcode/about",
                )
              }
            >
              <div className="iconBox">
                <span className="webInfo">
                  i
                </span>
              </div>

              <div className="navigationText">
                <h2 className="cardTitle">
                  About Bodolvo Scanner
                </h2>

                <p className="cardDescription">
                  Version, privacy, features, and
                  app information
                </p>
              </div>

              <span className="webForward">
                ›
              </span>
            </button>
          </section>

          <p className="footer">
            Preferences are stored privately on
            your device.
          </p>
        </div>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .safeArea {
          min-height: 100dvh;
          background: #ffffff;
          color: #171717;
          overflow-y: auto;
        }

        .content {
          width: 100%;
          max-width: 640px;
          margin: 0 auto;
          padding: 20px 20px 36px;
        }

        .topBar {
          display: flex;
          align-items: center;
          margin-bottom: 32px;
        }

        button {
          font-family: inherit;
        }

        .backButton {
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          border: 1px solid #d9d9d9;
          border-radius: 15px;
          cursor: pointer;
        }

        .backButton:active,
        .navigationCard:active,
        .option:active {
          opacity: 0.72;
          transform: scale(0.98);
        }

        .titleContainer {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .eyebrow {
          color: #171717;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.6px;
        }

        .title {
          color: #171717;
          font-size: 25px;
          font-weight: 900;
          margin: 3px 0 0;
        }

        .topBarSpacer {
          width: 46px;
        }

        .section {
          margin-bottom: 28px;
        }

        .sectionLabel {
          color: #64748b;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.3px;
          margin: 0 0 11px;
        }

        .card {
          background: #ffffff;
          border: 1px solid #d9d9d9;
          border-radius: 22px;
          padding: 16px;
        }

        .cardHeader {
          display: flex;
          align-items: center;
        }

        .cardHeaderText {
          flex: 1;
          min-width: 0;
        }

        .iconBox,
        .lockIconBox {
          width: 46px;
          height: 46px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #101c31;
          border-radius: 15px;
          margin-right: 12px;
        }

        .cardTitle {
          color: #f8fafc;
          font-size: 16px;
          font-weight: 800;
          margin: 0;
        }

        .cardDescription {
          color: #7c8798;
          font-size: 12px;
          line-height: 18px;
          margin: 4px 0 0;
        }

        .options {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 18px;
        }

        .securityRow {
          display: flex;
          align-items: center;
        }

        .securityText {
          flex: 1;
          min-width: 0;
          padding-right: 10px;
        }

        .switch {
          width: 50px;
          height: 30px;
          flex-shrink: 0;
          position: relative;
          padding: 0;
          background: #d9d9d9;
          border: 0;
          border-radius: 999px;
          cursor: pointer;
          transition:
            background 160ms ease,
            opacity 160ms ease;
        }

        .switchEnabled {
          background: #171717;
        }

        .switch:disabled {
          opacity: 0.5;
          cursor: default;
        }

        .switchThumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 24px;
          height: 24px;
          background: #ffffff;
          border-radius: 999px;
          transition: transform 160ms ease;
        }

        .switchThumbEnabled {
          transform: translateX(20px);
        }

        .securityNotice {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          background: #0c1017;
          border: 1px solid #d9d9d9;
          border-radius: 16px;
          padding: 13px;
          margin-top: 16px;
        }

        .securityNoticeText {
          flex: 1;
          color: #7c8798;
          font-size: 11px;
          line-height: 17px;
          margin: 0;
        }

        .defaultNotice {
          background: #101c31;
          border-radius: 14px;
          padding: 10px 12px;
          margin-top: 10px;
        }

        .defaultNoticeText {
          color: #93c5fd;
          font-size: 11px;
          line-height: 16px;
          text-align: center;
          margin: 0;
        }

        .navigationCard {
          width: 100%;
          min-height: 76px;
          display: flex;
          align-items: center;
          text-align: left;
          background: #ffffff;
          border: 1px solid #d9d9d9;
          border-radius: 20px;
          padding: 14px;
          cursor: pointer;
        }

        .navigationText {
          flex: 1;
          min-width: 0;
        }

        .footer {
          color: #555555;
          font-size: 12px;
          text-align: center;
          margin: 8px 0 0;
        }

        .webBack {
          color: #171717;
          font-size: 34px;
          line-height: 34px;
        }

        .webBlueIcon {
          color: #171717;
          font-size: 22px;
          font-weight: 900;
        }

        .webLockIcon {
          color: #171717;
          font-size: 24px;
        }

        .webLockIconEnabled {
          color: #34d399;
        }

        .webShield {
          color: #22d3ee;
          font-size: 18px;
          font-weight: 900;
        }

        .webInfo {
          color: #22d3ee;
          font-size: 20px;
          font-weight: 900;
        }

        .webForward {
          color: #64748b;
          font-size: 28px;
          line-height: 28px;
        }

        @media (max-width: 430px) {
          .content {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
      `}</style>
    </>
  );
}

type OptionButtonProps = {
  label: string;
  description: string;
  iconType: "qr" | "barcode";
  selected: boolean;
  onPress: () => void;
};

function OptionButton({
  label,
  description,
  iconType,
  selected,
  onPress,
}: OptionButtonProps) {
  return (
    <>
      <button
        type="button"
        className={`option ${
          selected
            ? "selectedOption"
            : ""
        }`}
        onClick={onPress}
      >
        <div
          className={`optionIcon ${
            selected
              ? "selectedOptionIcon"
              : ""
          }`}
        >
          <span
            className={`webOptionIcon ${
              selected
                ? "webOptionIconSelected"
                : ""
            }`}
          >
            {iconType === "qr"
              ? "⌗"
              : "▥"}
          </span>
        </div>

        <div className="optionText">
          <p
            className={`optionLabel ${
              selected
                ? "selectedOptionLabel"
                : ""
            }`}
          >
            {label}
          </p>

          <p className="optionDescription">
            {description}
          </p>
        </div>

        <span
          className={`webRadio ${
            selected
              ? "webRadioSelected"
              : ""
          }`}
        >
          {selected ? "●" : "○"}
        </span>
      </button>

      <style jsx>{`
        .option {
          width: 100%;
          min-height: 72px;
          display: flex;
          align-items: center;
          background: #0c1017;
          border: 1px solid #d9d9d9;
          border-radius: 17px;
          padding: 11px 12px;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
        }

        .option:active {
          opacity: 0.72;
          transform: scale(0.98);
        }

        .selectedOption {
          background: #101c31;
          border-color: #171717;
        }

        .optionIcon {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #151a23;
          border-radius: 13px;
          margin-right: 11px;
        }

        .selectedOptionIcon {
          background: #171717;
        }

        .optionText {
          flex: 1;
          min-width: 0;
        }

        .optionLabel {
          color: #cbd5e1;
          font-size: 14px;
          font-weight: 800;
          margin: 0;
        }

        .selectedOptionLabel {
          color: #171717;
        }

        .optionDescription {
          color: #6f798a;
          font-size: 11px;
          margin: 3px 0 0;
        }

        .webOptionIcon {
          color: #94a3b8;
          font-size: 21px;
          font-weight: 900;
        }

        .webOptionIconSelected {
          color: #171717;
        }

        .webRadio {
          color: #475569;
          font-size: 23px;
          flex-shrink: 0;
          margin-left: 8px;
        }

        .webRadioSelected {
          color: #171717;
        }
      `}</style>
    </>
  );
}