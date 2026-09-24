// app/apps/qr-barcode/components/AppLockGate.tsx

"use client";

import type { PropsWithChildren } from "react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { loadAppLockEnabled } from "../utils/settingsStorage";

type LockState =
  | "checking"
  | "unlocked"
  | "locked";

const BACKGROUND_LOCK_DELAY_MS = 1500;

export default function AppLockGate({
  children,
}: PropsWithChildren) {
  const [lockState, setLockState] =
    useState<LockState>("checking");

  const authenticatingRef = useRef(false);
  const mountedRef = useRef(true);

  const backgroundedAtRef =
    useRef<number | null>(null);

  const appLockEnabledRef =
    useRef(false);

  const authenticate = useCallback(async () => {
    if (authenticatingRef.current) {
      return;
    }

    try {
      authenticatingRef.current = true;

      const confirmed = window.confirm(
        "Unlock Bodolvo Scanner?\n\nConfirm to continue.",
      );

      if (!mountedRef.current) {
        return;
      }

      if (confirmed) {
        setLockState("unlocked");
      } else {
        setLockState("locked");
      }
    } catch (error) {
      console.error(
        "App Lock authentication failed:",
        error,
      );

      if (mountedRef.current) {
        setLockState("locked");
      }
    } finally {
      authenticatingRef.current = false;
      backgroundedAtRef.current = null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    async function initializeLock() {
      try {
        const enabled =
          await loadAppLockEnabled();

        appLockEnabledRef.current =
          enabled;

        if (!mountedRef.current) {
          return;
        }

        if (!enabled) {
          setLockState("unlocked");
          return;
        }

        setLockState("locked");

        await authenticate();
      } catch (error) {
        console.error(
          "Failed to initialize App Lock:",
          error,
        );

        if (mountedRef.current) {
          setLockState("unlocked");
        }
      }
    }

    initializeLock();

    return () => {
      mountedRef.current = false;
    };
  }, [authenticate]);

  useEffect(() => {
    function handleVisibilityChange() {
      /*
       * Ignore visibility changes caused while
       * the browser confirmation UI itself is
       * active.
       */
      if (authenticatingRef.current) {
        return;
      }

      /*
       * Remember when Bodolvo actually leaves
       * the foreground.
       */
      if (document.hidden) {
        backgroundedAtRef.current =
          Date.now();

        return;
      }

      /*
       * When returning to the foreground, only
       * lock if App Lock is enabled and Bodolvo
       * was genuinely away long enough.
       */
      const backgroundedAt =
        backgroundedAtRef.current;

      backgroundedAtRef.current = null;

      if (!appLockEnabledRef.current) {
        return;
      }

      if (!backgroundedAt) {
        return;
      }

      const timeAway =
        Date.now() - backgroundedAt;

      if (
        timeAway <
        BACKGROUND_LOCK_DELAY_MS
      ) {
        return;
      }

      setLockState("locked");
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, []);

  /*
   * Re-check the saved App Lock setting whenever
   * the user manually presses Unlock.
   *
   * This also prevents a stale in-memory value
   * after changing the setting in Settings.
   */
  const handleUnlock = useCallback(
    async () => {
      try {
        const enabled =
          await loadAppLockEnabled();

        appLockEnabledRef.current =
          enabled;

        if (!enabled) {
          setLockState("unlocked");
          return;
        }

        await authenticate();
      } catch (error) {
        console.error(
          "Failed to unlock app:",
          error,
        );

        setLockState("locked");
      }
    },
    [authenticate],
  );

  /*
   * Keep our in-memory App Lock value synced
   * whenever the browser returns to the
   * foreground.
   *
   * This matters after turning App Lock on/off
   * from the Settings screen.
   */
  useEffect(() => {
    async function refreshAppLock() {
      if (document.hidden) {
        return;
      }

      if (authenticatingRef.current) {
        return;
      }

      try {
        const enabled =
          await loadAppLockEnabled();

        appLockEnabledRef.current =
          enabled;
      } catch (error) {
        console.error(
          "Failed to refresh App Lock setting:",
          error,
        );
      }
    }

    function handleVisibilityChange() {
      if (!document.hidden) {
        refreshAppLock();
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    window.addEventListener(
      "focus",
      refreshAppLock,
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );

      window.removeEventListener(
        "focus",
        refreshAppLock,
      );
    };
  }, []);

  if (lockState === "checking") {
    return (
      <>
        <main className="screen">
          <div
            className="spinner"
            aria-label="Loading"
          />

          <p className="loadingText">
            Opening Bodolvo Scanner...
          </p>
        </main>

        <style jsx>{`
          .screen {
            min-height: 100dvh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #ffffff;
            padding: 0 22px;
          }

          .spinner {
            width: 36px;
            height: 36px;
            border: 4px solid
              rgba(59, 130, 246, 0.2);
            border-top-color: #171717;
            border-radius: 999px;
            animation: spin 0.8s linear
              infinite;
          }

          .loadingText {
            color: #64748b;
            font-size: 13px;
            margin: 14px 0 0;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </>
    );
  }

  if (lockState === "locked") {
    return (
      <>
        <main className="screen">
          <div className="lockCard">
            <div className="lockIcon">
              <span className="lockIconText">
                ●
              </span>
            </div>

            <p className="brand">
              BODOLVO SCANNER
            </p>

            <h1 className="title">
              App Locked
            </h1>

            <p className="description">
              Confirm your access to continue.
            </p>

            <button
              type="button"
              className="unlockButton"
              onClick={handleUnlock}
            >
              Unlock
            </button>

            <p className="privacyText">
              Your generated content, history,
              favorites, and settings remain
              stored privately on your device.
            </p>
          </div>
        </main>

        <style jsx>{`
          * {
            box-sizing: border-box;
          }

          .screen {
            min-height: 100dvh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ffffff;
            padding: 0 22px;
          }

          .lockCard {
            width: 100%;
            max-width: 420px;
            display: flex;
            flex-direction: column;
            align-items: center;
            background: #ffffff;
            border: 1px solid #d9d9d9;
            border-radius: 26px;
            padding: 30px 24px;
          }

          .lockIcon {
            width: 76px;
            height: 76px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #101c31;
            border: 1px solid #333333;
            border-radius: 24px;
          }

          .lockIconText {
            color: #171717;
            font-size: 34px;
            line-height: 38px;
          }

          .brand {
            color: #171717;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 1.8px;
            margin: 20px 0 0;
          }

          .title {
            color: #171717;
            font-size: 26px;
            font-weight: 900;
            margin: 5px 0 0;
          }

          .description {
            color: #555555;
            font-size: 13px;
            line-height: 20px;
            text-align: center;
            margin: 8px 0 0;
          }

          .unlockButton {
            width: 100%;
            min-height: 54px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #171717;
            border: 0;
            border-radius: 16px;
            margin-top: 24px;
            color: #171717;
            font-size: 16px;
            font-weight: 900;
            font-family: inherit;
            cursor: pointer;
          }

          .unlockButton:active {
            opacity: 0.72;
            transform: scale(0.98);
          }

          .privacyText {
            color: #555555;
            font-size: 11px;
            line-height: 17px;
            text-align: center;
            margin: 16px 0 0;
          }
        `}</style>
      </>
    );
  }

  return <>{children}</>;
}