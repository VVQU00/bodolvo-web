// app/apps/qr-barcode/scan-result/page.tsx

"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useMemo } from "react";

type ResultKind =
  | "url"
  | "email"
  | "phone"
  | "wifi"
  | "vcard"
  | "text";

type AppIconName =
  | "back"
  | "check"
  | "globe"
  | "mail"
  | "phone"
  | "wifi"
  | "person"
  | "text"
  | "open"
  | "copy"
  | "shield"
  | "key"
  | "hidden"
  | "work"
  | "location"
  | "edit"
  | "scan";

type WifiInfo = {
  ssid: string;
  password: string;
  security: string;
  hidden: boolean;
};

type VCardInfo = {
  name: string;
  company: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  address: string;
};

const WEB_ICONS: Record<AppIconName, string> = {
  back: "‹",
  check: "✓",
  globe: "◎",
  mail: "✉",
  phone: "☎",
  wifi: "⌁",
  person: "●",
  text: "≡",
  open: "↗",
  copy: "⧉",
  shield: "✓",
  key: "◆",
  hidden: "◌",
  work: "▣",
  location: "●",
  edit: "✎",
  scan: "⌗",
};

type AppIconProps = {
  name: AppIconName;
  size: number;
  color: string;
};

function AppIcon({
  name,
  size,
  color,
}: AppIconProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        color,
        fontSize: size,
        fontWeight: 900,
        lineHeight: `${size + 3}px`,
      }}
    >
      {WEB_ICONS[name]}
    </span>
  );
}

function detectResultKind(
  value: string,
): ResultKind {
  const trimmed = value.trim();

  if (/^BEGIN:VCARD/i.test(trimmed)) {
    return "vcard";
  }

  if (
    /^https?:\/\//i.test(trimmed) ||
    /^www\./i.test(trimmed)
  ) {
    return "url";
  }

  if (
    /^mailto:/i.test(trimmed) ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      trimmed,
    )
  ) {
    return "email";
  }

  if (
    /^tel:/i.test(trimmed) ||
    /^\+?[\d\s().-]{7,}$/.test(trimmed)
  ) {
    return "phone";
  }

  if (/^WIFI:/i.test(trimmed)) {
    return "wifi";
  }

  return "text";
}

