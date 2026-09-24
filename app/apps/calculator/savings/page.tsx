"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type GoalMode = "time" | "monthly";

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

export default function SavingsCalculatorPage() {
  const [mode, setMode] = useState<GoalMode>("time");

  const [goalAmount, setGoalAmount] = useState("");
  const [currentSavings, setCurrentSavings] = useState("0");
  const [monthlyContribution, setMonthlyContribution] =
    useState("");
  const [monthsToGoal, setMonthsToGoal] = useState("");

  const goalValue = Number(goalAmount);
  const currentValue = Number(currentSavings);
  const monthlyValue = Number(monthlyContribution);
  const monthsValue = Number(monthsToGoal);

  const timeModeValid =
    mode === "time" &&
    goalAmount.trim() !== "" &&
    monthlyContribution.trim() !== "" &&
    Number.isFinite(goalValue) &&
    goalValue > 0 &&
    Number.isFinite(currentValue) &&
    currentValue >= 0 &&
    Number.isFinite(monthlyValue) &&
    monthlyValue > 0 &&
    currentValue < goalValue;

  const monthlyModeValid =
    mode === "monthly" &&
    goalAmount.trim() !== "" &&
    monthsToGoal.trim() !== "" &&
    Number.isFinite(goalValue) &&
    goalValue > 0 &&
    Number.isFinite(currentValue) &&
    currentValue >= 0 &&
    Number.isFinite(monthsValue) &&
    monthsValue > 0 &&
    currentValue < goalValue;

  const result = useMemo(() => {
    const remaining = goalValue - currentValue;

    if (mode === "time" && timeModeValid) {
      const monthsNeeded = Math.ceil(remaining / monthlyValue);

      const totalContributed =
        monthlyValue * monthsNeeded;

      const projectedFinal =
        currentValue + totalContributed;

      return {
        remaining,
        monthsNeeded,
        monthlyNeeded: monthlyValue,
        projectedFinal,
      };
    }

    if (mode === "monthly" && monthlyModeValid) {
      const monthlyNeeded =
        remaining / monthsValue;

      return {
        remaining,
        monthsNeeded: monthsValue,
        monthlyNeeded,
        projectedFinal: goalValue,
      };
    }

    return null;
  }, [
    mode,
    goalValue,
    currentValue,
    monthlyValue,
    monthsValue,
    timeModeValid,
    monthlyModeValid,
  ]);

  function clearAll() {
    setMode("time");
    setGoalAmount("");
    setCurrentSavings("0");
    setMonthlyContribution("");
    setMonthsToGoal("");
  }

  function switchMode(nextMode: GoalMode) {
    setMode(nextMode);
  }

  const hasStartedTyping =
    goalAmount.length > 0 ||
    monthlyContribution.length > 0 ||
    monthsToGoal.length > 0;

  const invalidCurrentVsGoal =
    Number.isFinite(goalValue) &&
    Number.isFinite(currentValue) &&
    goalValue > 0 &&
    currentValue >= goalValue;

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      <div className="savings-page-container">
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
            gap: 12,
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
              Savings
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
              MONEY
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
          Plan a savings goal by calculating how long it will take or
          how much you need to save each month.
        </p>

        <div
          className="savings-mode-switch"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: 18,
            padding: 5,
            gap: 5,
            marginBottom: 16,
          }}
        >
          <ModeButton
            label="Time to goal"
            active={mode === "time"}
            onClick={() => switchMode("time")}
          />

          <ModeButton
            label="Monthly needed"
            active={mode === "monthly"}
            onClick={() => switchMode("monthly")}
          />
        </div>

        <div
          className={`savings-workspace ${
            result ? "has-result" : ""
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
          <label style={inputLabelStyle}>
            Savings goal
          </label>

          <MoneyInput
            value={goalAmount}
            onChange={setGoalAmount}
            placeholder="10000"
          />

          <h2 style={sectionLabelStyle}>
            Current savings
          </h2>

          <MoneyInput
            value={currentSavings}
            onChange={setCurrentSavings}
            placeholder="0"
          />

          {mode === "time" ? (
            <>
              <h2 style={sectionLabelStyle}>
                Monthly contribution
              </h2>

              <MoneyInput
                value={monthlyContribution}
                onChange={setMonthlyContribution}
                placeholder="500"
              />

              <p style={helperTextStyle}>
                Enter how much you expect to add every month.
              </p>
            </>
          ) : (
            <>
              <h2 style={sectionLabelStyle}>
                Time to reach goal
              </h2>

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
                  value={monthsToGoal}
                  onChange={(event) =>
                    setMonthsToGoal(
                      cleanDecimalInput(event.target.value)
                    )
                  }
                  placeholder="12"
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
                    color: theme.textMuted,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  months
                </span>
              </div>

              <p style={helperTextStyle}>
                Enter the number of months you want to give yourself.
              </p>
            </>
          )}

          {invalidCurrentVsGoal && (
            <div style={errorCardStyle}>
              <span style={errorTextStyle}>
                Your current savings must be lower than your savings
                goal.
              </span>
            </div>
          )}

          {!result &&
            hasStartedTyping &&
            !invalidCurrentVsGoal && (
              <div style={errorCardStyle}>
                <span style={errorTextStyle}>
                  Enter valid values for your savings goal and plan.
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

          {result && (
            <div className="savings-results-column">
          <>
            <section
              style={{
                backgroundColor: theme.card,
                border: `1px solid ${theme.primary}`,
                borderRadius: 26,
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
                {mode === "time"
                  ? "ESTIMATED TIME TO GOAL"
                  : "MONTHLY SAVINGS NEEDED"}
              </div>

              <div
                style={{
                  color: theme.text,
                  fontSize: "clamp(32px, 9vw, 38px)",
                  fontWeight: 800,
                  letterSpacing: -1.3,
                  overflowWrap: "anywhere",
                }}
              >
                {mode === "time"
                  ? formatDuration(result.monthsNeeded)
                  : formatCurrency(result.monthlyNeeded)}
              </div>

              <div
                style={{
                  color: theme.textMuted,
                  fontSize: 12,
                  marginTop: 8,
                }}
              >
                to reach {formatCurrency(goalValue)}
              </div>
            </section>

            <section
              style={{
                backgroundColor: theme.surface,
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
                  margin: "0 0 20px 0",
                }}
              >
                Savings breakdown
              </h2>

              <SavingsRow
                label="Goal"
                value={formatCurrency(goalValue)}
              />

              <SavingsRow
                label="Current savings"
                value={formatCurrency(currentValue)}
              />

              <SavingsRow
                label="Still needed"
                value={formatCurrency(result.remaining)}
                accent
              />

              <div style={dividerStyle} />

              <SavingsRow
                label="Monthly savings"
                value={formatCurrency(result.monthlyNeeded)}
              />

              <SavingsRow
                label="Time"
                value={formatDuration(result.monthsNeeded)}
              />

              <div style={dividerStyle} />

              <SavingsRow
                label="Goal amount"
                value={formatCurrency(goalValue)}
                strong
              />
            </section>

            <section
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 22,
                padding: 18,
                marginTop: 16,
              }}
            >
              <h2
                style={{
                  color: theme.text,
                  fontSize: 14,
                  fontWeight: 800,
                  margin: "0 0 14px 0",
                }}
              >
                Current progress
              </h2>

              <div
                style={{
                  width: "100%",
                  height: 10,
                  backgroundColor: theme.surfaceSecondary,
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        0,
                        (currentValue / goalValue) * 100
                      )
                    )}%`,
                    height: "100%",
                    backgroundColor: theme.primary,
                    borderRadius: 999,
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  marginTop: 9,
                }}
              >
                <span style={progressTextStyle}>
                  {formatPercent(
                    (currentValue / goalValue) * 100
                  )}{" "}
                  saved
                </span>

                <span style={progressTextStyle}>
                  {formatPercent(
                    (result.remaining / goalValue) * 100
                  )}{" "}
                  remaining
                </span>
              </div>
            </section>

            <section
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 20,
                padding: 17,
                marginTop: 16,
              }}
            >
              <h2
                style={{
                  color: theme.textSecondary,
                  fontSize: 13,
                  fontWeight: 800,
                  margin: "0 0 7px 0",
                }}
              >
                Simple savings estimate
              </h2>

              <p
                style={{
                  color: theme.textMuted,
                  fontSize: 11,
                  lineHeight: "18px",
                  margin: 0,
                }}
              >
                This calculator assumes a consistent savings amount and
                does not include interest or investment growth. Use
                Compound Interest for growth-based savings projections.
              </p>
            </section>
              </>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        .savings-page-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 28px 32px 60px;
        }

        .savings-mode-switch {
          max-width: 540px;
        }

        .savings-workspace {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 18px;
          align-items: start;
          max-width: 760px;
        }

        .savings-workspace.has-result {
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          max-width: none;
        }

        .savings-results-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 0;
        }

        .savings-results-column > section {
          margin-top: 0 !important;
        }

        @media (max-width: 900px) {
          .savings-page-container {
            max-width: 760px;
            padding-left: 24px;
            padding-right: 24px;
          }

          .savings-workspace,
          .savings-workspace.has-result {
            grid-template-columns: 1fr;
            max-width: none;
          }

          .savings-mode-switch {
            max-width: none;
          }
        }

        @media (max-width: 600px) {
          .savings-page-container {
            padding: 22px 16px 48px;
          }
        }

        @media (max-width: 380px) {
          .savings-page-container {
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

function MoneyInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
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
        value={value}
        onChange={(event) =>
          onChange(cleanDecimalInput(event.target.value))
        }
        placeholder={placeholder}
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
  );
}

