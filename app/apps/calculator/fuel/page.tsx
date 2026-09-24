"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type FuelMode = "trip" | "efficiency";

const theme = {
  background: "#07090D",
  surface: "#0D1117",
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

export default function FuelCalculatorPage() {
  const [mode, setMode] =
    useState<FuelMode>("trip");

  const [distance, setDistance] =
    useState("");
  const [mpg, setMpg] =
    useState("");
  const [fuelPrice, setFuelPrice] =
    useState("");

  const [milesDriven, setMilesDriven] =
    useState("");
  const [gallonsUsed, setGallonsUsed] =
    useState("");

  const distanceValue =
    Number(distance);

  const mpgValue =
    Number(mpg);

  const fuelPriceValue =
    Number(fuelPrice);

  const milesDrivenValue =
    Number(milesDriven);

  const gallonsUsedValue =
    Number(gallonsUsed);

  const tripValid =
    mode === "trip" &&
    distance.trim() !== "" &&
    mpg.trim() !== "" &&
    fuelPrice.trim() !== "" &&
    Number.isFinite(distanceValue) &&
    distanceValue >= 0 &&
    Number.isFinite(mpgValue) &&
    mpgValue > 0 &&
    Number.isFinite(fuelPriceValue) &&
    fuelPriceValue >= 0;

  const efficiencyValid =
    mode === "efficiency" &&
    milesDriven.trim() !== "" &&
    gallonsUsed.trim() !== "" &&
    Number.isFinite(milesDrivenValue) &&
    milesDrivenValue >= 0 &&
    Number.isFinite(gallonsUsedValue) &&
    gallonsUsedValue > 0;

  const tripResult = useMemo(() => {
    if (!tripValid) {
      return null;
    }

    const gallonsNeeded =
      distanceValue / mpgValue;

    const totalCost =
      gallonsNeeded *
      fuelPriceValue;

    const costPerMile =
      distanceValue > 0
        ? totalCost /
          distanceValue
        : 0;

    return {
      gallonsNeeded,
      totalCost,
      costPerMile,
    };
  }, [
    tripValid,
    distanceValue,
    mpgValue,
    fuelPriceValue,
  ]);

  const efficiencyResult =
    useMemo(() => {
      if (!efficiencyValid) {
        return null;
      }

      const calculatedMpg =
        milesDrivenValue /
        gallonsUsedValue;

      const litersPer100Km =
        calculatedMpg > 0
          ? 235.214583 /
            calculatedMpg
          : 0;

      const kmPerLiter =
        calculatedMpg *
        0.425143707;

      return {
        calculatedMpg,
        litersPer100Km,
        kmPerLiter,
      };
    }, [
      efficiencyValid,
      milesDrivenValue,
      gallonsUsedValue,
    ]);

  function clearAll() {
    setDistance("");
    setMpg("");
    setFuelPrice("");
    setMilesDriven("");
    setGallonsUsed("");
  }

  const hasTripInput =
    distance.length > 0 ||
    mpg.length > 0 ||
    fuelPrice.length > 0;

  const hasEfficiencyInput =
    milesDriven.length > 0 ||
    gallonsUsed.length > 0;

  const hasCurrentResult =
    mode === "trip"
      ? tripResult !== null
      : efficiencyResult !== null;

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor:
          theme.background,
        color: theme.text,
      }}
    >
      <div className="fuel-page-container">
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
              Fuel
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
              UTILITY
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
          Estimate trip fuel cost or
          calculate your vehicle&apos;s
          real-world fuel economy.
        </p>

        <div
          className="fuel-mode-switch"
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            backgroundColor:
              theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: 18,
            padding: 5,
            gap: 5,
            marginBottom: 18,
          }}
        >
          <ModeButton
            label="Trip Cost"
            active={mode === "trip"}
            onClick={() =>
              setMode("trip")
            }
          />

          <ModeButton
            label="Fuel Economy"
            active={
              mode ===
              "efficiency"
            }
            onClick={() =>
              setMode(
                "efficiency"
              )
            }
          />
        </div>

        <div className="fuel-workspace">
          <div>
            {mode === "trip" ? (
              <section
                style={{
                  ...formCardStyle,
                  height: "100%",
                }}
              >
                <div
                  style={
                    formHeaderStyle
                  }
                >
                  <div>
                    <div
                      style={
                        formEyebrowStyle
                      }
                    >
                      TRIP ESTIMATE
                    </div>

                    <div
                      style={
                        formTitleStyle
                      }
                    >
                      Fuel Cost
                    </div>
                  </div>

                  <div
                    style={
                      fuelMarkStyle
                    }
                  >
                    ⛽
                  </div>
                </div>

                <label
                  style={
                    inputLabelStyle
                  }
                >
                  Trip distance
                </label>

                <InputWithSuffix
                  value={distance}
                  onChange={
                    setDistance
                  }
                  placeholder="300"
                  suffix="miles"
                />

                <h2
                  style={
                    sectionLabelStyle
                  }
                >
                  Vehicle efficiency
                </h2>

                <InputWithSuffix
                  value={mpg}
                  onChange={setMpg}
                  placeholder="30"
                  suffix="MPG"
                />

                <h2
                  style={
                    sectionLabelStyle
                  }
                >
                  Fuel price
                </h2>

                <div
                  style={{
                    minHeight: 62,
                    backgroundColor:
                      theme.inputBackground,
                    border: `1px solid ${theme.inputBorder}`,
                    borderRadius: 17,
                    display: "flex",
                    alignItems:
                      "center",
                    padding:
                      "0 16px",
                  }}
                >
                  <span
                    style={{
                      color:
                        theme.primary,
                      fontSize: 23,
                      fontWeight: 800,
                      marginRight: 7,
                    }}
                  >
                    $
                  </span>

                  <input
                    type="text"
                    inputMode="decimal"
                    value={
                      fuelPrice
                    }
                    onChange={(
                      event
                    ) =>
                      setFuelPrice(
                        cleanDecimalInput(
                          event
                            .target
                            .value
                        )
                      )
                    }
                    placeholder="3.50"
                    style={
                      inputStyle
                    }
                  />

                  <span
                    style={
                      inputSuffixStyle
                    }
                  >
                    / gal
                  </span>
                </div>

                {!tripValid &&
                  hasTripInput && (
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
                        Enter a
                        valid
                        distance,
                        MPG and
                        fuel
                        price.
                      </span>
                    </div>
                  )}

                <ClearButton
                  onClick={
                    clearAll
                  }
                />
              </section>
            ) : (
              <section
                style={{
                  ...formCardStyle,
                  height: "100%",
                }}
              >
                <div
                  style={
                    formHeaderStyle
                  }
                >
                  <div>
                    <div
                      style={
                        formEyebrowStyle
                      }
                    >
                      FUEL ECONOMY
                    </div>

                    <div
                      style={
                        formTitleStyle
                      }
                    >
                      Efficiency
                    </div>
                  </div>

                  <div
                    style={
                      fuelMarkStyle
                    }
                  >
                    ◉
                  </div>
                </div>

                <label
                  style={
                    inputLabelStyle
                  }
                >
                  Miles driven
                </label>

                <InputWithSuffix
                  value={
                    milesDriven
                  }
                  onChange={
                    setMilesDriven
                  }
                  placeholder="350"
                  suffix="miles"
                />

                <h2
                  style={
                    sectionLabelStyle
                  }
                >
                  Gallons used
                </h2>

                <InputWithSuffix
                  value={
                    gallonsUsed
                  }
                  onChange={
                    setGallonsUsed
                  }
                  placeholder="12"
                  suffix="gal"
                />

                {!efficiencyValid &&
                  hasEfficiencyInput && (
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
                        miles
                        driven and
                        gallons
                        used.
                      </span>
                    </div>
                  )}

                <ClearButton
                  onClick={
                    clearAll
                  }
                />
              </section>
            )}
          </div>

          <div className="fuel-results-column">
            {mode === "trip" &&
            tripResult ? (
              <>
                <section
                  style={{
                    ...heroResultStyle,
                    marginTop: 0,
                  }}
                >
                  <div
                    style={
                      heroEyebrowStyle
                    }
                  >
                    ESTIMATED TRIP
                    COST
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
                      tripResult.totalCost
                    )}
                  </div>

                  <div
                    style={
                      heroSubtextStyle
                    }
                  >
                    for{" "}
                    {formatNumber(
                      distanceValue
                    )}{" "}
                    miles
                  </div>
                </section>

                <section
                  style={{
                    ...breakdownCardStyle,
                    marginTop: 0,
                  }}
                >
                  <h2
                    style={
                      breakdownTitleStyle
                    }
                  >
                    Trip breakdown
                  </h2>

                  <ResultRow
                    label="Distance"
                    value={`${formatNumber(
                      distanceValue
                    )} miles`}
                  />

                  <ResultRow
                    label="Fuel economy"
                    value={`${formatNumber(
                      mpgValue
                    )} MPG`}
                  />

                  <ResultRow
                    label="Fuel price"
                    value={`${formatCurrency(
                      fuelPriceValue
                    )}/gal`}
                  />

                  <div
                    style={
                      dividerStyle
                    }
                  />

                  <ResultRow
                    label="Fuel needed"
                    value={`${formatNumber(
                      tripResult.gallonsNeeded
                    )} gal`}
                    accent
                  />

                  <ResultRow
                    label="Cost per mile"
                    value={formatCurrency(
                      tripResult.costPerMile
                    )}
                  />

                  <ResultRow
                    label="Total cost"
                    value={formatCurrency(
                      tripResult.totalCost
                    )}
                    strong
                  />
                </section>
              </>
            ) : null}

            {mode ===
              "efficiency" &&
            efficiencyResult ? (
              <>
                <section
                  style={{
                    ...heroResultStyle,
                    marginTop: 0,
                  }}
                >
                  <div
                    style={
                      heroEyebrowStyle
                    }
                  >
                    FUEL ECONOMY
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
                    {formatNumber(
                      efficiencyResult.calculatedMpg
                    )}
                  </div>

                  <div
                    style={
                      heroUnitStyle
                    }
                  >
                    MPG
                  </div>
                </section>

                <section
                  style={{
                    ...breakdownCardStyle,
                    marginTop: 0,
                  }}
                >
                  <h2
                    style={
                      breakdownTitleStyle
                    }
                  >
                    Efficiency
                    breakdown
                  </h2>

                  <ResultRow
                    label="Miles driven"
                    value={`${formatNumber(
                      milesDrivenValue
                    )} miles`}
                  />

                  <ResultRow
                    label="Gallons used"
                    value={`${formatNumber(
                      gallonsUsedValue
                    )} gal`}
                  />

                  <div
                    style={
                      dividerStyle
                    }
                  />

                  <ResultRow
                    label="Miles per gallon"
                    value={`${formatNumber(
                      efficiencyResult.calculatedMpg
                    )} MPG`}
                    strong
                  />

                  <ResultRow
                    label="Liters / 100 km"
                    value={`${formatNumber(
                      efficiencyResult.litersPer100Km
                    )} L/100km`}
                    accent
                  />

                  <ResultRow
                    label="Kilometers / liter"
                    value={`${formatNumber(
                      efficiencyResult.kmPerLiter
                    )} km/L`}
                  />
                </section>
              </>
            ) : null}

            {!hasCurrentResult && (
              <section
                className="fuel-empty-result"
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
                  {mode ===
                  "trip"
                    ? "⛽"
                    : "◉"}
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
                  {mode ===
                  "trip"
                    ? "Your trip estimate"
                    : "Your fuel economy"}
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
                  {mode ===
                  "trip"
                    ? "Enter your trip distance, vehicle efficiency and fuel price to calculate fuel needed and estimated trip cost."
                    : "Enter the miles driven and gallons used to calculate your real-world fuel economy."}
                </p>
              </section>
            )}

            <section
              style={{
                backgroundColor:
                  theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 20,
                padding: 19,
              }}
            >
              <div
                style={{
                  color:
                    theme.textSecondary,
                  fontSize: 13,
                  fontWeight: 800,
                  marginBottom: 7,
                }}
              >
                Fuel estimates
              </div>

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
                Actual fuel use can
                change with traffic,
                weather, driving
                style, vehicle load,
                road conditions and
                engine efficiency.
              </p>
            </section>
          </div>
        </div>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        .fuel-page-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 28px 32px 60px;
        }

        .fuel-mode-switch {
          max-width: 560px;
        }

        .fuel-workspace {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(0, 1fr);
          gap: 18px;
          align-items: start;
        }

        .fuel-results-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 0;
        }

        .fuel-empty-result {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        @media (max-width: 900px) {
          .fuel-page-container {
            max-width: 760px;
            padding-left: 24px;
            padding-right: 24px;
          }

          .fuel-workspace {
            grid-template-columns: 1fr;
          }

          .fuel-mode-switch {
            max-width: none;
          }

          .fuel-empty-result {
            min-height: auto;
          }
        }

        @media (max-width: 600px) {
          .fuel-page-container {
            padding: 22px 16px 48px;
          }
        }

        @media (max-width: 380px) {
          .fuel-page-container {
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
        color: active
          ? theme.primary
          : theme.textMuted,
        fontSize: 12,
        fontWeight: 800,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function InputWithSuffix({
  value,
  onChange,
  placeholder,
  suffix,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suffix: string;
}) {
  return (
    <div
      style={{
        minHeight: 62,
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
        value={value}
        onChange={(event) =>
          onChange(
            cleanDecimalInput(
              event.target.value
            )
          )
        }
        placeholder={placeholder}
        style={inputStyle}
      />

      <span
        style={
          inputSuffixStyle
        }
      >
        {suffix}
      </span>
    </div>
  );
}

function ClearButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        minHeight: 46,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
        border: "none",
        background: "transparent",
        color:
          theme.textSecondary,
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      Clear
    </button>
  );
}

function ResultRow({
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
          color: accent
            ? theme.primary
            : strong
              ? theme.text
              : theme.textSecondary,
          fontSize:
            strong ? 18 : 14,
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
        100000
    ) / 100000;

  return rounded.toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 5,
    }
  );
}

const formCardStyle = {
  backgroundColor:
    theme.card,
  border: `1px solid ${theme.border}`,
  borderRadius: 26,
  padding: 22,
} as const;

const formHeaderStyle = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  marginBottom: 22,
} as const;

