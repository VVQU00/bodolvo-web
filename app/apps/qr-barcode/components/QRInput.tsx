// app/apps/qr-barcode/components/QRInput.tsx

"use client";

import { useEffect, useMemo, useState } from "react";

type QRInputProps = {
  value: string;
  onChangeText: (text: string) => void;
};

type InputMode =
  | "text"
  | "website"
  | "wifi"
  | "contact"
  | "email"
  | "phone";

type WifiSecurity = "WPA" | "WEP" | "nopass";

function escapeWifiValue(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/:/g, "\\:")
    .replace(/,/g, "\\,");
}

function escapeVCardValue(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function normalizeWebsite(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export default function QRInput({
  value,
  onChangeText,
}: QRInputProps) {
  const [mode, setMode] = useState<InputMode>("text");

  const [websiteUrl, setWebsiteUrl] = useState("");

  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");

  const [wifiSecurity, setWifiSecurity] =
    useState<WifiSecurity>("WPA");

  const [wifiHidden, setWifiHidden] = useState(false);

  const [contactName, setContactName] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [contactTitle, setContactTitle] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactWebsite, setContactWebsite] = useState("");
  const [contactAddress, setContactAddress] = useState("");

  const [emailAddress, setEmailAddress] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");

  const generatedPresetValue = useMemo(() => {
    if (mode === "website") {
      return normalizeWebsite(websiteUrl);
    }

    if (mode === "wifi") {
      if (!wifiSsid.trim()) {
        return "";
      }

      return [
        "WIFI:",
        `T:${wifiSecurity};`,
        `S:${escapeWifiValue(wifiSsid.trim())};`,
        wifiSecurity !== "nopass"
          ? `P:${escapeWifiValue(wifiPassword)};`
          : "",
        `H:${wifiHidden ? "true" : "false"};;`,
      ].join("");
    }

    if (mode === "contact") {
      if (!contactName.trim()) {
        return "";
      }

      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${escapeVCardValue(contactName.trim())}`,
        contactCompany.trim()
          ? `ORG:${escapeVCardValue(
              contactCompany.trim(),
            )}`
          : "",
        contactTitle.trim()
          ? `TITLE:${escapeVCardValue(
              contactTitle.trim(),
            )}`
          : "",
        contactPhone.trim()
          ? `TEL:${escapeVCardValue(
              contactPhone.trim(),
            )}`
          : "",
        contactEmail.trim()
          ? `EMAIL:${escapeVCardValue(
              contactEmail.trim(),
            )}`
          : "",
        contactWebsite.trim()
          ? `URL:${escapeVCardValue(
              normalizeWebsite(contactWebsite),
            )}`
          : "",
        contactAddress.trim()
          ? `ADR:;;${escapeVCardValue(
              contactAddress.trim(),
            )};;;;`
          : "",
        "END:VCARD",
      ]
        .filter(Boolean)
        .join("\n");
    }

    if (mode === "email") {
      if (!emailAddress.trim()) {
        return "";
      }

      const parts: string[] = [];

      if (emailSubject.trim()) {
        parts.push(
          `subject=${encodeURIComponent(
            emailSubject.trim(),
          )}`,
        );
      }

      if (emailBody.trim()) {
        parts.push(
          `body=${encodeURIComponent(emailBody.trim())}`,
        );
      }

      const query = parts.join("&");

      return `mailto:${emailAddress.trim()}${
        query ? `?${query}` : ""
      }`;
    }

    if (mode === "phone") {
      if (!phoneNumber.trim()) {
        return "";
      }

      return `tel:${phoneNumber.trim()}`;
    }

    return value;
  }, [
    mode,
    value,
    websiteUrl,
    wifiSsid,
    wifiPassword,
    wifiSecurity,
    wifiHidden,
    contactName,
    contactCompany,
    contactTitle,
    contactPhone,
    contactEmail,
    contactWebsite,
    contactAddress,
    emailAddress,
    emailSubject,
    emailBody,
    phoneNumber,
  ]);

  useEffect(() => {
    if (mode === "text") {
      return;
    }

    onChangeText(generatedPresetValue);
  }, [mode, generatedPresetValue, onChangeText]);

  function handleModeChange(nextMode: InputMode) {
    setMode(nextMode);

    if (nextMode === "text") {
      return;
    }

    onChangeText("");
  }

  return (
    <div className="inputSection">
      <div className="labelRow">
        <div>
          <div className="label">Content</div>

          <div className="subLabel">
            Choose what kind of QR code you want to create
          </div>
        </div>

        <div className="counter">{value.length}/1000</div>
      </div>

      <div
        className="modeScroller"
        onWheel={(event) => {
          const scroller = event.currentTarget;

          if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            scroller.scrollLeft += event.deltaY;
          } else {
            scroller.scrollLeft += event.deltaX;
          }
        }}
      >
        <div className="modeRow">
          <ModeButton
            mode="text"
            label="Text"
            active={mode === "text"}
            onPress={() => handleModeChange("text")}
          />

          <ModeButton
            mode="website"
            label="Website"
            active={mode === "website"}
            onPress={() => handleModeChange("website")}
          />

          <ModeButton
            mode="wifi"
            label="Wi-Fi"
            active={mode === "wifi"}
            onPress={() => handleModeChange("wifi")}
          />

          <ModeButton
            mode="contact"
            label="Contact"
            active={mode === "contact"}
            onPress={() => handleModeChange("contact")}
          />

          <ModeButton
            mode="email"
            label="Email"
            active={mode === "email"}
            onPress={() => handleModeChange("email")}
          />

          <ModeButton
            mode="phone"
            label="Phone"
            active={mode === "phone"}
            onPress={() => handleModeChange("phone")}
          />
        </div>
      </div>

      {mode === "text" ? (
        <div className="inputContainer">
          <div className="inputIcon">
            <span className="webInputIcon">✎</span>
          </div>

          <textarea
            className="input"
            value={value}
            onChange={(event) =>
              onChangeText(event.target.value)
            }
            placeholder="Enter text or product code"
            autoCapitalize="none"
            autoCorrect="off"
            maxLength={1000}
          />

          {value.length > 0 && (
            <button
              type="button"
              className="clearButton"
              onClick={() => onChangeText("")}
            >
              <span className="webClearIcon">×</span>
            </button>
          )}
        </div>
      ) : null}

      {mode === "website" ? (
        <div className="presetCard">
          <Field
            label="Website"
            value={websiteUrl}
            onChangeText={setWebsiteUrl}
            placeholder="bodolvo.online"
            keyboardType="url"
            autoCapitalize="none"
          />

          {websiteUrl.trim() ? (
            <div className="previewNotice">
              <div className="previewNoticeLabel">
                QR CONTENT
              </div>

              <div className="previewNoticeValue">
                {normalizeWebsite(websiteUrl)}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {mode === "wifi" ? (
        <div className="presetCard">
          <Field
            label="Network name"
            value={wifiSsid}
            onChangeText={setWifiSsid}
            placeholder="My Wi-Fi"
            autoCapitalize="none"
          />

          <div className="fieldLabel">Security</div>

          <div className="securityRow">
            {(
              [
                ["WPA", "WPA/WPA2"],
                ["WEP", "WEP"],
                ["nopass", "Open"],
              ] as const
            ).map(([security, label]) => (
              <button
                type="button"
                key={security}
                className={`securityButton ${
                  wifiSecurity === security
                    ? "securityButtonActive"
                    : ""
                }`}
                onClick={() => setWifiSecurity(security)}
              >
                <span
                  className={`securityButtonText ${
                    wifiSecurity === security
                      ? "securityButtonTextActive"
                      : ""
                  }`}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>

          {wifiSecurity !== "nopass" ? (
            <Field
              label="Password"
              value={wifiPassword}
              onChangeText={setWifiPassword}
              placeholder="Wi-Fi password"
              autoCapitalize="none"
              secureTextEntry
            />
          ) : null}

          <button
            type="button"
            className="hiddenRow"
            onClick={() =>
              setWifiHidden((current) => !current)
            }
          >
            <span
              className={`checkbox ${
                wifiHidden ? "checkboxActive" : ""
              }`}
            >
              {wifiHidden ? (
                <span className="checkboxCheck">✓</span>
              ) : null}
            </span>

            <span className="hiddenText">
              <span className="hiddenLabel">
                Hidden network
              </span>

              <span className="hiddenDescription">
                Enable if the Wi-Fi name is not broadcast
                publicly
              </span>
            </span>
          </button>
        </div>
      ) : null}

      {mode === "contact" ? (
        <div className="presetCard">
          <Field
            label="Name"
            value={contactName}
            onChangeText={setContactName}
            placeholder="Full name"
          />

          <Field
            label="Company"
            value={contactCompany}
            onChangeText={setContactCompany}
            placeholder="Company"
          />

          <Field
            label="Title"
            value={contactTitle}
            onChangeText={setContactTitle}
            placeholder="Job title"
          />

          <Field
            label="Phone"
            value={contactPhone}
            onChangeText={setContactPhone}
            placeholder="+1 212 555 1234"
            keyboardType="phone-pad"
          />

          <Field
            label="Email"
            value={contactEmail}
            onChangeText={setContactEmail}
            placeholder="hello@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Field
            label="Website"
            value={contactWebsite}
            onChangeText={setContactWebsite}
            placeholder="https://example.com"
            keyboardType="url"
            autoCapitalize="none"
          />

          <Field
            label="Address"
            value={contactAddress}
            onChangeText={setContactAddress}
            placeholder="Street, city, state"
          />
        </div>
      ) : null}

      {mode === "email" ? (
        <div className="presetCard">
          <Field
            label="Email address"
            value={emailAddress}
            onChangeText={setEmailAddress}
            placeholder="hello@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Field
            label="Subject"
            value={emailSubject}
            onChangeText={setEmailSubject}
            placeholder="Optional subject"
          />

          <Field
            label="Message"
            value={emailBody}
            onChangeText={setEmailBody}
            placeholder="Optional message"
            multiline
          />
        </div>
      ) : null}

      {mode === "phone" ? (
        <div className="presetCard">
          <Field
            label="Phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="+1 212 555 1234"
            keyboardType="phone-pad"
          />
        </div>
      ) : null}

      <div className="helperRow">
        <span className="webFlashIcon">⚡</span>

        <span className="helper">
          Your QR code updates automatically as you type
        </span>
      </div>

      <style jsx>{`
        .inputSection {
          margin-top: 24px;
        }

        .labelRow {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .label {
          color: #f8fafc;
          font-size: 15px;
          font-weight: 800;
        }

        .subLabel {
          color: #64748b;
          font-size: 11px;
          margin-top: 3px;
        }

        .counter {
          color: #475569;
          font-size: 12px;
          font-weight: 600;
        }

        .modeScroller {
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: thin;
          scrollbar-color: #334155 transparent;
          -ms-overflow-style: auto;
          overscroll-behavior-x: contain;
          touch-action: pan-x;
          padding-bottom: 4px;
        }

        .modeScroller::-webkit-scrollbar {
          height: 6px;
        }

        .modeScroller::-webkit-scrollbar-track {
          background: transparent;
        }

        .modeScroller::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 999px;
        }

        .modeScroller::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }

        .modeRow {
          display: flex;
          flex-direction: row;
          gap: 8px;
          padding-bottom: 12px;
          width: max-content;
          min-width: 100%;
        }

        .inputContainer {
          min-height: 64px;
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          background-color: #0b1220;
          border: 1px solid #1e293b;
          border-radius: 17px;
          padding: 0 15px;
        }

        .inputIcon {
          margin-top: 18px;
          margin-right: 10px;
        }

        .input {
          flex: 1;
          min-width: 0;
          min-height: 62px;
          max-height: 130px;
          color: #ffffff;
          background: transparent;
          border: 0;
          outline: none;
          resize: none;
          padding: 17px 0;
          font-size: 16px;
          line-height: 22px;
          font-family: inherit;
        }

        .input::placeholder {
          color: #475569;
        }

        .clearButton {
          border: 0;
          background: transparent;
          padding: 17px 0 0 8px;
          cursor: pointer;
        }

        .clearButton:active {
          opacity: 0.7;
        }

        .presetCard {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background-color: #0b1220;
          border: 1px solid #1e293b;
          border-radius: 18px;
          padding: 14px;
        }

        .fieldLabel {
          color: #cbd5e1;
          font-size: 11px;
          font-weight: 800;
        }

        .previewNotice {
          background-color: #101c31;
          border: 1px solid #1d4ed8;
          border-radius: 14px;
          padding: 12px;
        }

        .previewNoticeLabel {
          color: #60a5fa;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .previewNoticeValue {
          color: #dbeafe;
          font-size: 12px;
          font-weight: 700;
          margin-top: 4px;
          overflow-wrap: anywhere;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .securityRow {
          display: flex;
          flex-direction: row;
          gap: 8px;
        }

        .securityButton {
          flex: 1;
          min-height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #10141c;
          border: 1px solid #28303d;
          border-radius: 12px;
          cursor: pointer;
        }

        .securityButtonActive {
          background-color: #101c31;
          border-color: #2563eb;
        }

        .securityButtonText {
          color: #64748b;
          font-size: 11px;
          font-weight: 800;
        }

        .securityButtonTextActive {
          color: #60a5fa;
        }

        .hiddenRow {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px;
          background-color: #10141c;
          border: 0;
          border-radius: 14px;
          padding: 12px;
          text-align: left;
          cursor: pointer;
        }

        .checkbox {
          width: 22px;
          height: 22px;
          flex: 0 0 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #475569;
          border-radius: 7px;
        }

        .checkboxActive {
          background-color: #2563eb;
          border-color: #2563eb;
        }

        .checkboxCheck {
          color: #ffffff;
          font-size: 14px;
          font-weight: 900;
        }

        .hiddenText {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .hiddenLabel {
          color: #f8fafc;
          font-size: 12px;
          font-weight: 800;
        }

        .hiddenDescription {
          color: #64748b;
          font-size: 10px;
          margin-top: 2px;
        }

        .helperRow {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
        }

        .helper {
          color: #64748b;
          font-size: 12px;
        }

        .webInputIcon {
          color: #64748b;
          font-size: 20px;
          font-weight: 900;
          line-height: 22px;
        }

        .webClearIcon {
          color: #64748b;
          font-size: 24px;
          font-weight: 700;
          line-height: 24px;
        }

        .webFlashIcon {
          color: #3b82f6;
          font-size: 14px;
          line-height: 16px;
        }
      `}</style>
    </div>
  );
}

type ModeButtonProps = {
  mode: InputMode;
  label: string;
  active: boolean;
  onPress: () => void;
};

function ModeButton({
  mode,
  label,
  active,
  onPress,
}: ModeButtonProps) {
  const webIcon = {
    text: "≡",
    website: "◎",
    wifi: "⌁",
    contact: "●",
    email: "✉",
    phone: "☎",
  }[mode];

  return (
    <button
      type="button"
      className={`modeButton ${
        active ? "modeButtonActive" : ""
      }`}
      onClick={onPress}
    >
      <span
        className={`modeWebIcon ${
          active ? "modeWebIconActive" : ""
        }`}
      >
        {webIcon}
      </span>

      <span
        className={`modeText ${
          active ? "modeTextActive" : ""
        }`}
      >
        {label}
      </span>

      <style jsx>{`
        .modeButton {
          min-height: 40px;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 6px;
          background-color: #0b1220;
          border: 1px solid #1e293b;
          border-radius: 13px;
          padding: 0 12px;
          cursor: pointer;
          white-space: nowrap;
        }

        .modeButtonActive {
          background-color: #2563eb;
          border-color: #3b82f6;
        }

        .modeText {
          color: #64748b;
          font-size: 12px;
          font-weight: 800;
        }

        .modeTextActive {
          color: #ffffff;
        }

        .modeWebIcon {
          color: #64748b;
          font-size: 16px;
          font-weight: 900;
        }

        .modeWebIconActive {
          color: #ffffff;
        }
      `}</style>
    </button>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  autoCapitalize?:
    | "none"
    | "sentences"
    | "words"
    | "characters";
  keyboardType?:
    | "default"
    | "email-address"
    | "phone-pad"
    | "url";
  secureTextEntry?: boolean;
  multiline?: boolean;
};

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  autoCapitalize = "sentences",
  keyboardType = "default",
  secureTextEntry = false,
  multiline = false,
}: FieldProps) {
  const inputType =
    secureTextEntry
      ? "password"
      : keyboardType === "email-address"
        ? "email"
        : keyboardType === "phone-pad"
          ? "tel"
          : keyboardType === "url"
            ? "url"
            : "text";

  return (
    <div className="field">
      <label className="fieldLabel">{label}</label>

      {multiline ? (
        <textarea
          className="fieldInput fieldInputMultiline"
          value={value}
          onChange={(event) =>
            onChangeText(event.target.value)
          }
          placeholder={placeholder}
          autoCapitalize={autoCapitalize}
          autoCorrect="off"
        />
      ) : (
        <input
          className="fieldInput"
          type={inputType}
          value={value}
          onChange={(event) =>
            onChangeText(event.target.value)
          }
          placeholder={placeholder}
          autoCapitalize={autoCapitalize}
          autoCorrect="off"
        />
      )}

      <style jsx>{`
        .field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .fieldLabel {
          color: #cbd5e1;
          font-size: 11px;
          font-weight: 800;
        }

        .fieldInput {
          width: 100%;
          min-height: 48px;
          color: #ffffff;
          background-color: #10141c;
          border: 1px solid #28303d;
          border-radius: 14px;
          padding: 0 13px;
          font-size: 14px;
          font-family: inherit;
          outline: none;
        }

        .fieldInput::placeholder {
          color: #475569;
        }

        .fieldInput:focus {
          border-color: #3b82f6;
        }

        .fieldInputMultiline {
          min-height: 90px;
          padding-top: 13px;
          padding-bottom: 13px;
          resize: vertical;
          line-height: 20px;
        }
      `}</style>
    </div>
  );
}