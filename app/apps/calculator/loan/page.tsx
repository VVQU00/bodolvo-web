"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type TermUnit = "years" | "months";

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

export default function LoanCalculatorPage() {
  const [principal, setPrincipal] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [term, setTerm] = useState("");
  const [termUnit, setTermUnit] =
    useState<TermUnit>("years");

  const principalValue = Number(principal);
  const rateValue = Number(annualRate);
  const termValue = Number(term);

  const months =
    termUnit === "years"
      ? termValue * 12
      : termValue;

  const isValid =
    principal.trim() !== "" &&
    annualRate.trim() !== "" &&
    term.trim() !== "" &&
    Number.isFinite(principalValue) &&
    principalValue > 0 &&
    Number.isFinite(rateValue) &&
    rateValue >= 0 &&
    Number.isFinite(termValue) &&
    termValue > 0 &&
    months > 0;

  const results = useMemo(() => {
    if (!isValid) {
      return null;
    }

    const monthlyRate =
      rateValue / 100 / 12;

    let monthlyPayment = 0;

    if (monthlyRate === 0) {
      monthlyPayment =
        principalValue / months;
    } else {
      monthlyPayment =
        principalValue *
        (
          monthlyRate *
          Math.pow(
            1 + monthlyRate,
            months
          )
        ) /
        (
          Math.pow(
            1 + monthlyRate,
            months
          ) - 1
        );
    }

    const totalPaid =
      monthlyPayment * months;

    const totalInterest =
      totalPaid - principalValue;

    return {
      monthlyPayment,
      totalPaid,
      totalInterest,
      months,
    };
  }, [
    principalValue,
    rateValue,
    termValue,
    termUnit,
    months,
    isValid,
  ]);

  function clearAll() {
    setPrincipal("");
    setAnnualRate("");
    setTerm("");
    setTermUnit("years");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor:
          theme.background,
        color: theme.text,
      }}
    >
      <div className="loan-page-container">
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
            justifyContent:
              "space-between",
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
              Loan
            </h1>
          </div>

          <div
            style={{
              backgroundColor:
                theme.primarySoft,
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
          Estimate your monthly payment,
          total interest and total amount
          paid.
        </p>

        <div className="loan-workspace">
          <section
            style={{
              backgroundColor: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: 26,
              padding: 22,
            }}
          >
          <label
            style={labelStyle}
          >
            Loan amount
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
              value={principal}
              onChange={(event) =>
                setPrincipal(
                  cleanDecimalInput(
                    event.target.value
                  )
                )
              }
              placeholder="25000"
              style={inputStyle}
            />
          </div>

          <h2
            style={sectionLabelStyle}
          >
            Annual interest rate
          </h2>

          <div
            style={inputShellStyle}
          >
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
              placeholder="6.5"
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

          <h2
            style={sectionLabelStyle}
          >
            Loan term
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1.25fr",
              gap: 10,
            }}
          >
            <div
              style={inputShellStyle}
            >
              <input
                type="text"
                inputMode="decimal"
                value={term}
                onChange={(event) =>
                  setTerm(
                    cleanDecimalInput(
                      event.target.value
                    )
                  )
                }
                placeholder="5"
                style={{
                  ...inputStyle,
                  textAlign: "center",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 4,
                backgroundColor:
                  theme.surfaceSecondary,
                borderRadius: 17,
                padding: 4,
                border: `1px solid ${theme.border}`,
              }}
            >
              <TermButton
                label="Years"
                active={
                  termUnit === "years"
                }
                onClick={() =>
                  setTermUnit("years")
                }
              />

              <TermButton
                label="Months"
                active={
                  termUnit === "months"
                }
                onClick={() =>
                  setTermUnit("months")
                }
              />
            </div>
          </div>

          {!isValid &&
            (
              principal.length > 0 ||
              annualRate.length > 0 ||
              term.length > 0
            ) && (
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
                  Enter a valid loan
                  amount, interest rate
                  and term.
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

          <div className="loan-results-column">
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
                  color: theme.primary,
                  fontSize: 9,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 10,
                }}
              >
                ESTIMATED MONTHLY
                PAYMENT
              </div>

              <div
                style={{
                  color: theme.text,
                  fontSize:
                    "clamp(34px, 9vw, 44px)",
                  fontWeight: 800,
                  letterSpacing: -1.5,
                  overflowWrap:
                    "anywhere",
                }}
              >
                {formatCurrency(
                  results.monthlyPayment
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
                for{" "}
                {formatNumber(
                  results.months
                )}{" "}
                months
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
                  marginTop: 0,
                  marginBottom: 20,
                }}
              >
                Loan breakdown
              </h2>

              <BreakdownRow
                label="Principal"
                value={formatCurrency(
                  principalValue
                )}
              />

              <BreakdownRow
                label="Interest rate"
                value={`${formatNumber(
                  rateValue
                )}%`}
              />

              <BreakdownRow
                label="Loan term"
                value={`${formatNumber(
                  results.months
                )} months`}
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

              <BreakdownRow
                label="Total interest"
                value={formatCurrency(
                  results.totalInterest
                )}
                accent
              />

              <BreakdownRow
                label="Total paid"
                value={formatCurrency(
                  results.totalPaid
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
                How this is calculated
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
                This uses the standard
                amortized loan payment
                formula with a fixed
                monthly payment. Actual
                lender payments can differ
                if fees, insurance, taxes
                or other charges are
                included.
              </p>
            </section>
              </>
            )}

            {!results && (
              <section className="loan-empty-result">
                <div className="loan-empty-mark">$</div>

                <h2
                  style={{
                    color: theme.text,
                    fontSize: 20,
                    fontWeight: 800,
                    margin: "22px 0 8px",
                  }}
                >
                  Your loan estimate
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
                  Enter the loan amount, annual interest rate and term
                  to see the estimated monthly payment and full loan
                  breakdown.
                </p>
              </section>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        .loan-page-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 28px 32px 60px;
        }

        .loan-workspace {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 18px;
          align-items: start;
        }

        .loan-results-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 0;
        }

        .loan-results-column > section {
          margin-top: 0 !important;
        }

        .loan-empty-result {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: ${theme.surface};
          border: 1px solid ${theme.border};
          border-radius: 26px;
          padding: 28px;
        }

        .loan-empty-mark {
          width: 54px;
          height: 54px;
          border-radius: 17px;
          background: ${theme.primarySoft};
          border: 1px solid ${theme.border};
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${theme.primary};
          font-size: 25px;
          font-weight: 900;
        }

        @media (max-width: 900px) {
          .loan-page-container {
            max-width: 760px;
            padding-left: 24px;
            padding-right: 24px;
          }

          .loan-workspace {
            grid-template-columns: 1fr;
          }

          .loan-empty-result {
            min-height: auto;
          }
        }

        @media (max-width: 600px) {
          .loan-page-container {
            padding: 22px 16px 48px;
          }
        }

        @media (max-width: 430px) {
          .loan-page-container {
            padding-left: 14px;
            padding-right: 14px;
          }
        }
      `}</style>
    </main>
  );
}

function TermButton({
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
        minHeight: 50,
        borderRadius: 13,
        border: active
          ? `1px solid ${theme.primary}`
          : "1px solid transparent",
        backgroundColor: active
          ? theme.primary
          : "transparent",
        color: active
          ? "#FFFFFF"
          : theme.textSecondary,
        fontSize: 12,
        fontWeight: 800,
        cursor: "pointer",
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
        justifyContent:
          "space-between",
        alignItems: "center",
        gap: 15,
        marginBottom: 15,
      }}
    >
      <span
        style={{
          color: strong
            ? theme.text
            : theme.textSecondary,
          fontSize: strong ? 15 : 13,
          fontWeight:
            strong ? 800 : 500,
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
          fontSize: strong ? 18 : 14,
          fontWeight:
            strong ? 900 : 700,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

const labelStyle = {
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
  backgroundColor:
    theme.inputBackground,
  border: `1px solid ${theme.inputBorder}`,
  borderRadius: 17,
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
} as const;

const inputStyle = {
  flex: 1,
  minWidth: 0,
  background: "transparent",
  border: "none",
  outline: "none",
  color: theme.text,
  fontSize: 20,
  fontWeight: 700,
  padding: "14px 0",
} as const;

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
      (value +
        Number.EPSILON) *
        100
    ) / 100;

  return String(rounded);
}