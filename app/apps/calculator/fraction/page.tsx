"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Operation = "+" | "−" | "×" | "÷";

type FractionValue = {
  numerator: number;
  denominator: number;
};

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

export default function FractionCalculatorPage() {
  const [wholeA, setWholeA] = useState("");
  const [numeratorA, setNumeratorA] = useState("");
  const [denominatorA, setDenominatorA] = useState("");

  const [wholeB, setWholeB] = useState("");
  const [numeratorB, setNumeratorB] = useState("");
  const [denominatorB, setDenominatorB] = useState("");

  const [operation, setOperation] =
    useState<Operation>("+");

  const parsedA = useMemo(
    () =>
      parseMixedFraction(
        wholeA,
        numeratorA,
        denominatorA
      ),
    [wholeA, numeratorA, denominatorA]
  );

  const parsedB = useMemo(
    () =>
      parseMixedFraction(
        wholeB,
        numeratorB,
        denominatorB
      ),
    [wholeB, numeratorB, denominatorB]
  );

  const result = useMemo(() => {
    if (!parsedA || !parsedB) {
      return null;
    }

    let calculated: FractionValue | null =
      null;

    if (operation === "+") {
      calculated = {
        numerator:
          parsedA.numerator *
            parsedB.denominator +
          parsedB.numerator *
            parsedA.denominator,

        denominator:
          parsedA.denominator *
          parsedB.denominator,
      };
    }

    if (operation === "−") {
      calculated = {
        numerator:
          parsedA.numerator *
            parsedB.denominator -
          parsedB.numerator *
            parsedA.denominator,

        denominator:
          parsedA.denominator *
          parsedB.denominator,
      };
    }

    if (operation === "×") {
      calculated = {
        numerator:
          parsedA.numerator *
          parsedB.numerator,

        denominator:
          parsedA.denominator *
          parsedB.denominator,
      };
    }

    if (operation === "÷") {
      if (parsedB.numerator === 0) {
        return {
          error: "Cannot divide by zero.",
          fraction: null,
        };
      }

      calculated = {
        numerator:
          parsedA.numerator *
          parsedB.denominator,

        denominator:
          parsedA.denominator *
          parsedB.numerator,
      };
    }

    if (!calculated) {
      return null;
    }

    return {
      error: "",
      fraction:
        simplifyFraction(calculated),
    };
  }, [parsedA, parsedB, operation]);

  function clearAll() {
    setWholeA("");
    setNumeratorA("");
    setDenominatorA("");

    setWholeB("");
    setNumeratorB("");
    setDenominatorB("");

    setOperation("+");
  }

  const hasInput =
    wholeA.length > 0 ||
    numeratorA.length > 0 ||
    denominatorA.length > 0 ||
    wholeB.length > 0 ||
    numeratorB.length > 0 ||
    denominatorB.length > 0;

  const decimalResult =
    result?.fraction
      ? result.fraction.numerator /
        result.fraction.denominator
      : null;

  const mixedResult =
    result?.fraction
      ? toMixedNumber(
          result.fraction
        )
      : null;

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor:
          theme.background,
        color: theme.text,
      }}
    >
      <div className="fraction-page-container">
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
            justifyContent:
              "space-between",
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
                fontSize:
                  "clamp(33px, 4vw, 44px)",
                fontWeight: 800,
                letterSpacing: -1,
                margin: "8px 0 0",
              }}
            >
              Fractions
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
              flexShrink: 0,
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
              MATH
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
            maxWidth: 680,
          }}
        >
          Add, subtract, multiply and divide
          fractions or mixed numbers.
        </p>

        {/* WORKSPACE */}

        <div className="fraction-workspace">
          {/* LEFT - CALCULATOR */}

          <section
            style={{
              backgroundColor:
                theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: 26,
              padding: 22,
            }}
          >
            <h2
              style={
                fractionHeadingStyle
              }
            >
              First fraction
            </h2>

            <FractionInput
              whole={wholeA}
              numerator={numeratorA}
              denominator={
                denominatorA
              }
              onWholeChange={
                setWholeA
              }
              onNumeratorChange={
                setNumeratorA
              }
              onDenominatorChange={
                setDenominatorA
              }
            />

            {/* OPERATION */}

            <h2
              style={
                sectionLabelStyle
              }
            >
              Operation
            </h2>

            <div className="fraction-operation-grid">
              {(
                [
                  "+",
                  "−",
                  "×",
                  "÷",
                ] as Operation[]
              ).map((item) => {
                const active =
                  operation ===
                  item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setOperation(
                        item
                      )
                    }
                    style={{
                      minHeight: 52,
                      backgroundColor:
                        active
                          ? theme.primarySoft
                          : theme.surface,

                      border: `1px solid ${
                        active
                          ? theme.primary
                          : theme.border
                      }`,

                      borderRadius: 15,

                      color: active
                        ? theme.primary
                        : theme.textMuted,

                      fontSize: 24,
                      fontWeight: 700,
                      cursor:
                        "pointer",
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            {/* SECOND FRACTION */}

            <h2
              style={{
                ...fractionHeadingStyle,
                marginTop: 26,
              }}
            >
              Second fraction
            </h2>

            <FractionInput
              whole={wholeB}
              numerator={numeratorB}
              denominator={
                denominatorB
              }
              onWholeChange={
                setWholeB
              }
              onNumeratorChange={
                setNumeratorB
              }
              onDenominatorChange={
                setDenominatorB
              }
            />

            {/* ERRORS */}

            {hasInput &&
              (!parsedA ||
                !parsedB) && (
                <div
                  style={
                    errorCardStyle
                  }
                >
                  <span
                    style={
                      errorTextStyle
                    }
                  >
                    Enter valid
                    fractions.
                    Denominators must
                    be greater than
                    zero.
                  </span>
                </div>
              )}

            {result?.error ? (
              <div
                style={
                  errorCardStyle
                }
              >
                <span
                  style={
                    errorTextStyle
                  }
                >
                  {result.error}
                </span>
              </div>
            ) : null}

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

          {/* RIGHT - RESULTS */}

          <div className="fraction-results-column">
            {result?.fraction &&
            mixedResult ? (
              <>
                <section
                  style={{
                    backgroundColor:
                      theme.card,
                    border: `1px solid ${theme.primary}`,
                    borderRadius: 26,
                    padding: 26,
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
                    SIMPLIFIED RESULT
                  </div>

                  <div
                    style={{
                      color:
                        theme.text,
                      fontSize:
                        "clamp(34px, 5vw, 52px)",
                      fontWeight: 800,
                      letterSpacing: -1,
                      overflowWrap:
                        "anywhere",
                    }}
                  >
                    {formatMixedNumber(
                      mixedResult
                    )}
                  </div>

                  <div
                    style={{
                      color:
                        theme.textMuted,
                      fontSize: 13,
                      marginTop: 8,
                    }}
                  >
                    {formatImproperFraction(
                      result.fraction
                    )}
                  </div>
                </section>

                <section
                  style={{
                    backgroundColor:
                      theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 24,
                    padding: 22,
                  }}
                >
                  <h2
                    style={{
                      color:
                        theme.text,
                      fontSize: 16,
                      fontWeight: 800,
                      margin:
                        "0 0 20px 0",
                    }}
                  >
                    Result details
                  </h2>

                  <ResultRow
                    label="Mixed number"
                    value={formatMixedNumber(
                      mixedResult
                    )}
                  />

                  <ResultRow
                    label="Improper fraction"
                    value={formatImproperFraction(
                      result.fraction
                    )}
                  />

                  <div
                    style={{
                      height: 1,
                      backgroundColor:
                        theme.divider,
                      marginBottom: 16,
                    }}
                  />

                  <ResultRow
                    label="Decimal"
                    value={
                      decimalResult !==
                      null
                        ? formatDecimal(
                            decimalResult
                          )
                        : "0"
                    }
                    strong
                  />
                </section>
              </>
            ) : (
              <section
                className="fraction-empty-result"
                style={{
                  backgroundColor:
                    theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 26,
                  padding: 28,
                }}
              >
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 17,
                    backgroundColor:
                      theme.primarySoft,
                    border: `1px solid ${theme.border}`,
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    color:
                      theme.primary,
                    fontSize: 25,
                    fontWeight: 900,
                  }}
                >
                  ½
                </div>

                <h2
                  style={{
                    color:
                      theme.text,
                    fontSize: 20,
                    fontWeight: 800,
                    margin:
                      "22px 0 8px",
                  }}
                >
                  Your fraction result
                </h2>

                <p
                  style={{
                    color:
                      theme.textSecondary,
                    fontSize: 13,
                    lineHeight:
                      "21px",
                    margin: 0,
                    maxWidth: 430,
                  }}
                >
                  Enter two fractions or
                  mixed numbers and choose
                  an operation to see the
                  simplified result,
                  improper fraction and
                  decimal value.
                </p>
              </section>
            )}

            {/* INFO */}

            <section
              style={{
                backgroundColor:
                  theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 20,
                padding: 19,
              }}
            >
              <h2
                style={{
                  color:
                    theme.textSecondary,
                  fontSize: 13,
                  fontWeight: 800,
                  margin:
                    "0 0 7px 0",
                }}
              >
                Fraction simplification
              </h2>

              <p
                style={{
                  color:
                    theme.textMuted,
                  fontSize: 11,
                  lineHeight:
                    "18px",
                  margin: 0,
                }}
              >
                Bodolvo automatically
                reduces the result to
                lowest terms and converts
                improper fractions into
                mixed numbers when
                possible.
              </p>
            </section>
          </div>
        </div>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        .fraction-page-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 28px 32px 60px;
        }

        .fraction-workspace {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(0, 1fr);
          gap: 18px;
          align-items: start;
        }

        .fraction-results-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 0;
        }

        .fraction-operation-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 8px;
        }

        .fraction-empty-result {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .fraction-input-layout {
          display: grid;
          grid-template-columns:
            minmax(120px, 0.7fr)
            minmax(0, 1.3fr);
          gap: 14px;
          align-items: center;
        }

        @media (max-width: 900px) {
          .fraction-page-container {
            max-width: 760px;
            padding-left: 24px;
            padding-right: 24px;
          }

          .fraction-workspace {
            grid-template-columns: 1fr;
          }

          .fraction-empty-result {
            min-height: auto;
          }
        }

        @media (max-width: 600px) {
          .fraction-page-container {
            padding:
              22px 16px 48px;
          }

          .fraction-input-layout {
            grid-template-columns:
              minmax(90px, 0.8fr)
              minmax(0, 1.2fr);
            gap: 10px;
          }
        }

        @media (max-width: 430px) {
          .fraction-operation-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 380px) {
          .fraction-page-container {
            padding-left: 12px;
            padding-right: 12px;
          }

          .fraction-input-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function FractionInput({
  whole,
  numerator,
  denominator,
  onWholeChange,
  onNumeratorChange,
  onDenominatorChange,
}: {
  whole: string;
  numerator: string;
  denominator: string;
  onWholeChange: (
    value: string
  ) => void;
  onNumeratorChange: (
    value: string
  ) => void;
  onDenominatorChange: (
    value: string
  ) => void;
}) {
  return (
    <div className="fraction-input-layout">
      {/* WHOLE */}

      <div>
        <div
          style={
            miniLabelStyle
          }
        >
          Whole
        </div>

        <div
          style={
            smallInputShellStyle
          }
        >
          <input
            type="text"
            inputMode="numeric"
            value={whole}
            onChange={(event) =>
              onWholeChange(
                cleanIntegerInput(
                  event.target
                    .value,
                  true
                )
              )
            }
            placeholder="0"
            style={
              smallInputStyle
            }
          />
        </div>
      </div>

      {/* FRACTION */}

      <div
        style={{
          minWidth: 0,
          display: "flex",
          flexDirection:
            "column",
          gap: 8,
        }}
      >
        <div>
          <div
            style={
              miniLabelStyle
            }
          >
            Numerator
          </div>

          <div
            style={
              smallInputShellStyle
            }
          >
            <input
              type="text"
              inputMode="numeric"
              value={numerator}
              onChange={(event) =>
                onNumeratorChange(
                  cleanIntegerInput(
                    event.target
                      .value,
                    false
                  )
                )
              }
              placeholder="0"
              style={
                smallInputStyle
              }
            />
          </div>
        </div>

        <div
          style={{
            height: 1,
            backgroundColor:
              theme.textMuted,
            margin:
              "0 6px",
          }}
        />

        <div>
          <div
            style={
              miniLabelStyle
            }
          >
            Denominator
          </div>

          <div
            style={
              smallInputShellStyle
            }
          >
            <input
              type="text"
              inputMode="numeric"
              value={
                denominator
              }
              onChange={(event) =>
                onDenominatorChange(
                  cleanIntegerInput(
                    event.target
                      .value,
                    false
                  )
                )
              }
              placeholder="1"
              style={
                smallInputStyle
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultRow({
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

          fontSize:
            strong ? 15 : 13,

          fontWeight:
            strong ? 800 : 400,

          flex: 1,
          minWidth: 0,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: strong
            ? theme.text
            : theme.textSecondary,

          fontSize:
            strong ? 19 : 14,

          fontWeight:
            strong ? 900 : 700,

          textAlign: "right",
          overflowWrap:
            "anywhere",
        }}
      >
        {value}
      </span>
    </div>
  );
}

const fractionHeadingStyle = {
  color: theme.text,
  fontSize: 15,
  fontWeight: 800,
  margin: "0 0 14px 0",
} as const;

const sectionLabelStyle = {
  color: theme.text,
  fontSize: 15,
  fontWeight: 800,
  marginTop: 26,
  marginBottom: 12,
} as const;

const miniLabelStyle = {
  color: theme.textMuted,
  fontSize: 10,
  fontWeight: 700,
  marginBottom: 7,
} as const;

const smallInputShellStyle = {
  minHeight: 56,
  backgroundColor:
    theme.inputBackground,
  border:
    `1px solid ${theme.inputBorder}`,
  borderRadius: 15,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 12px",
} as const;

const smallInputStyle = {
  width: "100%",
  color: theme.text,
  background:
    "transparent",
  border: "none",
  outline: "none",
  fontSize: 19,
  fontWeight: 700,
  textAlign: "center",
  padding: "12px 0",
} as const;

const errorCardStyle = {
  backgroundColor:
    `${theme.danger}14`,
  border:
    `1px solid ${theme.danger}55`,
  borderRadius: 13,
  padding: "11px 13px",
  marginTop: 16,
} as const;

const errorTextStyle = {
  color: theme.danger,
  fontSize: 12,
  lineHeight: "18px",
} as const;

function parseMixedFraction(
  wholeText: string,
  numeratorText: string,
  denominatorText: string
): FractionValue | null {
  const whole =
    wholeText.trim() === ""
      ? 0
      : Number(wholeText);

  const numerator =
    numeratorText.trim() === ""
      ? 0
      : Number(numeratorText);

  const denominator =
    denominatorText.trim() === ""
      ? 1
      : Number(denominatorText);

  if (
    !Number.isInteger(whole) ||
    !Number.isInteger(numerator) ||
    !Number.isInteger(denominator) ||
    denominator <= 0 ||
    numerator < 0
  ) {
    return null;
  }

  const sign =
    whole < 0 ? -1 : 1;

  const absoluteWhole =
    Math.abs(whole);

  return {
    numerator:
      sign *
      (
        absoluteWhole *
          denominator +
        numerator
      ),

    denominator,
  };
}

function simplifyFraction(
  value: FractionValue
): FractionValue {
  if (value.numerator === 0) {
    return {
      numerator: 0,
      denominator: 1,
    };
  }

  let numerator =
    value.numerator;

  let denominator =
    value.denominator;

  if (denominator < 0) {
    numerator *= -1;
    denominator *= -1;
  }

  const divisor =
    gcd(
      Math.abs(numerator),
      Math.abs(denominator)
    );

  return {
    numerator:
      numerator /
      divisor,

    denominator:
      denominator /
      divisor,
  };
}

function gcd(
  a: number,
  b: number
) {
  let x = a;
  let y = b;

  while (y !== 0) {
    const remainder =
      x % y;

    x = y;
    y = remainder;
  }

  return Math.abs(x) || 1;
}

function toMixedNumber(
  fraction: FractionValue
) {
  const sign =
    fraction.numerator < 0
      ? -1
      : 1;

  const absoluteNumerator =
    Math.abs(
      fraction.numerator
    );

  const whole =
    Math.floor(
      absoluteNumerator /
        fraction.denominator
    );

  const remainder =
    absoluteNumerator %
    fraction.denominator;

  return {
    sign,
    whole,
    numerator: remainder,
    denominator:
      fraction.denominator,
  };
}

function formatMixedNumber(
  value: {
    sign: number;
    whole: number;
    numerator: number;
    denominator: number;
  }
) {
  const prefix =
    value.sign < 0
      ? "−"
      : "";

  if (
    value.numerator === 0
  ) {
    return `${prefix}${value.whole}`;
  }

  if (
    value.whole === 0
  ) {
    return `${prefix}${value.numerator}/${value.denominator}`;
  }

  return `${prefix}${value.whole} ${value.numerator}/${value.denominator}`;
}

function formatImproperFraction(
  value: FractionValue
) {
  return `${value.numerator}/${value.denominator}`;
}

function formatDecimal(
  value: number
) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  return String(
    Math.round(
      (value +
        Number.EPSILON) *
        100000000
    ) /
      100000000
  );
}

function cleanIntegerInput(
  value: string,
  allowNegative: boolean
) {
  let cleaned =
    value.replace(
      allowNegative
        ? /[^0-9-]/g
        : /[^0-9]/g,
      ""
    );

  if (allowNegative) {
    const negative =
      cleaned.startsWith(
        "-"
      );

    cleaned =
      cleaned.replace(
        /-/g,
        ""
      );

    if (negative) {
      cleaned =
        `-${cleaned}`;
    }
  }

  return cleaned;
}