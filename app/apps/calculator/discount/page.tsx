"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const discountPresets = [
  10,
  15,
  20,
  25,
  30,
  40,
  50,
];

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
  success: "#36C98F",
};

export default function DiscountCalculatorPage() {
  const [originalPrice, setOriginalPrice] =
    useState("");

  const [
    discountPercent,
    setDiscountPercent,
  ] = useState("20");

  const [taxPercent, setTaxPercent] =
    useState("0");

  const originalValue =
    Number(originalPrice);

  const discountValue =
    Number(discountPercent);

  const taxValue =
    Number(taxPercent);

  const isValid =
    originalPrice.trim() !== "" &&
    Number.isFinite(originalValue) &&
    originalValue >= 0 &&
    Number.isFinite(discountValue) &&
    discountValue >= 0 &&
    discountValue <= 100 &&
    Number.isFinite(taxValue) &&
    taxValue >= 0;

  const results = useMemo(() => {
    if (!isValid) {
      return null;
    }

    const discountAmount =
      originalValue *
      (discountValue / 100);

    const priceAfterDiscount =
      originalValue -
      discountAmount;

    const taxAmount =
      priceAfterDiscount *
      (taxValue / 100);

    const finalPrice =
      priceAfterDiscount +
      taxAmount;

    const totalSaved =
      originalValue -
      priceAfterDiscount;

    return {
      discountAmount,
      priceAfterDiscount,
      taxAmount,
      finalPrice,
      totalSaved,
    };
  }, [
    originalValue,
    discountValue,
    taxValue,
    isValid,
  ]);

  function clearAll() {
    setOriginalPrice("");
    setDiscountPercent("20");
    setTaxPercent("0");
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
      <div className="discount-page-container">
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
              Discount
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
              EVERYDAY
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
          See how much you save, the price
          after discount, optional tax and
          your final total.
        </p>

        {/* WORKSPACE */}

        <div className="discount-workspace">
          {/* LEFT - FORM */}

          <section
            style={{
              backgroundColor:
                theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: 26,
              padding: 22,
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
              Original price
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
                value={originalPrice}
                onChange={(event) =>
                  setOriginalPrice(
                    cleanDecimalInput(
                      event.target.value
                    )
                  )
                }
                placeholder="100.00"
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
                  padding: "15px 0",
                }}
              />
            </div>

            {/* DISCOUNT */}

            <h2
              style={{
                color: theme.text,
                fontSize: 15,
                fontWeight: 800,
                marginTop: 26,
                marginBottom: 12,
              }}
            >
              Discount
            </h2>

            <div className="discount-preset-grid">
              {discountPresets.map(
                (preset) => {
                  const active =
                    Number(
                      discountPercent
                    ) === preset;

                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() =>
                        setDiscountPercent(
                          String(preset)
                        )
                      }
                      style={{
                        minHeight: 48,
                        backgroundColor:
                          active
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
                        fontSize: 13,
                        fontWeight: 800,
                        cursor:
                          "pointer",
                      }}
                    >
                      {preset}%
                    </button>
                  );
                }
              )}
            </div>

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
              Custom discount
            </label>

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
                value={
                  discountPercent
                }
                onChange={(event) =>
                  setDiscountPercent(
                    cleanDecimalInput(
                      event.target.value
                    )
                  )
                }
                placeholder="20"
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
                  padding: "14px 0",
                }}
              />

              <span
                style={{
                  color:
                    theme.primary,
                  fontSize: 18,
                  fontWeight: 800,
                }}
              >
                %
              </span>
            </div>

            {/* TAX */}

            <h2
              style={{
                color: theme.text,
                fontSize: 15,
                fontWeight: 800,
                marginTop: 26,
                marginBottom: 12,
              }}
            >
              Sales tax
            </h2>

            <p
              style={{
                color:
                  theme.textMuted,
                fontSize: 11,
                lineHeight: "17px",
                marginTop: -5,
                marginBottom: 10,
              }}
            >
              Optional. Leave at 0 if you
              only want the discounted
              price.
            </p>

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
                value={taxPercent}
                onChange={(event) =>
                  setTaxPercent(
                    cleanDecimalInput(
                      event.target.value
                    )
                  )
                }
                placeholder="0"
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
                  padding: "14px 0",
                }}
              />

              <span
                style={{
                  color:
                    theme.primary,
                  fontSize: 18,
                  fontWeight: 800,
                }}
              >
                %
              </span>
            </div>

            {!isValid &&
              originalPrice.length >
                0 && (
                <div
                  style={{
                    backgroundColor:
                      `${theme.danger}14`,
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
                    Enter a valid price,
                    a discount between
                    0% and 100%, and a
                    valid tax percentage.
                  </span>
                </div>
              )}

            <button
              type="button"
              onClick={clearAll}
              style={{
                width: "100%",
                minHeight: 46,
                background:
                  "transparent",
                border: "none",
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

          <div className="discount-results-column">
            {results ? (
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
                    FINAL PRICE
                  </div>

                  <div
                    style={{
                      color:
                        theme.text,
                      fontSize:
                        "clamp(34px, 5vw, 52px)",
                      fontWeight: 800,
                      letterSpacing:
                        -1.5,
                      overflowWrap:
                        "anywhere",
                    }}
                  >
                    {formatCurrency(
                      results.finalPrice
                    )}
                  </div>

                  <div
                    style={{
                      display:
                        "inline-flex",
                      backgroundColor:
                        `${theme.success}15`,
                      border: `1px solid ${theme.success}55`,
                      borderRadius: 999,
                      padding:
                        "7px 12px",
                      marginTop: 13,
                      color:
                        theme.success,
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    You save{" "}
                    {formatCurrency(
                      results.totalSaved
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
                      marginTop: 0,
                      marginBottom: 20,
                    }}
                  >
                    Price breakdown
                  </h2>

                  <BreakdownRow
                    label="Original price"
                    value={formatCurrency(
                      originalValue
                    )}
                  />

                  <BreakdownRow
                    label={`Discount (${formatNumber(
                      discountValue
                    )}%)`}
                    value={`−${formatCurrency(
                      results.discountAmount
                    )}`}
                    accent
                  />

                  <div
                    style={{
                      height: 1,
                      backgroundColor:
                        theme.divider,
                      marginBottom: 16,
                    }}
                  />

                  <BreakdownRow
                    label="After discount"
                    value={formatCurrency(
                      results.priceAfterDiscount
                    )}
                    strong
                  />

                  {taxValue > 0 && (
                    <BreakdownRow
                      label={`Tax (${formatNumber(
                        taxValue
                      )}%)`}
                      value={`+${formatCurrency(
                        results.taxAmount
                      )}`}
                    />
                  )}

                  <div
                    style={{
                      height: 1,
                      backgroundColor:
                        theme.divider,
                      marginBottom: 16,
                    }}
                  />

                  <BreakdownRow
                    label="Final total"
                    value={formatCurrency(
                      results.finalPrice
                    )}
                    total
                  />
                </section>
              </>
            ) : (
              <section
                className="discount-empty-result"
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
                    fontSize: 26,
                    fontWeight: 900,
                  }}
                >
                  ↓
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
                  Your discounted price
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
                  Enter an original price,
                  choose or enter a
                  discount, and optionally
                  add sales tax to see the
                  final total.
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

        .discount-page-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 28px 32px 60px;
        }

        .discount-workspace {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(0, 1fr);
          gap: 18px;
          align-items: start;
        }

        .discount-results-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 0;
        }

        .discount-preset-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 17px;
        }

        .discount-empty-result {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        @media (max-width: 900px) {
          .discount-page-container {
            max-width: 760px;
            padding-left: 24px;
            padding-right: 24px;
          }

          .discount-workspace {
            grid-template-columns: 1fr;
          }

          .discount-empty-result {
            min-height: auto;
          }
        }

        @media (max-width: 600px) {
          .discount-page-container {
            padding:
              22px 16px 48px;
          }

          .discount-preset-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 380px) {
          .discount-page-container {
            padding-left: 12px;
            padding-right: 12px;
          }

          .discount-preset-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function BreakdownRow({
  label,
  value,
  accent = false,
  strong = false,
  total = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
  strong?: boolean;
  total?: boolean;
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
          color: total
            ? theme.text
            : theme.textSecondary,

          fontSize:
            total ? 15 : 13,

          fontWeight:
            total
              ? 800
              : strong
                ? 700
                : 400,

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
            : strong ||
                total
              ? theme.text
              : theme.textSecondary,

          fontSize:
            total ? 20 : 14,

          fontWeight:
            total ? 900 : 700,

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