"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};

type UseLinkHubHistoryOptions<T> = {
  initialState: T;
  storageKey: string;
  maxHistory?: number;
  autosaveDelay?: number;
};

type UseLinkHubHistoryReturn<T> = {
  state: T;

  setState: Dispatch<SetStateAction<T>>;

  undo: () => void;

  redo: () => void;

  reset: (nextState?: T) => void;

  canUndo: boolean;

  canRedo: boolean;

  saveNow: () => void;

  clearSavedState: () => void;

  hasLoaded: boolean;

  saveStatus:
    | "loading"
    | "saved"
    | "saving"
    | "unsaved";
};

export default function useLinkHubHistory<T>({
  initialState,
  storageKey,
  maxHistory = 50,
  autosaveDelay = 700,
}: UseLinkHubHistoryOptions<T>): UseLinkHubHistoryReturn<T> {
  const initialStateRef = useRef(initialState);

  const [history, setHistory] =
    useState<HistoryState<T>>({
      past: [],
      present: initialState,
      future: [],
    });

  const [hasLoaded, setHasLoaded] =
    useState(false);

  const [saveStatus, setSaveStatus] =
    useState<
      "loading" | "saved" | "saving" | "unsaved"
    >("loading");

  const skipHistoryRef = useRef(false);

  const lastSavedRef = useRef<string>("");

  const autosaveTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  useEffect(() => {
    try {
      const saved =
        window.localStorage.getItem(storageKey);

      if (saved) {
        const parsed = JSON.parse(saved) as T;

        setHistory({
          past: [],
          present: parsed,
          future: [],
        });

        lastSavedRef.current =
          JSON.stringify(parsed);
      } else {
        lastSavedRef.current =
          JSON.stringify(
            initialStateRef.current
          );
      }
    } catch (error) {
      console.error(
        "Could not load Link Hub draft:",
        error
      );
    } finally {
      setHasLoaded(true);
      setSaveStatus("saved");
    }
  }, [storageKey]);

  const saveNow = useCallback(() => {
    if (!hasLoaded) return;

    try {
      setSaveStatus("saving");

      const serialized =
        JSON.stringify(history.present);

      window.localStorage.setItem(
        storageKey,
        serialized
      );

      lastSavedRef.current = serialized;

      setSaveStatus("saved");
    } catch (error) {
      console.error(
        "Could not save Link Hub draft:",
        error
      );

      setSaveStatus("unsaved");
    }
  }, [
    hasLoaded,
    history.present,
    storageKey,
  ]);

  useEffect(() => {
    if (!hasLoaded) return;

    const serialized =
      JSON.stringify(history.present);

    if (
      serialized === lastSavedRef.current
    ) {
      setSaveStatus("saved");
      return;
    }

    setSaveStatus("unsaved");

    if (autosaveTimerRef.current) {
      clearTimeout(
        autosaveTimerRef.current
      );
    }

    autosaveTimerRef.current =
      setTimeout(() => {
        try {
          setSaveStatus("saving");

          window.localStorage.setItem(
            storageKey,
            serialized
          );

          lastSavedRef.current =
            serialized;

          setSaveStatus("saved");
        } catch (error) {
          console.error(
            "Could not autosave Link Hub draft:",
            error
          );

          setSaveStatus("unsaved");
        }
      }, autosaveDelay);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(
          autosaveTimerRef.current
        );
      }
    };
  }, [
    autosaveDelay,
    hasLoaded,
    history.present,
    storageKey,
  ]);

  const setState: Dispatch<
    SetStateAction<T>
  > = useCallback(
    (action) => {
      setHistory((current) => {
        const nextPresent =
          typeof action === "function"
            ? (
                action as (
                  previous: T
                ) => T
              )(current.present)
            : action;

        if (
          Object.is(
            current.present,
            nextPresent
          )
        ) {
          return current;
        }

        if (skipHistoryRef.current) {
          skipHistoryRef.current =
            false;

          return {
            ...current,
            present: nextPresent,
          };
        }

        const nextPast = [
          ...current.past,
          current.present,
        ];

        if (
          nextPast.length >
          maxHistory
        ) {
          nextPast.splice(
            0,
            nextPast.length -
              maxHistory
          );
        }

        return {
          past: nextPast,
          present: nextPresent,
          future: [],
        };
      });
    },
    [maxHistory]
  );

  const undo = useCallback(() => {
    setHistory((current) => {
      if (
        current.past.length === 0
      ) {
        return current;
      }

      const previous =
        current.past[
          current.past.length - 1
        ];

      const remainingPast =
        current.past.slice(0, -1);

      return {
        past: remainingPast,
        present: previous,
        future: [
          current.present,
          ...current.future,
        ],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((current) => {
      if (
        current.future.length === 0
      ) {
        return current;
      }

      const next =
        current.future[0];

      const remainingFuture =
        current.future.slice(1);

      return {
        past: [
          ...current.past,
          current.present,
        ],
        present: next,
        future: remainingFuture,
      };
    });
  }, []);

  const reset = useCallback(
    (nextState?: T) => {
      const target =
        nextState ??
        initialStateRef.current;

      setHistory({
        past: [],
        present: target,
        future: [],
      });

      setSaveStatus("unsaved");
    },
    []
  );

  const clearSavedState =
    useCallback(() => {
      try {
        window.localStorage.removeItem(
          storageKey
        );

        lastSavedRef.current = "";

        setSaveStatus("unsaved");
      } catch (error) {
        console.error(
          "Could not clear Link Hub draft:",
          error
        );
      }
    }, [storageKey]);

  return {
    state: history.present,

    setState,

    undo,

    redo,

    reset,

    canUndo:
      history.past.length > 0,

    canRedo:
      history.future.length > 0,

    saveNow,

    clearSavedState,

    hasLoaded,

    saveStatus,
  };
}