function getResultInfo(kind: ResultKind) {
  switch (kind) {
    case "url":
      return {
        label: "Website",
        icon: "globe" as AppIconName,
        color: "#60A5FA",
        actionLabel: "Open Link",
        actionIcon: "open" as AppIconName,
      };

    case "email":
      return {
        label: "Email Address",
        icon: "mail" as AppIconName,
        color: "#A78BFA",
        actionLabel: "Send Email",
        actionIcon: "mail" as AppIconName,
      };

    case "phone":
      return {
        label: "Phone Number",
        icon: "phone" as AppIconName,
        color: "#34D399",
        actionLabel: "Call Number",
        actionIcon: "phone" as AppIconName,
      };

    case "wifi":
      return {
        label: "Wi-Fi Network",
        icon: "wifi" as AppIconName,
        color: "#22D3EE",
        actionLabel: "Copy Wi-Fi Info",
        actionIcon: "copy" as AppIconName,
      };

    case "vcard":
      return {
        label: "Contact Card",
        icon: "person" as AppIconName,
        color: "#A78BFA",
        actionLabel: "Copy Contact",
        actionIcon: "copy" as AppIconName,
      };

    default:
      return {
        label: "Text",
        icon: "text" as AppIconName,
        color: "#94A3B8",
        actionLabel: "Copy Text",
        actionIcon: "copy" as AppIconName,
      };
  }
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function normalizeEmail(value: string) {
  const trimmed = value.trim();

  if (/^mailto:/i.test(trimmed)) {
    return trimmed;
  }

  return `mailto:${trimmed}`;
}

function normalizePhone(value: string) {
  const trimmed = value.trim();

  if (/^tel:/i.test(trimmed)) {
    return trimmed;
  }

  return `tel:${trimmed.replace(
    /[^\d+]/g,
    "",
  )}`;
}

function unescapeWifiValue(value: string) {
  return value
    .replace(/\\;/g, ";")
    .replace(/\\:/g, ":")
    .replace(/\\,/g, ",")
    .replace(/\\\\/g, "\\");
}

function parseWifi(
  value: string,
): WifiInfo | null {
  const trimmed = value.trim();

  if (!/^WIFI:/i.test(trimmed)) {
    return null;
  }

  const body = trimmed.replace(
    /^WIFI:/i,
    "",
  );

  const parts: string[] = [];
  let current = "";
  let escaped = false;

  for (const char of body) {
    if (escaped) {
      current += `\\${char}`;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === ";") {
      parts.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  if (current) {
    parts.push(current);
  }

  const fields: Record<string, string> = {};

  for (const part of parts) {
    const separatorIndex =
      part.indexOf(":");

    if (separatorIndex === -1) {
      continue;
    }

    const key = part
      .slice(0, separatorIndex)
      .trim()
      .toUpperCase();

    const rawValue = part.slice(
      separatorIndex + 1,
    );

    fields[key] =
      unescapeWifiValue(rawValue);
  }

  const ssid = fields.S ?? "";
  const password = fields.P ?? "";
  const security = fields.T ?? "Open";

  const hiddenValue = (
    fields.H ?? ""
  ).toLowerCase();

  const hidden =
    hiddenValue === "true" ||
    hiddenValue === "1" ||
    hiddenValue === "yes";

  return {
    ssid,
    password,
    security,
    hidden,
  };
}

function unescapeVCardValue(
  value: string,
) {
  return value
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .trim();
}

function getVCardLineValue(
  lines: string[],
  key: string,
) {
  const match = lines.find((line) => {
    const upper = line.toUpperCase();

    return (
      upper.startsWith(`${key}:`) ||
      upper.startsWith(`${key};`)
    );
  });

  if (!match) {
    return "";
  }

  const colonIndex = match.indexOf(":");

  if (colonIndex === -1) {
    return "";
  }

  return unescapeVCardValue(
    match.slice(colonIndex + 1),
  );
}

function parseVCard(
  value: string,
): VCardInfo | null {
  const trimmed = value.trim();

  if (!/^BEGIN:VCARD/i.test(trimmed)) {
    return null;
  }

  const lines = trimmed
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  let name =
    getVCardLineValue(lines, "FN");

  if (!name) {
    const rawName =
      getVCardLineValue(lines, "N");

    if (rawName) {
      const parts = rawName.split(";");

      const last = parts[0] ?? "";
      const first = parts[1] ?? "";
      const middle = parts[2] ?? "";

      name = [
        first,
        middle,
        last,
      ]
        .filter(Boolean)
        .join(" ");
    }
  }

  const company =
    getVCardLineValue(lines, "ORG");

  const title =
    getVCardLineValue(lines, "TITLE");

  const phone =
    getVCardLineValue(lines, "TEL");

  const email =
    getVCardLineValue(lines, "EMAIL");

  const website =
    getVCardLineValue(lines, "URL");

  const rawAddress =
    getVCardLineValue(lines, "ADR");

  const address = rawAddress
    ? rawAddress
        .split(";")
        .filter(Boolean)
        .join(", ")
    : "";

  return {
    name,
    company,
    title,
    phone,
    email,
    website,
    address,
  };
}

export default function ScanResultScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const value =
    searchParams.get("value") ?? "";

  const scanType =
    searchParams.get("type") ?? "";

  const kind = useMemo(
    () => detectResultKind(value),
    [value],
  );

  const info = getResultInfo(kind);

  const wifiInfo = useMemo(
    () =>
      kind === "wifi"
        ? parseWifi(value)
        : null,
    [kind, value],
  );

  const vcardInfo = useMemo(
    () =>
      kind === "vcard"
        ? parseVCard(value)
        : null,
    [kind, value],
  );

  async function copyToClipboard(
    text: string,
  ) {
    if (!navigator.clipboard) {
      throw new Error(
        "Clipboard API unavailable.",
      );
    }

    await navigator.clipboard.writeText(
      text,
    );
  }

  async function handlePrimaryAction() {
    const trimmed = value.trim();

    try {
      if (kind === "url") {
        const url = normalizeUrl(trimmed);

        window.open(
          url,
          "_blank",
          "noopener,noreferrer",
        );

        return;
      }

      if (kind === "email") {
        window.location.href =
          normalizeEmail(trimmed);

        return;
      }

      if (kind === "phone") {
        window.location.href =
          normalizePhone(trimmed);

        return;
      }

      if (
        kind === "wifi" &&
        wifiInfo
      ) {
        const text = [
          `Network: ${
            wifiInfo.ssid || "Unknown"
          }`,
          `Security: ${
            wifiInfo.security ||
            "Unknown"
          }`,
          `Password: ${
            wifiInfo.password || "None"
          }`,
          `Hidden: ${
            wifiInfo.hidden
              ? "Yes"
              : "No"
          }`,
        ].join("\n");

        await copyToClipboard(text);

        window.alert(
          "Wi-Fi info copied\n\nNetwork details were copied to your clipboard.",
        );

        return;
      }

      if (
        kind === "vcard" &&
        vcardInfo
      ) {
        const text = [
          vcardInfo.name
            ? `Name: ${vcardInfo.name}`
            : "",
          vcardInfo.company
            ? `Company: ${vcardInfo.company}`
            : "",
          vcardInfo.title
            ? `Title: ${vcardInfo.title}`
            : "",
          vcardInfo.phone
            ? `Phone: ${vcardInfo.phone}`
            : "",
          vcardInfo.email
            ? `Email: ${vcardInfo.email}`
            : "",
          vcardInfo.website
            ? `Website: ${vcardInfo.website}`
            : "",
          vcardInfo.address
            ? `Address: ${vcardInfo.address}`
            : "",
        ]
          .filter(Boolean)
          .join("\n");

        await copyToClipboard(text);

        window.alert(
          "Contact copied\n\nContact details were copied to your clipboard.",
        );

        return;
      }

      await copyToClipboard(trimmed);

      window.alert(
        "Copied\n\nScanned text copied to your clipboard.",
      );
    } catch (error) {
      console.error(
        "Result action failed:",
        error,
      );

      window.alert(
        "Action failed\n\nBodolvo Scanner could not complete this action.",
      );
    }
  }

  async function handleCopy() {
    try {
      await copyToClipboard(value);

      window.alert(
        "Copied\n\nScanned content copied to your clipboard.",
      );
    } catch (error) {
      console.error(
        "Copy failed:",
        error,
      );

      window.alert(
        "Copy failed\n\nBodolvo Scanner could not copy this content.",
      );
    }
  }

  async function handleCopyWifiPassword() {
    if (!wifiInfo) {
      return;
    }

    if (!wifiInfo.password) {
      window.alert(
        "No password\n\nThis Wi-Fi code does not contain a password.",
      );

      return;
    }

    try {
      await copyToClipboard(
        wifiInfo.password,
      );

      window.alert(
        "Password copied\n\nThe Wi-Fi password was copied to your clipboard.",
      );
    } catch (error) {
      console.error(
        "Password copy failed:",
        error,
      );

      window.alert(
        "Copy failed\n\nBodolvo Scanner could not copy the Wi-Fi password.",
      );
    }
  }

  function handleContactCall() {
    if (!vcardInfo?.phone) {
      return;
    }

    try {
      window.location.href =
        normalizePhone(
          vcardInfo.phone,
        );
    } catch (error) {
      console.error(
        "Call failed:",
        error,
      );

      window.alert(
        "Unable to call\n\nBodolvo Scanner could not open the phone dialer.",
      );
    }
  }

  function handleContactEmail() {
    if (!vcardInfo?.email) {
      return;
    }

    try {
      window.location.href =
        normalizeEmail(
          vcardInfo.email,
        );
    } catch (error) {
      console.error(
        "Email failed:",
        error,
      );

      window.alert(
        "Unable to email\n\nBodolvo Scanner could not open an email app.",
      );
    }
  }

  function handleContactWebsite() {
    if (!vcardInfo?.website) {
      return;
    }

    try {
      window.open(
        normalizeUrl(
          vcardInfo.website,
        ),
        "_blank",
        "noopener,noreferrer",
      );
    } catch (error) {
      console.error(
        "Website failed:",
        error,
      );

      window.alert(
        "Unable to open\n\nBodolvo Scanner could not open this website.",
      );
    }
  }

  function handleUseInGenerator() {
    const params = new URLSearchParams({
      scannedValue: value,
      scannedType: scanType,
    });

    router.replace(
      `/apps/qr-barcode?${params.toString()}`,
    );
  }

  function handleScanAgain() {
    router.replace(
      "/apps/qr-barcode/scanner",
    );
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
              <AppIcon
                name="back"
                size={24}
                color="#FFFFFF"
              />
            </button>

            <div className="titleContainer">
              <span className="eyebrow">
                BODOLVO SCANNER
              </span>

              <h1 className="title">
                Scan Result
              </h1>
            </div>

            <div className="topBarSpacer" />
          </div>

          <div className="successIcon">
            <AppIcon
              name="check"
              size={34}
              color="#FFFFFF"
            />
          </div>

          <h2 className="successTitle">
            Code detected
          </h2>

          <p className="successSubtitle">
            Bodolvo Scanner recognized
            the content below.
          </p>

          <div className="typeCard">
            <div
              className="typeIcon"
              style={{
                borderColor: info.color,
              }}
            >
              <AppIcon
                name={info.icon}
                size={25}
                color={info.color}
              />
            </div>

            <div className="typeText">
              <p className="typeLabel">
                {info.label}
              </p>

              <p className="scanFormat">
                {scanType
                  ? scanType.toUpperCase()
                  : "SCANNED CODE"}
              </p>
            </div>
          </div>

          {kind === "wifi" &&
          wifiInfo ? (
            <div className="detailCard">
              <div className="detailHeader">
                <div className="wifiIconBox">
                  <AppIcon
                    name="wifi"
                    size={25}
                    color="#22D3EE"
                  />
                </div>

                <div className="detailHeaderText">
                  <p className="wifiEyebrow">
                    WI-FI DETAILS
                  </p>

                  <h3 className="detailTitle">
                    {wifiInfo.ssid ||
                      "Unnamed network"}
                  </h3>
                </div>
              </div>

              <DetailRow
                icon="wifi"
                label="Network"
                value={
                  wifiInfo.ssid ||
                  "Unknown"
                }
              />

              <DetailRow
                icon="shield"
                label="Security"
                value={
                  wifiInfo.security ||
                  "Unknown"
                }
              />

              <DetailRow
                icon="key"
                label="Password"
                value={
                  wifiInfo.password
                    ? wifiInfo.password
                    : "No password"
                }
              />

              <DetailRow
                icon="hidden"
                label="Hidden network"
                value={
                  wifiInfo.hidden
                    ? "Yes"
                    : "No"
                }
              />

              {wifiInfo.password ? (
                <button
                  type="button"
                  className="wifiActionButton"
                  onClick={
                    handleCopyWifiPassword
                  }
                >
                  <AppIcon
                    name="key"
                    size={19}
                    color="#FFFFFF"
                  />

                  <span className="actionButtonText">
                    Copy Password
                  </span>
                </button>
              ) : null}
            </div>
          ) : kind === "vcard" &&
            vcardInfo ? (
            <div className="contactCard">
              <div className="detailHeader">
                <div className="contactIconBox">
                  <AppIcon
                    name="person"
                    size={26}
                    color="#C4B5FD"
                  />
                </div>

                <div className="detailHeaderText">
                  <p className="contactEyebrow">
                    CONTACT DETAILS
                  </p>

                  <h3 className="detailTitle">
                    {vcardInfo.name ||
                      "Unnamed contact"}
                  </h3>

                  {vcardInfo.company ? (
                    <p className="contactCompany">
                      {
                        vcardInfo.company
                      }
                    </p>
                  ) : null}
                </div>
              </div>

              {vcardInfo.title ? (
                <DetailRow
                  icon="work"
                  label="Title"
                  value={
                    vcardInfo.title
                  }
                />
              ) : null}

              {vcardInfo.phone ? (
                <DetailRow
                  icon="phone"
                  label="Phone"
                  value={
                    vcardInfo.phone
                  }
                />
              ) : null}

              {vcardInfo.email ? (
                <DetailRow
                  icon="mail"
                  label="Email"
                  value={
                    vcardInfo.email
                  }
                />
              ) : null}

              {vcardInfo.website ? (
                <DetailRow
                  icon="globe"
                  label="Website"
                  value={
                    vcardInfo.website
                  }
                />
              ) : null}

              {vcardInfo.address ? (
                <DetailRow
                  icon="location"
                  label="Address"
                  value={
                    vcardInfo.address
                  }
                />
              ) : null}

              <div className="contactActions">
                {vcardInfo.phone ? (
                  <ContactAction
                    icon="phone"
                    label="Call"
                    onPress={
                      handleContactCall
                    }
                  />
                ) : null}

                {vcardInfo.email ? (
                  <ContactAction
                    icon="mail"
                    label="Email"
                    onPress={
                      handleContactEmail
                    }
                  />
                ) : null}

                {vcardInfo.website ? (
                  <ContactAction
                    icon="globe"
                    label="Website"
                    onPress={
                      handleContactWebsite
                    }
                  />
                ) : null}
              </div>
            </div>
          ) : (
            <div className="valueCard">
              <p className="valueLabel">
                SCANNED CONTENT
              </p>

              <p className="valueText">
                {value ||
                  "No scan data received."}
              </p>
            </div>
          )}

          <button
            type="button"
            className="primaryButton"
            onClick={handlePrimaryAction}
          >
            <AppIcon
              name={info.actionIcon}
              size={21}
              color="#FFFFFF"
            />

            <span className="primaryButtonText">
              {info.actionLabel}
            </span>
          </button>

          <div className="secondaryRow">
            <button
              type="button"
              className="secondaryButton"
              onClick={handleCopy}
            >
              <AppIcon
                name="copy"
                size={20}
                color="#FFFFFF"
              />

              <span className="secondaryButtonText">
                {kind === "wifi" ||
                kind === "vcard"
                  ? "Copy Raw"
                  : "Copy"}
              </span>
            </button>

            <button
              type="button"
              className="secondaryButton"
              onClick={
                handleUseInGenerator
              }
            >
              <AppIcon
                name="edit"
                size={20}
                color="#FFFFFF"
              />

              <span className="secondaryButtonText">
                Use Code
              </span>
            </button>
          </div>

          <button
            type="button"
            className="scanAgainButton"
            onClick={handleScanAgain}
          >
            <AppIcon
              name="scan"
              size={20}
              color="#60A5FA"
            />

            <span className="scanAgainText">
              Scan another code
            </span>
          </button>

          <div className="securityCard">
            <AppIcon
              name="shield"
              size={20}
              color="#34D399"
            />

            <p className="securityText">
              Bodolvo Scanner never opens
              scanned links automatically.
              You choose what happens next.
            </p>
          </div>
        </div>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .safeArea {
          min-height: 100dvh;
          background: #07090d;
          overflow-y: auto;
        }

        .content {
          width: 100%;
          max-width: 640px;
          margin: 0 auto;
          padding: 20px 20px 40px;
        }

        .topBar {
          display: flex;
          align-items: center;
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
          background: #10141c;
          border: 1px solid #28303d;
          border-radius: 15px;
          cursor: pointer;
        }

        .backButton:active,
        .wifiActionButton:active,
        .contactAction:active,
        .primaryButton:active,
        .secondaryButton:active,
        .scanAgainButton:active {
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
          color: #3b82f6;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.7px;
        }

        .title {
          color: #ffffff;
          font-size: 24px;
          font-weight: 900;
          margin: 3px 0 0;
        }

        .topBarSpacer {
          width: 46px;
        }

        .successIcon {
          width: 72px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 36px auto 0;
          background: #16a34a;
          border-radius: 24px;
        }

        .successTitle {
          color: #ffffff;
          font-size: 25px;
          font-weight: 900;
          text-align: center;
          margin: 18px 0 0;
        }

        .successSubtitle {
          color: #8b95a7;
          font-size: 13px;
          line-height: 20px;
          text-align: center;
          margin: 6px 0 0;
        }

        .typeCard {
          display: flex;
          align-items: center;
          background: #10141c;
          border: 1px solid #28303d;
          border-radius: 20px;
          padding: 15px;
          margin-top: 28px;
        }

        .typeIcon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: #0c1017;
          border: 1px solid;
          border-radius: 16px;
          margin-right: 13px;
        }

        .typeText {
          flex: 1;
          min-width: 0;
        }

        .typeLabel {
          color: #ffffff;
          font-size: 16px;
          font-weight: 800;
          margin: 0;
        }

        .scanFormat {
          color: #64748b;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.2px;
          margin: 4px 0 0;
        }

        .valueCard {
          background: #0c1017;
          border: 1px solid #28303d;
          border-radius: 20px;
          padding: 16px;
          margin-top: 12px;
        }

        .valueLabel {
          color: #64748b;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.2px;
          margin: 0;
        }

        .valueText {
          color: #f8fafc;
          font-size: 15px;
          line-height: 22px;
          overflow-wrap: anywhere;
          white-space: pre-wrap;
          margin: 10px 0 0;
        }

        .detailCard {
          background: #0c1017;
          border: 1px solid #164e63;
          border-radius: 22px;
          padding: 16px;
          margin-top: 12px;
        }

        .contactCard {
          background: #0c1017;
          border: 1px solid #4c1d95;
          border-radius: 22px;
          padding: 16px;
          margin-top: 12px;
        }

        .detailHeader {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }

        .wifiIconBox {
          width: 50px;
          height: 50px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #083344;
          border-radius: 16px;
          margin-right: 12px;
        }

        .contactIconBox {
          width: 50px;
          height: 50px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #2e1065;
          border-radius: 16px;
          margin-right: 12px;
        }

        .detailHeaderText {
          flex: 1;
          min-width: 0;
        }

        .wifiEyebrow {
          color: #22d3ee;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.4px;
          margin: 0;
        }

        .contactEyebrow {
          color: #a78bfa;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.4px;
          margin: 0;
        }

        .detailTitle {
          color: #ffffff;
          font-size: 18px;
          font-weight: 900;
          overflow-wrap: anywhere;
          margin: 3px 0 0;
        }

        .contactCompany {
          color: #a78bfa;
          font-size: 12px;
          font-weight: 700;
          overflow-wrap: anywhere;
          margin: 3px 0 0;
        }

        .wifiActionButton {
          width: 100%;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #0891b2;
          border: 0;
          border-radius: 15px;
          margin-top: 12px;
          cursor: pointer;
        }

        .actionButtonText {
          color: #ffffff;
          font-size: 13px;
          font-weight: 900;
        }

        .contactActions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .primaryButton {
          width: 100%;
          min-height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          background: #2563eb;
          border: 0;
          border-radius: 17px;
          margin-top: 18px;
          cursor: pointer;
        }

        .primaryButtonText {
          color: #ffffff;
          font-size: 15px;
          font-weight: 900;
        }

        .secondaryRow {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .secondaryButton {
          flex: 1;
          min-height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #10141c;
          border: 1px solid #28303d;
          border-radius: 16px;
          cursor: pointer;
        }

        .secondaryButtonText {
          color: #ffffff;
          font-size: 14px;
          font-weight: 800;
        }

        .scanAgainButton {
          width: 100%;
          min-height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #0c1017;
          border: 1px solid #202631;
          border-radius: 16px;
          margin-top: 10px;
          cursor: pointer;
        }

        .scanAgainText {
          color: #60a5fa;
          font-size: 14px;
          font-weight: 800;
        }

        .securityCard {
          display: flex;
          align-items: flex-start;
          background: #07150e;
          border: 1px solid #14532d;
          border-radius: 18px;
          padding: 14px;
          gap: 10px;
          margin-top: 22px;
        }

        .securityText {
          flex: 1;
          color: #a7f3d0;
          font-size: 11px;
          line-height: 17px;
          margin: 0;
        }

        @media (max-width: 430px) {
          .content {
            padding-left: 16px;
            padding-right: 16px;
          }

          .secondaryRow {
            gap: 8px;
          }
        }
      `}</style>
    </>
  );
}

type DetailRowProps = {
  icon: AppIconName;
  label: string;
  value: string;
};

function DetailRow({
  icon,
  label,
  value,
}: DetailRowProps) {
  return (
    <>
      <div className="detailRow">
        <div className="detailRowIcon">
          <AppIcon
            name={icon}
            size={18}
            color="#94A3B8"
          />
        </div>

        <div className="detailRowText">
          <p className="detailRowLabel">
            {label}
          </p>

          <p className="detailRowValue">
            {value}
          </p>
        </div>
      </div>

      <style jsx>{`
        .detailRow {
          min-height: 58px;
          display: flex;
          align-items: center;
          background: #10141c;
          border: 1px solid #28303d;
          border-radius: 16px;
          padding: 10px 12px;
          margin-top: 8px;
        }

        .detailRowIcon {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #151a23;
          border-radius: 11px;
          margin-right: 11px;
        }

        .detailRowText {
          flex: 1;
          min-width: 0;
        }

        .detailRowLabel {
          color: #64748b;
          font-size: 10px;
          font-weight: 800;
          margin: 0;
        }

        .detailRowValue {
          color: #f8fafc;
          font-size: 14px;
          font-weight: 700;
          overflow-wrap: anywhere;
          white-space: pre-wrap;
          margin: 2px 0 0;
        }
      `}</style>
    </>
  );
}

type ContactActionProps = {
  icon: AppIconName;
  label: string;
  onPress: () => void;
};

function ContactAction({
  icon,
  label,
  onPress,
}: ContactActionProps) {
  return (
    <>
      <button
        type="button"
        className="contactAction"
        onClick={onPress}
      >
        <AppIcon
          name={icon}
          size={18}
          color="#C4B5FD"
        />

        <span className="contactActionText">
          {label}
        </span>
      </button>

      <style jsx>{`
        .contactAction {
          flex-grow: 1;
          min-width: 100px;
          min-height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          background: #1e1535;
          border: 1px solid #4c1d95;
          border-radius: 14px;
          padding: 0 12px;
          cursor: pointer;
          font-family: inherit;
        }

        .contactAction:active {
          opacity: 0.72;
          transform: scale(0.98);
        }

        .contactActionText {
          color: #ede9fe;
          font-size: 12px;
          font-weight: 800;
        }
      `}</style>
    </>
  );
}