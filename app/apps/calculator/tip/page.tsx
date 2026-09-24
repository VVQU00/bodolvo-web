"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const tipPresets = [10, 15, 18, 20, 25];

const theme = {
  background: "#07090D",
  surface: "#0D1117",
  surfaceSecondary: "#131922",
  card: "#10151D",
  text: "#F5F7FA",
  textSecondary: "#AEB7C4",
  textMuted: "#788391",
  border: "#202833",
  divider: "#1B222C",
  inputBackground: "#0B1016",
  inputBorder: "#202833",
  primary: "#208AEF",
  primarySoft: "#102A43",
  danger: "#F05252",
};

export default function TipCalculatorPage() {
  const [bill, setBill] = useState("");
  const [tipPercent, setTipPercent] = useState("20");
  const [people, setPeople] = useState("1");

  const billValue = Number(bill);
  const tipValue = Number(tipPercent);
  const peopleValue = Number(people);

  const isValid =
    bill.trim() !== "" &&
    Number.isFinite(billValue) &&
    billValue >= 0 &&
    Number.isFinite(tipValue) &&
    tipValue >= 0 &&
    Number.isFinite(peopleValue) &&
    peopleValue >= 1;

  const results = useMemo(() => {
    if (!isValid) {
      return null;
    }

    const tipAmount = billValue * (tipValue / 100);
    const total = billValue + tipAmount;
    const perPerson = total / peopleValue;
    const tipPerPerson = tipAmount / peopleValue;

    return {
      tipAmount,
      total,
      perPerson,
      tipPerPerson,
    };
  }, [billValue, tipValue, peopleValue, isValid]);

  function clearAll() {
    setBill("");
    setTipPercent("20");
    setPeople("1");
  }

  function decrementPeople() {
    const current = Number(people);

    if (!Number.isFinite(current) || current <= 1) {
      setPeople("1");
      return;
    }

    setPeople(String(Math.floor(current - 1)));
  }

  function incrementPeople() {
    const current = Number(people);

    if (!Number.isFinite(current) || current < 1) {
      setPeople("1");
      return;
    }

    setPeople(String(Math.floor(current + 1)));
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      <div className="tip-page-container">
        <Link
          href="/apps/calculator"
          style={{
            display: "inline-flex",
            alignItems: "center",
            alignSelf: "flex-start",
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
              color: theme.primary,
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
              Tip & Split
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
              EVERYDAY
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
          Calculate a tip, split the full bill and see exactly what each
          person pays.
        </p>

        <div
          className={`tip-workspace ${
            results ? "has-result" : ""
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
          <label
            style={{
              display: "block",
              color: theme.textSecondary,
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 9,
            }}
          >
            Bill amount
          </label>

          <div
            style={{
              minHeight: 68,
              backgroundColor: theme.inputBackground,
              border: `1px solid ${theme.inputBorder}`,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              padding: "0 17px",
            }}
          >
            <span
              style={{
                color: theme.primary,
                fontSize: 26,
                fontWeight: 800,
                marginRight: 8,
              }}
            >
              $
            </span>

            <input
              type="text"
              inputMode="decimal"
              value={bill}
              onChange={(event) =>
                setBill(cleanDecimalInput(event.target.value))
              }
              placeholder="0.00"
              style={{
                flex: 1,
                minWidth: 0,
                color: theme.text,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 25,
                fontWeight: 700,
                padding: "15px 0",
              }}
            />
          </div>

          <h2
            style={{
              color: theme.text,
              fontSize: 15,
              fontWeight: 800,
              marginTop: 26,
              marginBottom: 12,
            }}
          >
            Tip
          </h2>

          <div
            className="tip-preset-grid"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 17,
            }}
          >
            {tipPresets.map((preset) => {
              const active = Number(tipPercent) === preset;

              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTipPercent(String(preset))}
                  style={{
                    minWidth: "17%",
                    flexGrow: 1,
                    minHeight: 48,
                    backgroundColor: active
                      ? theme.primarySoft
                      : theme.surface,
                    border: `1px solid ${
                      active ? theme.primary : theme.border
                    }`,
                    borderRadius: 14,
                    color: active ? theme.primary : theme.textMuted,
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  {preset}%
                </button>
              );
            })}
          </div>

          <label
            style={{
              display: "block",
              color: theme.textSecondary,
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 9,
            }}
          >
            Custom tip
          </label>

          <div
            style={{
              minHeight: 60,
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
              value={tipPercent}
              onChange={(event) =>
                setTipPercent(cleanDecimalInput(event.target.value))
              }
              placeholder="20"
              style={{
                flex: 1,
                minWidth: 0,
                color: theme.text,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 20,
                fontWeight: 700,
                padding: "14px 0",
              }}
            />

            <span
              style={{
                color: theme.primary,
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              %
            </span>
          </div>

          <h2
            style={{
              color: theme.text,
              fontSize: 15,
              fontWeight: 800,
              marginTop: 26,
              marginBottom: 12,
            }}
          >
            Split between
          </h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: theme.inputBackground,
              border: `1px solid ${theme.inputBorder}`,
              borderRadius: 19,
              padding: 8,
            }}
          >
            <button
              type="button"
              onClick={decrementPeople}
              style={{
                width: 52,
                height: 52,
                borderRadius: 15,
                backgroundColor: theme.surfaceSecondary,
                border: `1px solid ${theme.border}`,
                color: theme.primary,
                fontSize: 27,
                fontWeight: 500,
                lineHeight: "30px",
                cursor: "pointer",
              }}
            >
              −
            </button>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <input
                type="text"
                inputMode="numeric"
                value={people}
                onChange={(event) =>
                  setPeople(event.target.value.replace(/[^0-9]/g, ""))
                }
                style={{
                  minWidth: 70,
                  maxWidth: 100,
                  color: theme.text,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 24,
                  fontWeight: 800,
                  textAlign: "center",
                  padding: 0,
                }}
              />

              <span
                style={{
                  color: theme.textMuted,
                  fontSize: 11,
                  fontWeight: 700,
                  marginTop: 2,
                }}
              >
                {Number(people) === 1 ? "person" : "people"}
              </span>
            </div>

            <button
              type="button"
              onClick={incrementPeople}
              style={{
                width: 52,
                height: 52,
                borderRadius: 15,
                backgroundColor: theme.surfaceSecondary,
                border: `1px solid ${theme.border}`,
                color: theme.primary,
                fontSize: 27,
                fontWeight: 500,
                lineHeight: "30px",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>

          {!isValid && bill.length > 0 && (
            <div
              style={{
                backgroundColor: `${theme.danger}14`,
                border: `1px solid ${theme.danger}55`,
                borderRadius: 13,
                padding: "11px 13px",
                marginTop: 16,
              }}
            >
              <span
                style={{
                  color: theme.danger,
                  fontSize: 12,
                }}
              >
                Enter a valid bill, tip and at least 1 person.
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={clearAll}
            style={{
              width: "100%",
              minHeight: 46,
              border: "none",
              background: "transparent",
              color: theme.textSecondary,
              fontSize: 13,
              fontWeight: 700,
              marginTop: 12,
              cursor: "pointer",
            }}
          >
            Clear
          </button>
          </section>

          {results && (
            <div className="tip-results-column">
              <section
            style={{
              backgroundColor: theme.card,
              border: `1px solid ${theme.primary}`,
              borderRadius: 26,
              padding: 21,
              marginTop: 16,
            }}
          >
            <div
              style={{
                color: theme.primary,
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: 2,
                marginBottom: 19,
              }}
            >
              BILL SUMMARY
            </div>

            <SummaryRow
              label="Bill"
              value={formatCurrency(billValue)}
            />

            <SummaryRow
              label={`Tip (${formatNumber(tipValue)}%)`}
              value={formatCurrency(results.tipAmount)}
            />

            <div
              style={{
                height: 1,
                backgroundColor: theme.divider,
                margin: "7px 0 17px",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                marginBottom: 13,
              }}
            >
              <span
                style={{
                  color: theme.text,
                  fontSize: 16,
                  fontWeight: 800,
                }}
              >
                Total
              </span>

              <span
                style={{
                  color: theme.text,
                  fontSize: 24,
                  fontWeight: 800,
                }}
              >
                {formatCurrency(results.total)}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                backgroundColor: theme.surface,
                borderRadius: 20,
                border: `1px solid ${theme.border}`,
                padding: "20px 12px",
                marginTop: 13,
              }}
            >
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: theme.textMuted,
                    fontSize: 8,
                    fontWeight: 900,
                    letterSpacing: 1.3,
                    marginBottom: 7,
                  }}
                >
                  EACH PERSON
                </div>

                <div
                  style={{
                    color: theme.primary,
                    fontSize: 27,
                    fontWeight: 800,
                  }}
                >
                  {formatCurrency(results.perPerson)}
                </div>
              </div>

              <div
                style={{
                  width: 1,
                  backgroundColor: theme.divider,
                  margin: "0 8px",
                }}
              />

              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: theme.textMuted,
                    fontSize: 8,
                    fontWeight: 900,
                    letterSpacing: 1.3,
                    marginBottom: 7,
                  }}
                >
                  TIP EACH
                </div>

                <div
                  style={{
                    color: theme.text,
                    fontSize: 22,
                    fontWeight: 800,
                  }}
                >
                  {formatCurrency(results.tipPerPerson)}
                </div>
              </div>
            </div>

            <div
              style={{
                color: theme.textMuted,
                fontSize: 11,
                textAlign: "center",
                marginTop: 13,
              }}
            >
              Split between{" "}
              {Math.max(1, Math.floor(peopleValue))}{" "}
              {Math.floor(peopleValue) === 1 ? "person" : "people"}
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

        .tip-page-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 28px 32px 60px;
        }

        .tip-workspace {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 18px;
          align-items: start;
          max-width: 760px;
        }

        .tip-workspace.has-result {
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          max-width: none;
        }

        .tip-results-column {
          min-width: 0;
        }

        .tip-results-column > section {
          margin-top: 0 !important;
        }

        @media (max-width: 900px) {
          .tip-page-container {
            max-width: 760px;
            padding-left: 24px;
            padding-right: 24px;
          }

          .tip-workspace,
          .tip-workspace.has-result {
            grid-template-columns: 1fr;
            max-width: none;
          }
        }

        @media (max-width: 600px) {
          .tip-page-container {
            padding: 22px 16px 48px;
          }

          .tip-preset-grid > button {
            min-width: calc(33.333% - 6px) !important;
          }
        }

        @media (max-width: 380px) {
          .tip-page-container {
            padding-left: 12px;
            padding-right: 12px;
          }

          .tip-preset-grid > button {
            min-width: calc(50% - 4px) !important;
          }
        }
      `}</style>
    </main>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        marginBottom: 13,
      }}
    >
      <span
        style={{
          color: theme.textSecondary,
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: theme.textSecondary,
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function cleanDecimalInput(value: string) {
  let cleaned = value.replace(/[^0-9.]/g, "");

  const firstDecimal = cleaned.indexOf(".");

  if (firstDecimal !== -1) {
    cleaned =
      cleaned.slice(0, firstDecimal + 1) +
      cleaned.slice(firstDecimal + 1).replace(/\./g, "");
  }

  return cleaned;
}

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) {
    return "$0.00";
  }

  return `$${value.toFixed(2)}`;
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  const rounded =
    Math.round((value + Number.EPSILON) * 100) / 100;

  return String(rounded);
}