function SavingsRow({
  label,
  value,
  accent = false,
  strong = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
  strong?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        marginBottom: 14,
      }}
    >
      <span
        style={{
          color: strong ? theme.text : theme.textSecondary,
          fontSize: strong ? 15 : 13,
          fontWeight: strong ? 800 : 400,
          flex: 1,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: accent
            ? theme.primary
            : strong
            ? theme.text
            : theme.textSecondary,
          fontSize: strong ? 19 : 14,
          fontWeight: strong ? 900 : 700,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

const inputLabelStyle = {
  display: "block",
  color: theme.textSecondary,
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 9,
} as const;

const sectionLabelStyle = {
  color: theme.text,
  fontSize: 15,
  fontWeight: 800,
  marginTop: 26,
  marginBottom: 12,
} as const;

const helperTextStyle = {
  color: theme.textMuted,
  fontSize: 11,
  lineHeight: "17px",
  marginTop: 10,
  marginBottom: 0,
} as const;

const errorCardStyle = {
  backgroundColor: `${theme.danger}14`,
  border: `1px solid ${theme.danger}55`,
  borderRadius: 13,
  padding: "11px 13px",
  marginTop: 16,
} as const;

const errorTextStyle = {
  color: theme.danger,
  fontSize: 12,
  lineHeight: "18px",
} as const;

const dividerStyle = {
  height: 1,
  backgroundColor: theme.divider,
  marginBottom: 16,
} as const;

const progressTextStyle = {
  color: theme.textMuted,
  fontSize: 10,
  fontWeight: 700,
} as const;

function cleanDecimalInput(value: string) {
  let cleaned = value.replace(/[^0-9.]/g, "");

  const firstDecimal = cleaned.indexOf(".");

  if (firstDecimal !== -1) {
    cleaned =
      cleaned.slice(0, firstDecimal + 1) +
      cleaned
        .slice(firstDecimal + 1)
        .replace(/\./g, "");
  }

  return cleaned;
}

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) {
    return "$0.00";
  }

  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) {
    return "0%";
  }

  return `${Math.round(value * 10) / 10}%`;
}

function formatDuration(months: number) {
  if (!Number.isFinite(months)) {
    return "0 months";
  }

  const totalMonths = Math.max(0, Math.ceil(months));

  if (totalMonths < 12) {
    return `${totalMonths} ${
      totalMonths === 1 ? "month" : "months"
    }`;
  }

  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  if (remainingMonths === 0) {
    return `${years} ${years === 1 ? "year" : "years"}`;
  }

  return `${years} ${
    years === 1 ? "year" : "years"
  }, ${remainingMonths} ${
    remainingMonths === 1 ? "month" : "months"
  }`;
}