const formEyebrowStyle = {
  color: theme.textMuted,
  fontSize: 9,
  fontWeight: 900,
  letterSpacing: 1.5,
} as const;

const formTitleStyle = {
  color: theme.text,
  fontSize: 21,
  fontWeight: 800,
  marginTop: 5,
} as const;

const fuelMarkStyle = {
  color: theme.primary,
  fontSize: 30,
} as const;

const inputLabelStyle = {
  display: "block",
  color:
    theme.textSecondary,
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

const inputStyle = {
  flex: 1,
  minWidth: 0,
  color: theme.text,
  fontSize: 21,
  fontWeight: 700,
  padding: "14px 0",
  background:
    "transparent",
  border: "none",
  outline: "none",
} as const;

const inputSuffixStyle = {
  color: theme.textMuted,
  fontSize: 12,
  fontWeight: 700,
  marginLeft: 8,
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

const heroResultStyle = {
  backgroundColor:
    theme.card,
  border:
    `1px solid ${theme.primary}`,
  borderRadius: 26,
  padding: 24,
  marginTop: 16,
} as const;

const heroEyebrowStyle = {
  color: theme.primary,
  fontSize: 9,
  fontWeight: 900,
  letterSpacing: 2,
  marginBottom: 10,
} as const;

const heroUnitStyle = {
  color: theme.primary,
  fontSize: 15,
  fontWeight: 800,
  marginTop: 2,
} as const;

const heroSubtextStyle = {
  color: theme.textMuted,
  fontSize: 12,
  marginTop: 8,
} as const;

const breakdownCardStyle = {
  backgroundColor:
    theme.surface,
  border:
    `1px solid ${theme.border}`,
  borderRadius: 24,
  padding: 22,
  marginTop: 16,
} as const;

const breakdownTitleStyle = {
  color: theme.text,
  fontSize: 16,
  fontWeight: 800,
  margin: "0 0 20px 0",
} as const;

const dividerStyle = {
  height: 1,
  backgroundColor:
    theme.divider,
  marginBottom: 16,
} as const;
