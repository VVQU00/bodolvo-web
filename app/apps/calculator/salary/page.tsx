"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type PayMode =
  | "hourly"
  | "weekly"
  | "monthly"
  | "yearly";

const theme = {
  background: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceSecondary: "#F7F7F7",
  card: "#F7F7F7",

  text: "#171717",
  textSecondary: "#555555",
  textMuted: "#666666",

  border: "#D9D9D9",
  divider: "#1B222C",

  inputBackground: "#FFFFFF",
  inputBorder: "#D9D9D9",

  primary: "#171717",
  primarySoft: "#F3F3F3",

  danger: "#F05252",
};

export default function SalaryCalculatorPage() {
  const [mode, setMode] =
    useState<PayMode>("hourly");

  const [amount, setAmount] =
    useState("");

  const [hoursPerWeek, setHoursPerWeek] =
    useState("40");

  const [weeksPerYear, setWeeksPerYear] =
    useState("52");

  const amountValue =
    Number(amount);

  const hoursValue =
    Number(hoursPerWeek);

  const weeksValue =
    Number(weeksPerYear);

  const isValid =
    amount.trim() !== "" &&
    Number.isFinite(amountValue) &&
    amountValue >= 0 &&
    Number.isFinite(hoursValue) &&
    hoursValue > 0 &&
    Number.isFinite(weeksValue) &&
    weeksValue > 0;

  const results = useMemo(() => {
    if (!isValid) {
      return null;
    }

    let yearly = 0;

    if (mode === "hourly") {
      yearly =
        amountValue *
        hoursValue *
        weeksValue;
    }

    if (mode === "weekly") {
      yearly =
        amountValue *
        weeksValue;
    }

    if (mode === "monthly") {
      yearly =
        amountValue * 12;
    }

    if (mode === "yearly") {
      yearly =
        amountValue;
    }

    const monthly =
      yearly / 12;

    const weekly =
      yearly / weeksValue;

    const hourly =
      yearly /
      (hoursValue *
        weeksValue);

    const daily =
      weekly / 5;

    return {
      yearly,
      monthly,
      weekly,
      hourly,
      daily,
    };
  }, [
    mode,
    amountValue,
    hoursValue,
    weeksValue,
    isValid,
  ]);

  function clearAll() {
    setMode("hourly");
    setAmount("");
    setHoursPerWeek("40");
    setWeeksPerYear("52");
  }

  const amountLabel = {
    hourly: "Hourly rate",
    weekly: "Weekly pay",
    monthly: "Monthly pay",
    yearly: "Yearly salary",
  }[mode];

  const amountPlaceholder = {
    hourly: "25",
    weekly: "1000",
    monthly: "4500",
    yearly: "60000",
  }[mode];

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor:
          theme.background,
        color: theme.text,
      }}
    >
      <div className="salary-page-container">
        <Link
          href="/apps/calculator"
          style={{
            display:
              "inline-flex",
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
              color:
                theme.primary,
              fontSize: 32,
              lineHeight: "32px",
              marginRight: 6,
            }}
          >
            ‹
          </span>

          Calculators
        </Link>

        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <div
              style={{
                color:
                  theme.primary,
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
                margin:
                  "8px 0 0",
              }}
            >
              Salary
            </h1>
          </div>

          <div
            style={{
              backgroundColor:
                theme.primarySoft,
              border: `1px solid ${theme.border}`,
              borderRadius: 999,
              padding:
                "6px 11px",
              marginBottom: 3,
            }}
          >
            <span
              style={{
                color:
                  theme.primary,
                fontSize: 8,
                fontWeight: 900,
                letterSpacing: 1.2,
              }}
            >
              MONEY
            </span>
          </div>
        </div>

        <p
          style={{
            color:
              theme.textSecondary,
            fontSize: 14,
            lineHeight: "21px",
            marginTop: 17,
            marginBottom: 24,
          }}
        >
          Convert between hourly,
          weekly, monthly and yearly
          pay.
        </p>

        {/* MODE SELECTOR */}

        <div
          className="salary-mode-switch"
          style={{
            display: "flex",
            flexWrap: "wrap",
            backgroundColor:
              theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: 18,
            padding: 5,
            gap: 5,
            marginBottom: 16,
          }}
        >
          <ModeButton
            label="Hourly"
            active={
              mode === "hourly"
            }
            onClick={() =>
              setMode("hourly")
            }
          />

          <ModeButton
            label="Weekly"
            active={
              mode === "weekly"
            }
            onClick={() =>
              setMode("weekly")
            }
          />

          <ModeButton
            label="Monthly"
            active={
              mode === "monthly"
            }
            onClick={() =>
              setMode("monthly")
            }
          />

          <ModeButton
            label="Yearly"
            active={
              mode === "yearly"
            }
            onClick={() =>
              setMode("yearly")
            }
          />
        </div>

        {/* FORM */}

        <div className="salary-workspace">
          <section
            style={{
              backgroundColor:
                theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: 26,
              padding: 20,
            }}
          >
          <label
            style={{
              display: "block",
              color:
                theme.textSecondary,
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 9,
            }}
          >
            {amountLabel}
          </label>

          <div
            style={{
              minHeight: 68,
              backgroundColor:
                theme.inputBackground,
              border: `1px solid ${theme.inputBorder}`,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              padding: "0 17px",
            }}
          >
            <span
              style={{
                color:
                  theme.primary,
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
              value={amount}
              onChange={(event) =>
                setAmount(
                  cleanDecimalInput(
                    event.target.value
                  )
                )
              }
              placeholder={
                amountPlaceholder
              }
              style={{
                flex: 1,
                minWidth: 0,
                background:
                  "transparent",
                border: "none",
                outline: "none",
                color: theme.text,
                fontSize: 25,
                fontWeight: 700,
                padding:
                  "15px 0",
              }}
            />
          </div>

          {/* HOURS */}

          <h2
            style={{
              color: theme.text,
              fontSize: 15,
              fontWeight: 800,
              marginTop: 26,
              marginBottom: 12,
            }}
          >
            Hours per week
          </h2>

          <div
            style={{
              minHeight: 60,
              backgroundColor:
                theme.inputBackground,
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
              value={hoursPerWeek}
              onChange={(event) =>
                setHoursPerWeek(
                  cleanDecimalInput(
                    event.target.value
                  )
                )
              }
              placeholder="40"
              style={{
                flex: 1,
                minWidth: 0,
                background:
                  "transparent",
                border: "none",
                outline: "none",
                color: theme.text,
                fontSize: 20,
                fontWeight: 700,
                padding:
                  "14px 0",
              }}
            />

            <span
              style={{
                color:
                  theme.textMuted,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              hrs
            </span>
          </div>

          {/* WEEKS */}

          <h2
            style={{
              color: theme.text,
              fontSize: 15,
              fontWeight: 800,
              marginTop: 26,
              marginBottom: 12,
            }}
          >
            Working weeks per year
          </h2>

          <div
            style={{
              minHeight: 60,
              backgroundColor:
                theme.inputBackground,
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
              value={weeksPerYear}
              onChange={(event) =>
                setWeeksPerYear(
                  cleanDecimalInput(
                    event.target.value
                  )
                )
              }
              placeholder="52"
              style={{
                flex: 1,
                minWidth: 0,
                background:
                  "transparent",
                border: "none",
                outline: "none",
                color: theme.text,
                fontSize: 20,
                fontWeight: 700,
                padding:
                  "14px 0",
              }}
            />

            <span
              style={{
                color:
                  theme.textMuted,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              weeks
            </span>
          </div>

          <p
            style={{
              color:
                theme.textMuted,
              fontSize: 11,
              lineHeight: "17px",
              marginTop: 10,
              marginBottom: 0,
            }}
          >
            Adjust these if you work a
            different schedule or take
            unpaid time off.
          </p>

          {/* ERROR */}

          {!isValid &&
            (
              amount.length > 0 ||
              hoursPerWeek.length >
                0 ||
              weeksPerYear.length >
                0
            ) && (
              <div
                style={{
                  backgroundColor: `${theme.danger}14`,
                  border: `1px solid ${theme.danger}55`,
                  borderRadius: 13,
                  padding:
                    "11px 13px",
                  marginTop: 16,
                }}
              >
                <span
                  style={{
                    color:
                      theme.danger,
                    fontSize: 12,
                    lineHeight:
                      "18px",
                  }}
                >
                  Enter a valid pay
                  amount, weekly hours
                  and working weeks.
                </span>
              </div>
            )}

          {/* CLEAR */}

          <button
            type="button"
            onClick={clearAll}
            style={{
              width: "100%",
              minHeight: 46,
              border: "none",
              background:
                "transparent",
              color:
                theme.textSecondary,
              fontSize: 13,
              fontWeight: 700,
              marginTop: 12,
              cursor: "pointer",
            }}
          >
            Clear
          </button>
          </section>

          {/* RESULTS */}

          <div className="salary-results-column">
            {results && (
          <>
            <section
              style={{
                backgroundColor:
                  theme.card,
                border: `1px solid ${theme.primary}`,
                borderRadius: 26,
                padding: 22,
                marginTop: 16,
              }}
            >
              <div
                style={{
                  color:
                    theme.primary,
                  fontSize: 9,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 10,
                }}
              >
                ESTIMATED YEARLY PAY
              </div>

              <div
                style={{
                  color: theme.text,
                  fontSize:
                    "clamp(32px, 9vw, 42px)",
                  fontWeight: 800,
                  letterSpacing:
                    -1.5,
                  overflowWrap:
                    "anywhere",
                }}
              >
                {formatCurrency(
                  results.yearly
                )}
              </div>

              <div
                style={{
                  color:
                    theme.textSecondary,
                  fontSize: 13,
                  marginTop: 7,
                }}
              >
                before taxes and
                deductions
              </div>
            </section>

            <section
              style={{
                backgroundColor:
                  theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 24,
                padding: 20,
                marginTop: 16,
              }}
            >
              <h2
                style={{
                  color: theme.text,
                  fontSize: 16,
                  fontWeight: 800,
                  margin:
                    "0 0 20px 0",
                }}
              >
                Pay breakdown
              </h2>

              <PayRow
                label="Hourly"
                value={formatCurrency(
                  results.hourly
                )}
              />

              <PayRow
                label="Daily"
                value={formatCurrency(
                  results.daily
                )}
              />

              <PayRow
                label="Weekly"
                value={formatCurrency(
                  results.weekly
                )}
              />

              <PayRow
                label="Monthly"
                value={formatCurrency(
                  results.monthly
                )}
              />

              <div
                style={{
                  height: 1,
                  backgroundColor:
                    theme.divider,
                  margin:
                    "7px 0 17px",
                }}
              />

              <PayRow
                label="Yearly"
                value={formatCurrency(
                  results.yearly
                )}
                strong
              />
            </section>

            <section
              style={{
                backgroundColor:
                  theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 22,
                padding: 19,
                marginTop: 16,
              }}
            >
              <h2
                style={{
                  color: theme.text,
                  fontSize: 15,
                  fontWeight: 800,
                  margin:
                    "0 0 9px 0",
                }}
              >
                Before-tax estimate
              </h2>

              <p
                style={{
                  color:
                    theme.textSecondary,
                  fontSize: 12,
                  lineHeight: "19px",
                  margin: 0,
                }}
              >
                This calculator converts
                gross pay only. Taxes,
                benefits, overtime,
                bonuses and other
                deductions are not
                included.
              </p>
            </section>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        .salary-page-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 28px 32px 60px;
        }

        .salary-mode-switch {
          max-width: 540px;
        }

        .salary-workspace {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 18px;
          align-items: start;
        }

        .salary-results-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 0;
        }

        .salary-results-column > section {
          margin-top: 0 !important;
        }

        @media (max-width: 900px) {
          .salary-page-container {
            max-width: 760px;
            padding-left: 24px;
            padding-right: 24px;
          }

          .salary-workspace {
            grid-template-columns: 1fr;
          }

          .salary-mode-switch {
            max-width: none;
          }
        }

        @media (max-width: 600px) {
          .salary-page-container {
            padding: 22px 16px 48px;
          }
        }

        @media (max-width: 380px) {
          .salary-page-container {
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
        flexGrow: 1,
        minWidth: "22%",
        minHeight: 48,
        borderRadius: 14,
        padding: "0 8px",
        backgroundColor: active
          ? theme.primarySoft
          : "transparent",
        border: active
          ? `1px solid ${theme.primary}`
          : "1px solid transparent",
        color: active
          ? theme.primary
          : theme.textMuted,
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function PayRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center",
        gap: 12,
        marginBottom: 14,
      }}
    >
      <span
        style={{
          color: strong
            ? theme.text
            : theme.textSecondary,
          fontSize: strong
            ? 15
            : 13,
          fontWeight: strong
            ? 800
            : 500,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: strong
            ? theme.text
            : theme.textSecondary,
          fontSize: strong
            ? 19
            : 14,
          fontWeight: strong
            ? 900
            : 700,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function cleanDecimalInput(
  value: string
) {
  let cleaned =
    value.replace(
      /[^0-9.]/g,
      ""
    );

  const firstDecimal =
    cleaned.indexOf(".");

  if (firstDecimal !== -1) {
    cleaned =
      cleaned.slice(
        0,
        firstDecimal + 1
      ) +
      cleaned
        .slice(
          firstDecimal + 1
        )
        .replace(/\./g, "");
  }

  return cleaned;
}

function formatCurrency(
  value: number
) {
  if (!Number.isFinite(value)) {
    return "$0.00";
  }

  return `$${value.toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}