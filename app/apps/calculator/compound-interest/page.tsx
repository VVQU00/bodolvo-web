"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CompoundFrequency =
  | "daily"
  | "monthly"
  | "quarterly"
  | "annually";

type ContributionFrequency =
  | "monthly"
  | "annually";

const frequencyMap: Record<CompoundFrequency, number> = {
  daily: 365,
  monthly: 12,
  quarterly: 4,
  annually: 1,
};

const theme = {
  background: "#FFFFFF",
  surface: "#FFFFFF",
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

export default function CompoundInterestCalculatorPage() {
  const [initialAmount, setInitialAmount] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [years, setYears] = useState("");

  const [compoundFrequency, setCompoundFrequency] =
    useState<CompoundFrequency>("monthly");

  const [contribution, setContribution] = useState("0");

  const [contributionFrequency, setContributionFrequency] =
    useState<ContributionFrequency>("monthly");

  const initialValue = Number(initialAmount);
  const rateValue = Number(annualRate);
  const yearsValue = Number(years);
  const contributionValue = Number(contribution);

  const isValid =
    initialAmount.trim() !== "" &&
    annualRate.trim() !== "" &&
    years.trim() !== "" &&
    Number.isFinite(initialValue) &&
    initialValue >= 0 &&
    Number.isFinite(rateValue) &&
    rateValue >= 0 &&
    Number.isFinite(yearsValue) &&
    yearsValue > 0 &&
    Number.isFinite(contributionValue) &&
    contributionValue >= 0;

  const results = useMemo(() => {
    if (!isValid) {
      return null;
    }

    const compoundsPerYear =
      frequencyMap[compoundFrequency];

    const periodicRate =
      rateValue / 100 / compoundsPerYear;

    const totalCompoundPeriods =
      compoundsPerYear * yearsValue;

    let balance = initialValue;

    const contributionPerCompoundPeriod =
      contributionFrequency === "monthly"
        ? (contributionValue * 12) / compoundsPerYear
        : contributionValue / compoundsPerYear;

    let totalContributions = initialValue;

    for (
      let period = 0;
      period < Math.round(totalCompoundPeriods);
      period++
    ) {
      balance *= 1 + periodicRate;

      balance += contributionPerCompoundPeriod;

      totalContributions +=
        contributionPerCompoundPeriod;
    }

    const interestEarned =
      balance - totalContributions;

    return {
      finalBalance: balance,
      totalContributions,
      interestEarned,
    };
  }, [
    initialValue,
    rateValue,
    yearsValue,
    contributionValue,
    compoundFrequency,
    contributionFrequency,
    isValid,
  ]);

  function clearAll() {
    setInitialAmount("");
    setAnnualRate("");
    setYears("");
    setCompoundFrequency("monthly");
    setContribution("0");
    setContributionFrequency("monthly");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      <div className="compound-page-container">
        {/* BACK */}

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

        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 16,
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
                fontSize: "clamp(30px, 4vw, 42px)",
                fontWeight: 800,
                letterSpacing: -1.2,
                margin: "8px 0 0",
              }}
            >
              Compound Interest
            </h1>
          </div>

          <div
            style={{
              backgroundColor: theme.primarySoft,
              border: `1px solid ${theme.border}`,
              borderRadius: 999,
              padding: "6px 11px",
              marginBottom: 3,
              flexShrink: 0,
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
            marginBottom: 28,
            maxWidth: 620,
          }}
        >
          Estimate how your money can grow with compound interest
          and recurring contributions.
        </p>

        {/* DESKTOP WORKSPACE */}

        <div className="compound-workspace">
          {/* LEFT - INPUTS */}

          <section
            style={{
              backgroundColor: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: 26,
              padding: 22,
            }}
          >
            <label style={inputLabelStyle}>
              Starting amount
            </label>

            <div
              style={{
                ...inputShellStyle,
                minHeight: 68,
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
                value={initialAmount}
                onChange={(event) =>
                  setInitialAmount(
                    cleanDecimalInput(
                      event.target.value
                    )
                  )
                }
                placeholder="10000"
                style={{
                  ...inputStyle,
                  fontSize: 25,
                }}
              />
            </div>

            {/* RATE */}

            <h2 style={sectionLabelStyle}>
              Annual interest rate
            </h2>

            <div style={inputShellStyle}>
              <input
                type="text"
                inputMode="decimal"
                value={annualRate}
                onChange={(event) =>
                  setAnnualRate(
                    cleanDecimalInput(
                      event.target.value
                    )
                  )
                }
                placeholder="7"
                style={inputStyle}
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

            {/* YEARS */}

            <h2 style={sectionLabelStyle}>
              Investment period
            </h2>

            <div style={inputShellStyle}>
              <input
                type="text"
                inputMode="decimal"
                value={years}
                onChange={(event) =>
                  setYears(
                    cleanDecimalInput(
                      event.target.value
                    )
                  )
                }
                placeholder="10"
                style={inputStyle}
              />

              <span
                style={{
                  color: theme.textMuted,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                years
              </span>
            </div>

            {/* COMPOUNDING */}

            <h2 style={sectionLabelStyle}>
              Compounding frequency
            </h2>

            <div className="compound-frequency-grid">
              <FrequencyButton
                label="Daily"
                active={compoundFrequency === "daily"}
                onClick={() =>
                  setCompoundFrequency("daily")
                }
              />

              <FrequencyButton
                label="Monthly"
                active={compoundFrequency === "monthly"}
                onClick={() =>
                  setCompoundFrequency("monthly")
                }
              />

              <FrequencyButton
                label="Quarterly"
                active={compoundFrequency === "quarterly"}
                onClick={() =>
                  setCompoundFrequency("quarterly")
                }
              />

              <FrequencyButton
                label="Annually"
                active={compoundFrequency === "annually"}
                onClick={() =>
                  setCompoundFrequency("annually")
                }
              />
            </div>

            {/* CONTRIBUTION */}

            <h2 style={sectionLabelStyle}>
              Recurring contribution
            </h2>

            <p
              style={{
                color: theme.textMuted,
                fontSize: 11,
                lineHeight: "17px",
                marginTop: -5,
                marginBottom: 10,
              }}
            >
              Optional. Leave at 0 if you only want to calculate
              growth on the starting balance.
            </p>

            <div
              style={{
                ...inputShellStyle,
                minHeight: 68,
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
                value={contribution}
                onChange={(event) =>
                  setContribution(
                    cleanDecimalInput(
                      event.target.value
                    )
                  )
                }
                placeholder="0"
                style={{
                  ...inputStyle,
                  fontSize: 25,
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: 8,
                marginTop: 10,
              }}
            >
              <FrequencyButton
                label="Monthly"
                active={
                  contributionFrequency ===
                  "monthly"
                }
                onClick={() =>
                  setContributionFrequency(
                    "monthly"
                  )
                }
              />

              <FrequencyButton
                label="Annually"
                active={
                  contributionFrequency ===
                  "annually"
                }
                onClick={() =>
                  setContributionFrequency(
                    "annually"
                  )
                }
              />
            </div>

            {/* ERROR */}

            {!isValid &&
              (initialAmount.length > 0 ||
                annualRate.length > 0 ||
                years.length > 0) && (
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
                      lineHeight: "18px",
                    }}
                  >
                    Enter a valid starting amount, interest rate,
                    investment period and contribution.
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

          {/* RIGHT - RESULTS */}

          <div className="compound-results-column">
            {results ? (
              <>
                <section
                  style={{
                    backgroundColor: theme.card,
                    border: `1px solid ${theme.primary}`,
                    borderRadius: 26,
                    padding: 26,
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
                    ESTIMATED FUTURE VALUE
                  </div>

                  <div
                    style={{
                      color: theme.text,
                      fontSize:
                        "clamp(34px, 5vw, 52px)",
                      fontWeight: 800,
                      letterSpacing: -1.5,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {formatCurrency(
                      results.finalBalance
                    )}
                  </div>

                  <div
                    style={{
                      color: theme.textMuted,
                      fontSize: 12,
                      marginTop: 8,
                    }}
                  >
                    after{" "}
                    {formatNumber(
                      yearsValue
                    )}{" "}
                    {yearsValue === 1
                      ? "year"
                      : "years"}
                  </div>
                </section>

                <section
                  style={{
                    backgroundColor: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 24,
                    padding: 22,
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
                    Growth breakdown
                  </h2>

                  <BreakdownRow
                    label="Starting amount"
                    value={formatCurrency(
                      initialValue
                    )}
                  />

                  <BreakdownRow
                    label="Total contributions"
                    value={formatCurrency(
                      results.totalContributions
                    )}
                  />

                  <BreakdownRow
                    label="Interest earned"
                    value={formatCurrency(
                      results.interestEarned
                    )}
                    accent
                  />

                  <div
                    style={{
                      height: 1,
                      backgroundColor:
                        theme.divider,
                      marginBottom: 14,
                    }}
                  />

                  <BreakdownRow
                    label="Future value"
                    value={formatCurrency(
                      results.finalBalance
                    )}
                    strong
                  />
                </section>
              </>
            ) : (
              <section
                className="compound-empty-result"
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 26,
                  padding: 28,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    backgroundColor:
                      theme.primarySoft,
                    border: `1px solid ${theme.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: theme.primary,
                    fontSize: 24,
                    fontWeight: 900,
                  }}
                >
                  ↗
                </div>

                <h2
                  style={{
                    color: theme.text,
                    fontSize: 20,
                    fontWeight: 800,
                    margin: "22px 0 8px",
                  }}
                >
                  Your growth estimate
                </h2>

                <p
                  style={{
                    color: theme.textSecondary,
                    fontSize: 13,
                    lineHeight: "21px",
                    margin: 0,
                    maxWidth: 430,
                  }}
                >
                  Enter your starting amount, annual interest rate,
                  investment period and optional recurring contribution
                  to see the estimated future value.
                </p>
              </section>
            )}

            <section
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 22,
                padding: 21,
              }}
            >
              <h2
                style={{
                  color: theme.text,
                  fontSize: 15,
                  fontWeight: 800,
                  margin: "0 0 9px 0",
                }}
              >
                Compound interest
              </h2>

              <p
                style={{
                  color: theme.textSecondary,
                  fontSize: 12,
                  lineHeight: "19px",
                  margin: 0,
                }}
              >
                Interest is added back into the balance, allowing
                future interest to grow on both your original money
                and prior interest. This is an estimate and does not
                account for taxes, fees or changing rates.
              </p>
            </section>
          </div>
        </div>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        .compound-page-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 28px 32px 60px;
        }

        .compound-workspace {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(0, 1fr);
          gap: 18px;
          align-items: start;
        }

        .compound-results-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 0;
        }

        .compound-frequency-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 8px;
        }

        .compound-empty-result {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        @media (max-width: 900px) {
          .compound-page-container {
            max-width: 760px;
            padding-left: 24px;
            padding-right: 24px;
          }

          .compound-workspace {
            grid-template-columns: 1fr;
          }

          .compound-empty-result {
            min-height: auto;
          }
        }

        @media (max-width: 600px) {
          .compound-page-container {
            padding: 22px 16px 48px;
          }

          .compound-frequency-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 380px) {
          .compound-page-container {
            padding-left: 12px;
            padding-right: 12px;
          }
        }
      `}</style>
    </main>
  );
}

function FrequencyButton({
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
        backgroundColor: active
          ? theme.primarySoft
          : theme.surface,
        border: `1px solid ${
          active
            ? theme.primary
            : theme.border
        }`,
        borderRadius: 14,
        color: active
          ? theme.primary
          : theme.textMuted,
        fontSize: 12,
        fontWeight: 800,
        cursor: "pointer",
        padding: "0 10px",
      }}
    >
      {label}
    </button>
  );
}

function BreakdownRow({
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
          color: strong
            ? theme.text
            : theme.textSecondary,
          fontSize: strong ? 15 : 13,
          fontWeight: strong ? 800 : 400,
          flex: 1,
          minWidth: 0,
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
          overflowWrap: "anywhere",
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

const inputShellStyle = {
  minHeight: 60,
  backgroundColor: theme.inputBackground,
  border: `1px solid ${theme.inputBorder}`,
  borderRadius: 17,
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
} as const;

const inputStyle = {
  flex: 1,
  minWidth: 0,
  color: theme.text,
  background: "transparent",
  border: "none",
  outline: "none",
  fontSize: 20,
  fontWeight: 700,
  padding: "14px 0",
} as const;

function cleanDecimalInput(
  value: string
) {
  let cleaned = value.replace(
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
        .slice(firstDecimal + 1)
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

  return `$${value.toFixed(2)}`;
}

function formatNumber(
  value: number
) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  const rounded =
    Math.round(
      (value + Number.EPSILON) *
        100
    ) / 100;

  return String(rounded);
}