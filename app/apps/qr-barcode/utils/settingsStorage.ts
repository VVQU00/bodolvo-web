// app/apps/qr-barcode/utils/settingsStorage.ts

export type DefaultCodeType = "qr" | "barcode";

const DEFAULT_CODE_TYPE_KEY = "fbqg_default_code_type";
const APP_LOCK_ENABLED_KEY =
  "bodolvo_scanner_app_lock_enabled";

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export async function loadDefaultCodeType(): Promise<DefaultCodeType> {
  try {
    const storage = getStorage();

    if (!storage) {
      return "qr";
    }

    const storedValue = storage.getItem(
      DEFAULT_CODE_TYPE_KEY,
    );

    return storedValue === "barcode"
      ? "barcode"
      : "qr";
  } catch (error) {
    console.error(
      "Failed to load default code type:",
      error,
    );

    return "qr";
  }
}

export async function saveDefaultCodeType(
  type: DefaultCodeType,
): Promise<void> {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(
    DEFAULT_CODE_TYPE_KEY,
    type,
  );
}

export async function loadAppLockEnabled(): Promise<boolean> {
  try {
    const storage = getStorage();

    if (!storage) {
      return false;
    }

    const storedValue = storage.getItem(
      APP_LOCK_ENABLED_KEY,
    );

    return storedValue === "true";
  } catch (error) {
    console.error(
      "Failed to load app lock setting:",
      error,
    );

    return false;
  }
}

export async function saveAppLockEnabled(
  enabled: boolean,
): Promise<void> {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(
    APP_LOCK_ENABLED_KEY,
    enabled ? "true" : "false",
  );
}