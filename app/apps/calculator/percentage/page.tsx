"use client";

import Link from "next/link";
import { useState } from "react";

type Mode = "percentOf" | "change" | "whatPercent";

const theme = {
  background: "#FFFFFF",
  surface: "#FFFFFF",
  card: "#F7F7F7",
  text: "#171717",
  textSecondary: "#555555",
  textMuted: "#666666",
  border: "#D9D9D9",
  inputBackground: "#FFFFFF",
  inputBorder: "#D9D9D9",
  primary: "#171717",
  primarySoft: "#F3F3F3",
  danger: "#F05252",
};

export default function PercentageCalculatorPage() {
  const [mode, setMode] = useState<Mode>("percentOf");
  const [valueA, setValueA] = useState("");
  const [valueB, setValueB] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [resultLabel, setResultLabel] = useState("");
  const [error, setError] = useState("");

  function clearAll() {
    setValueA("");
    setValueB("");
    setResult(null);
    setResultLabel("");
    setError("");
  }

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    clearAll();
  }

  function calculate() {
    const a = Number(valueA);
    const b = Number(valueB);

    if (
      valueA.trim() === "" ||
      valueB.trim() === "" ||
      !Number.isFinite(a) ||
      !Number.isFinite(b)
    ) {
      setError("Enter valid numbers in both fields.");
      setResult(null);
      return;
    }

    setError("");

    if (mode === "percentOf") {
      const answer = (a / 100) * b;

      setResult(formatNumber(answer));
      setResultLabel(
        `${formatNumber(a)}% of ${formatNumber(b)}`
      );

      return;
    }

    if (mode === "change") {
      if (a === 0) {
        setError("The starting value cannot be zero.");
        setResult(null);
        return;
      }

      const answer = ((b - a) / Math.abs(a)) * 100;

      setResult(`${formatNumber(answer)}%`);

      if (answer > 0) {
        setResultLabel("Percentage increase");
      } else if (answer < 0) {
        setResultLabel("Percentage decrease");
      } else {
        setResultLabel("No percentage change");
      }

      return;
    }

    if (b === 0) {
      setError("The total cannot be zero.");
      setResult(null);
      return;
    }

    const answer = (a / b) * 100;

    setResult(`${formatNumber(answer)}%`);

    setResultLabel(
      `${formatNumber(a)} is this percent of ${formatNumber(b)}`
    );
  }

  const fieldConfig = {
    percentOf: {
      firstLabel: "Percentage",
      firstPlaceholder: "20",
      firstSuffix: "%",
      secondLabel: "Of value",
      secondPlaceholder: "150",
      secondSuffix: "",
      example: "20% of 150 = 30",
    },

    change: {
      firstLabel: "Starting value",
      firstPlaceholder: "100",
      firstSuffix: "",
      secondLabel: "New value",
      secondPlaceholder: "125",
      secondSuffix: "",
      example: "100 → 125 = 25% increase",
    },

    whatPercent: {
      firstLabel: "Value",
      firstPlaceholder: "30",
      firstSuffix: "",
      secondLabel: "Total",
      secondPlaceholder: "150",
      secondSuffix: "",
      example: "30 is 20% of 150",
    },
  }[mode];

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      <div className="percentage-page-container">
        <Link
          href="/apps/calculator"
          style={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: 44,
            marginBottom: 20,
            color: theme.primary,
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              fontSize: 32,
              lineHeight: "32px",
              marginRight: 6,
            }}
          >
            ‹
          </span>

          Calculators
        </Link>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <div
              style={{
                color: theme.primary,
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: 4,
              }}
            >
              BODOLVO
            </div>

            <h1
              style={{
                color: theme.text,
                fontSize: 33,
                fontWeight: 800,
                letterSpacing: -1,
                margin: "8px 0 0",
              }}
            >
              Percentage
            </h1>
          </div>

          <div
            style={{
              backgroundColor: theme.primarySoft,
              border: `1px solid ${theme.border}`,
              borderRadius: 999,
              padding: "6px 11px",
              marginBottom: 3,
            }}
          >
            <span
              style={{
                color: theme.primary,
                fontSize: 8,
                fontWeight: 900,
                letterSpacing: 1.2,
              }}
            >
              PERCENTAGE
            </span>
          </div>
        </div>

        <p
          style={{
            color: theme.textSecondary,
            fontSize: 14,
            lineHeight: "21px",
            marginTop: 17,
            marginBottom: 24,
          }}
        >
          Calculate percentages, percentage changes and ratios.
        </p>

        <div
          className="percentage-mode-switch"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: 18,
            padding: 5,
            gap: 5,
            marginBottom: 16,
          }}
        >
          <ModeButton
            label="% of"
            active={mode === "percentOf"}
            onClick={() => switchMode("percentOf")}
          />

          <ModeButton
            label="% Change"
            active={mode === "change"}
            onClick={() => switchMode("change")}
          />

          <ModeButton
            label="What %?"
            active={mode === "whatPercent"}
            onClick={() => switchMode("whatPercent")}
          />
        </div>

        <div
          className={`percentage-workspace ${
            result !== null ? "has-result" : ""
          }`}
        >
          <section
            style={{
              backgroundColor: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: 26,
              padding: 20,
            }}
          >
          <NumberField
            label={fieldConfig.firstLabel}
            placeholder={fieldConfig.firstPlaceholder}
            suffix={fieldConfig.firstSuffix}
            value={valueA}
            onChange={setValueA}
          />

          <div style={{ height: 18 }} />

          <NumberField
            label={fieldConfig.secondLabel}
            placeholder={fieldConfig.secondPlaceholder}
            suffix={fieldConfig.secondSuffix}
            value={valueB}
            onChange={setValueB}
          />

          <p
            style={{
              color: theme.textMuted,
              fontSize: 11,
              lineHeight: "17px",
              marginTop: 13,
              marginBottom: 0,
            }}
          >
            Example: {fieldConfig.example}
          </p>

          {error.length > 0 && (
            <div
              style={{
                backgroundColor: `${theme.danger}14`,
                border: `1px solid ${theme.danger}55`,
                borderRadius: 13,
                padding: "11px 13px",
                marginTop: 15,
              }}
            >
              <span
                style={{
                  color: theme.danger,
                  fontSize: 12,
                }}
              >
                {error}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={calculate}
            style={{
              width: "100%",
              minHeight: 58,
              backgroundColor: theme.primary,
              border: "none",
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Calculate
          </button>

          <button
            type="button"
            onClick={clearAll}
            style={{
              width: "100%",
              minHeight: 48,
              background: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8,
              color: theme.textSecondary,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Clear
          </button>
          </section>

          {result !== null && (
            <div className="percentage-results-column">
          <section
            style={{
              backgroundColor: theme.card,
              border: `1px solid ${theme.primary}`,
              borderRadius: 25,
              padding: 22,
              marginTop: 16,
            }}
          >
            <div
              style={{
                color: theme.primary,
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: 2,
                marginBottom: 10,
              }}
            >
              RESULT
            </div>

            <div
              style={{
                color: theme.text,
                fontSize: "clamp(32px, 9vw, 42px)",
                fontWeight: 700,
                letterSpacing: -1,
                overflowWrap: "anywhere",
              }}
            >
              {result}
            </div>

            <div
              style={{
                color: theme.textSecondary,
                fontSize: 13,
                lineHeight: "19px",
                marginTop: 7,
              }}
            >
              {resultLabel}
            </div>
          </section>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        .percentage-page-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 28px 32px 60px;
        }

        .percentage-mode-switch {
          max-width: 540px;
        }

        .percentage-workspace {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 18px;
          align-items: start;
          max-width: 760px;
        }

        .percentage-workspace.has-result {
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          max-width: none;
        }

        .percentage-results-column {
          min-width: 0;
        }

        .percentage-results-column > section {
          margin-top: 0 !important;
        }

        @media (max-width: 900px) {
          .percentage-page-container {
            max-width: 760px;
            padding-left: 24px;
            padding-right: 24px;
          }

          .percentage-workspace,
          .percentage-workspace.has-result {
            grid-template-columns: 1fr;
            max-width: none;
          }

          .percentage-mode-switch {
            max-width: none;
          }
        }

        @media (max-width: 600px) {
          .percentage-page-container {
            padding: 22px 16px 48px;
          }
        }

        @media (max-width: 380px) {
          .percentage-page-container {
            padding-left: 12px;
            padding-right: 12px;
          }
        }
      `}</style>
    </main>
  );
}

function ModeButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minHeight: 48,
        borderRadius: 14,
        border: active
          ? `1px solid ${theme.primary}`
          : "1px solid transparent",
        backgroundColor: active
          ? theme.primarySoft
          : "transparent",
        color: active ? theme.primary : theme.textMuted,
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function NumberField({
  label,
  placeholder,
  suffix,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  suffix: string;
  value: string;
  onChange: (value: string) => void;
}) {
  function handleChange(input: string) {
    const cleaned = input.replace(/[^0-9.-]/g, "");
    onChange(cleaned);
  }

  return (
    <div>
      <label
        style={{
          display: "block",
          color: theme.textSecondary,
          fontSize: 12,
          fontWeight: 700,
          marginBottom: 9,
        }}
      >
        {label}
      </label>

      <div
        style={{
          minHeight: 62,
          backgroundColor: theme.inputBackground,
          border: `1px solid ${theme.inputBorder}`,
          borderRadius: 17,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
        }}
      >
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => handleChange(event.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            minWidth: 0,
            background: "transparent",
            border: "none",
            outline: "none",
            color: theme.text,
            fontSize: 21,
            fontWeight: 600,
            padding: "15px 0",
          }}
        />

        {suffix.length > 0 && (
          <span
            style={{
              color: theme.primary,
              fontSize: 18,
              fontWeight: 800,
              marginLeft: 10,
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  const rounded =
    Math.round((value + Number.EPSILON) * 10000000000) /
    10000000000;

  return String(rounded);
}