"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RandomMode =
  | "number"
  | "dice"
  | "coin"
  | "picker";

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

export default function RandomCalculatorPage() {
  const [mode, setMode] =
    useState<RandomMode>("number");

  const [minimum, setMinimum] =
    useState("1");

  const [maximum, setMaximum] =
    useState("100");

  const [allowDecimals, setAllowDecimals] =
    useState(false);

  const [diceCount, setDiceCount] =
    useState("2");

  const [diceSides, setDiceSides] =
    useState("6");

  const [pickerText, setPickerText] =
    useState("");

  const [numberResult, setNumberResult] =
    useState<number | null>(null);

  const [diceResults, setDiceResults] =
    useState<number[]>([]);

  const [coinResult, setCoinResult] =
    useState<"Heads" | "Tails" | null>(null);

  const [pickerResult, setPickerResult] =
    useState<string | null>(null);

  const minValue = Number(minimum);
  const maxValue = Number(maximum);

  const diceCountValue = Number(diceCount);
  const diceSidesValue = Number(diceSides);

  const numberValid =
    Number.isFinite(minValue) &&
    Number.isFinite(maxValue) &&
    maxValue >= minValue;

  const diceValid =
    Number.isInteger(diceCountValue) &&
    diceCountValue >= 1 &&
    diceCountValue <= 20 &&
    Number.isInteger(diceSidesValue) &&
    diceSidesValue >= 2 &&
    diceSidesValue <= 1000;

  const pickerOptions = useMemo(() => {
    return pickerText
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }, [pickerText]);

  const diceTotal = useMemo(() => {
    return diceResults.reduce(
      (total, value) => total + value,
      0
    );
  }, [diceResults]);

  function switchMode(nextMode: RandomMode) {
    setMode(nextMode);
  }

  function generateNumber() {
    if (!numberValid) {
      return;
    }

    if (allowDecimals) {
      const random =
        Math.random() *
          (maxValue - minValue) +
        minValue;

      const rounded =
        Math.round(random * 1000000) /
        1000000;

      setNumberResult(rounded);
      return;
    }

    const minInteger =
      Math.ceil(minValue);

    const maxInteger =
      Math.floor(maxValue);

    if (maxInteger < minInteger) {
      setNumberResult(null);
      return;
    }

    const randomInteger =
      Math.floor(
        Math.random() *
          (maxInteger - minInteger + 1)
      ) + minInteger;

    setNumberResult(randomInteger);
  }

  function rollDice() {
    if (!diceValid) {
      return;
    }

    const rolls = Array.from(
      { length: diceCountValue },
      () =>
        Math.floor(
          Math.random() * diceSidesValue
        ) + 1
    );

    setDiceResults(rolls);
  }

  function flipCoin() {
    setCoinResult(
      Math.random() < 0.5
        ? "Heads"
        : "Tails"
    );
  }

  function pickRandom() {
    if (pickerOptions.length === 0) {
      setPickerResult(null);
      return;
    }

    const index =
      Math.floor(
        Math.random() *
          pickerOptions.length
      );

    setPickerResult(
      pickerOptions[index]
    );
  }

  function clearAll() {
    setMinimum("1");
    setMaximum("100");
    setAllowDecimals(false);

    setDiceCount("2");
    setDiceSides("6");

    setPickerText("");

    setNumberResult(null);
    setDiceResults([]);
    setCoinResult(null);
    setPickerResult(null);
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
      <div className="random-page-container">
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

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "flex-end",
            gap: 12,
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
              Random
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
          }}
        >
          Generate random numbers,
          roll dice, flip a coin or
          choose from your own list.
        </p>

        <div
          className="random-mode-grid"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, 1fr)",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <ModeButton
            label="Number"
            icon="#"
            active={
              mode === "number"
            }
            onClick={() =>
              switchMode("number")
            }
          />

          <ModeButton
            label="Dice"
            icon="⚄"
            active={
              mode === "dice"
            }
            onClick={() =>
              switchMode("dice")
            }
          />

          <ModeButton
            label="Coin"
            icon="◉"
            active={
              mode === "coin"
            }
            onClick={() =>
              switchMode("coin")
            }
          />

          <ModeButton
            label="Picker"
            icon="?"
            active={
              mode === "picker"
            }
            onClick={() =>
              switchMode("picker")
            }
          />
        </div>

        <div className="random-workspace">
          <div className="random-form-column">
            {mode === "number" && (
          <section style={formCardStyle}>
            <FormHeader
              eyebrow="RANDOM NUMBER"
              title="Number Generator"
              mark="#"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 10,
              }}
            >
              <NumberField
                label="Minimum"
                value={minimum}
                onChange={(value) =>
                  setMinimum(
                    cleanSignedDecimalInput(
                      value
                    )
                  )
                }
                placeholder="1"
              />

              <NumberField
                label="Maximum"
                value={maximum}
                onChange={(value) =>
                  setMaximum(
                    cleanSignedDecimalInput(
                      value
                    )
                  )
                }
                placeholder="100"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setAllowDecimals(
                  (current) =>
                    !current
                )
              }
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",
                gap: 14,
                backgroundColor:
                  theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 17,
                padding:
                  "14px 15px",
                marginTop: 10,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: theme.text,
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  Allow decimals
                </div>

                <div
                  style={{
                    color:
                      theme.textMuted,
                    fontSize: 10,
                    lineHeight:
                      "16px",
                    marginTop: 4,
                  }}
                >
                  Generate values
                  with up to 6
                  decimal places.
                </div>
              </div>

              <div
                style={{
                  width: 46,
                  height: 26,
                  borderRadius: 999,
                  backgroundColor:
                    allowDecimals
                      ? theme.primary
                      : theme.surfaceSecondary,
                  border: `1px solid ${theme.border}`,
                  position: "relative",
                  transition:
                    "background-color 150ms ease",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 999,
                    backgroundColor:
                      "#FFFFFF",
                    position:
                      "absolute",
                    top: 2,
                    left:
                      allowDecimals
                        ? 22
                        : 2,
                    transition:
                      "left 150ms ease",
                  }}
                />
              </div>
            </button>

            {!numberValid && (
              <div style={errorCardStyle}>
                <span style={errorTextStyle}>
                  Maximum must be
                  greater than or equal
                  to minimum.
                </span>
              </div>
            )}

            <PrimaryButton
              label="Generate Number"
              onClick={generateNumber}
              disabled={!numberValid}
            />
          </section>
        )}

        {mode === "dice" && (
          <section style={formCardStyle}>
            <FormHeader
              eyebrow="DICE ROLLER"
              title="Roll Dice"
              mark="⚄"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 10,
              }}
            >
              <NumberField
                label="Number of dice"
                value={diceCount}
                onChange={(value) =>
                  setDiceCount(
                    cleanIntegerInput(
                      value
                    )
                  )
                }
                placeholder="2"
              />

              <NumberField
                label="Sides per die"
                value={diceSides}
                onChange={(value) =>
                  setDiceSides(
                    cleanIntegerInput(
                      value
                    )
                  )
                }
                placeholder="6"
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(6, 1fr)",
                gap: 7,
                marginTop: 5,
              }}
            >
              {[4, 6, 8, 10, 12, 20].map(
                (sides) => {
                  const active =
                    diceSidesValue ===
                    sides;

                  return (
                    <button
                      key={sides}
                      type="button"
                      onClick={() =>
                        setDiceSides(
                          String(sides)
                        )
                      }
                      style={{
                        minHeight: 42,
                        backgroundColor:
                          active
                            ? theme.primarySoft
                            : theme.surface,
                        border: `1px solid ${
                          active
                            ? theme.primary
                            : theme.border
                        }`,
                        borderRadius: 12,
                        color: active
                          ? theme.primary
                          : theme.textMuted,
                        fontSize: 11,
                        fontWeight: 800,
                        cursor:
                          "pointer",
                      }}
                    >
                      d{sides}
                    </button>
                  );
                }
              )}
            </div>

            {!diceValid && (
              <div style={errorCardStyle}>
                <span style={errorTextStyle}>
                  Use 1–20 dice with
                  2–1000 sides.
                </span>
              </div>
            )}

            <PrimaryButton
              label="Roll Dice"
              onClick={rollDice}
              disabled={!diceValid}
            />
          </section>
        )}

        {mode === "coin" && (
          <section style={formCardStyle}>
            <FormHeader
              eyebrow="COIN FLIP"
              title="Heads or Tails"
              mark="◉"
            />

            <p
              style={{
                color:
                  theme.textSecondary,
                fontSize: 12,
                lineHeight: "19px",
                textAlign: "center",
                margin:
                  "6px 0 20px",
              }}
            >
              Tap the button and
              Bodolvo will randomly
              choose heads or tails.
            </p>

            <PrimaryButton
              label="Flip Coin"
              onClick={flipCoin}
            />
          </section>
        )}

        {mode === "picker" && (
          <section style={formCardStyle}>
            <FormHeader
              eyebrow="RANDOM PICKER"
              title="Choose One"
              mark="?"
            />

            <label style={inputLabelStyle}>
              Options
            </label>

            <textarea
              value={pickerText}
              onChange={(event) =>
                setPickerText(
                  event.target.value
                )
              }
              placeholder={
                "Pizza\nBurgers\nTacos\nSushi"
              }
              style={{
                width: "100%",
                minHeight: 150,
                backgroundColor:
                  theme.inputBackground,
                border: `1px solid ${theme.inputBorder}`,
                borderRadius: 17,
                color: theme.text,
                fontSize: 15,
                lineHeight: "22px",
                padding: 15,
                outline: "none",
                resize: "vertical",
              }}
            />

            <p
              style={{
                color:
                  theme.textMuted,
                fontSize: 10,
                lineHeight: "16px",
                marginTop: 8,
              }}
            >
              Enter one option per
              line, or separate options
              with commas.
            </p>

            <div
              style={{
                display:
                  "inline-flex",
                backgroundColor:
                  theme.primarySoft,
                border: `1px solid ${theme.border}`,
                borderRadius: 999,
                padding:
                  "6px 10px",
                marginTop: 3,
                color:
                  theme.primary,
                fontSize: 10,
                fontWeight: 800,
              }}
            >
              {pickerOptions.length}{" "}
              {pickerOptions.length === 1
                ? "option"
                : "options"}
            </div>

            <PrimaryButton
              label="Pick Random Option"
              onClick={pickRandom}
              disabled={
                pickerOptions.length ===
                0
              }
            />
          </section>
        )}
          </div>

          <div className="random-results-column">
            {mode === "number" &&
          numberResult !== null && (
            <section style={heroResultStyle}>
              <div style={heroEyebrowStyle}>
                RANDOM NUMBER
              </div>

              <div style={heroValueStyle}>
                {formatNumber(
                  numberResult
                )}
              </div>

              <div style={heroSubtextStyle}>
                Between{" "}
                {formatNumber(
                  minValue
                )}{" "}
                and{" "}
                {formatNumber(
                  maxValue
                )}
              </div>

              <SecondaryAction
                label="Generate Again"
                onClick={generateNumber}
              />
            </section>
          )}

        {mode === "dice" &&
          diceResults.length > 0 && (
            <>
              <section
                style={heroResultStyle}
              >
                <div
                  style={
                    heroEyebrowStyle
                  }
                >
                  TOTAL ROLL
                </div>

                <div style={heroValueStyle}>
                  {diceTotal}
                </div>

                <div
                  style={
                    heroSubtextStyle
                  }
                >
                  {diceResults.length} ×
                  d{diceSidesValue}
                </div>

                <SecondaryAction
                  label="Roll Again"
                  onClick={rollDice}
                />
              </section>

              <section
                style={resultsCardStyle}
              >
                <h2
                  style={{
                    color:
                      theme.text,
                    fontSize: 16,
                    fontWeight: 800,
                    margin:
                      "0 0 16px",
                  }}
                >
                  Individual dice
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(4, 1fr)",
                    gap: 8,
                  }}
                >
                  {diceResults.map(
                    (
                      roll,
                      index
                    ) => (
                      <div
                        key={`${roll}-${index}`}
                        style={{
                          minHeight: 70,
                          backgroundColor:
                            theme.card,
                          border: `1px solid ${theme.border}`,
                          borderRadius: 14,
                          display: "flex",
                          flexDirection:
                            "column",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                        }}
                      >
                        <div
                          style={{
                            color:
                              theme.textMuted,
                            fontSize: 8,
                            fontWeight:
                              800,
                          }}
                        >
                          {index + 1}
                        </div>

                        <div
                          style={{
                            color:
                              theme.text,
                            fontSize: 22,
                            fontWeight:
                              900,
                            marginTop: 4,
                          }}
                        >
                          {roll}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>
            </>
          )}

        {mode === "coin" &&
          coinResult && (
            <section style={heroResultStyle}>
              <div style={heroEyebrowStyle}>
                COIN RESULT
              </div>

              <div
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 999,
                  margin: "12px auto",
                  backgroundColor:
                    theme.primarySoft,
                  border: `2px solid ${theme.primary}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "center",
                  color:
                    theme.primary,
                  fontSize: 42,
                  fontWeight: 900,
                }}
              >
                {coinResult === "Heads"
                  ? "H"
                  : "T"}
              </div>

              <div
                style={{
                  color: theme.text,
                  fontSize: 28,
                  fontWeight: 800,
                  textAlign: "center",
                }}
              >
                {coinResult}
              </div>

              <SecondaryAction
                label="Flip Again"
                onClick={flipCoin}
              />
            </section>
          )}

        {mode === "picker" &&
          pickerResult && (
            <section style={heroResultStyle}>
              <div style={heroEyebrowStyle}>
                SELECTED
              </div>

              <div
                style={{
                  color: theme.text,
                  fontSize:
                    "clamp(26px, 8vw, 38px)",
                  lineHeight: 1.2,
                  fontWeight: 800,
                  textAlign: "center",
                  overflowWrap:
                    "anywhere",
                }}
              >
                {pickerResult}
              </div>

              <div style={heroSubtextStyle}>
                Chosen from{" "}
                {pickerOptions.length}{" "}
                options
              </div>

              <SecondaryAction
                label="Pick Again"
                onClick={pickRandom}
              />
            </section>
          )}

          </div>
        </div>

        <button
          type="button"
          onClick={clearAll}
          style={{
            width: "100%",
            minHeight: 48,
            border: "none",
            background:
              "transparent",
            color:
              theme.textSecondary,
            fontSize: 13,
            fontWeight: 700,
            marginTop: 18,
            cursor: "pointer",
          }}
        >
          Reset Random Tools
        </button>

        <section
          style={{
            backgroundColor:
              theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: 20,
            padding: 17,
            marginTop: 8,
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
            Random generation
          </div>

          <p
            style={{
              color:
                theme.textMuted,
              fontSize: 11,
              lineHeight: "18px",
              margin: 0,
            }}
          >
            These tools use the
            browser&apos;s standard
            pseudorandom number
            generator and are intended
            for everyday choices, games
            and casual use—not
            cryptographic or
            security-sensitive
            randomness.
          </p>
        </section>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        .random-page-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 28px 32px 60px;
        }

        .random-mode-grid {
          max-width: 760px;
        }

        .random-workspace {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 18px;
          align-items: start;
        }

        .random-form-column,
        .random-results-column {
          min-width: 0;
        }

        .random-results-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .random-results-column > section {
          margin-top: 0 !important;
        }

        @media (max-width: 900px) {
          .random-page-container {
            max-width: 760px;
            padding-left: 24px;
            padding-right: 24px;
          }

          .random-workspace {
            grid-template-columns: 1fr;
          }

          .random-mode-grid {
            max-width: none;
          }
        }

        @media (max-width: 600px) {
          .random-page-container {
            padding: 22px 16px 48px;
          }

          .random-mode-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 380px) {
          .random-page-container {
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
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minHeight: 72,
        backgroundColor: active
          ? theme.primarySoft
          : theme.surface,
        border: `1px solid ${
          active
            ? theme.primary
            : theme.border
        }`,
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        color: active
          ? theme.primary
          : theme.textMuted,
        cursor: "pointer",
      }}
    >
      <span
        style={{
          fontSize: 19,
          fontWeight: 900,
        }}
      >
        {icon}
      </span>

      <span
        style={{
          fontSize: 9,
          fontWeight: 800,
        }}
      >
        {label}
      </span>
    </button>
  );
}

function FormHeader({
  eyebrow,
  title,
  mark,
}: {
  eyebrow: string;
  title: string;
  mark: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center",
        marginBottom: 22,
      }}
    >
      <div>
        <div
          style={{
            color:
              theme.textMuted,
            fontSize: 9,
            fontWeight: 900,
            letterSpacing: 1.5,
          }}
        >
          {eyebrow}
        </div>

        <div
          style={{
            color: theme.text,
            fontSize: 21,
            fontWeight: 800,
            marginTop: 5,
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          color: theme.primary,
          fontSize: 32,
          fontWeight: 900,
        }}
      >
        {mark}
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label
        style={inputLabelStyle}
      >
        {label}
      </label>

      <div style={inputShellStyle}>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={placeholder}
          style={{
            width: "100%",
            color: theme.text,
            background:
              "transparent",
            border: "none",
            outline: "none",
            fontSize: 19,
            fontWeight: 700,
            padding: "13px 0",
          }}
        />
      </div>
    </div>
  );
}

function PrimaryButton({
  label,
  onClick,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        minHeight: 56,
        backgroundColor:
          disabled
            ? theme.surfaceSecondary
            : theme.primary,
        border: "none",
        borderRadius: 17,
        color: disabled
          ? theme.textMuted
          : "#FFFFFF",
        fontSize: 14,
        fontWeight: 800,
        marginTop: 20,
        cursor: disabled
          ? "not-allowed"
          : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {label}
    </button>
  );
}

function SecondaryAction({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "block",
        minHeight: 44,
        margin: "18px auto 0",
        padding: "0 17px",
        backgroundColor:
          theme.primarySoft,
        border: `1px solid ${theme.primary}`,
        borderRadius: 14,
        color: theme.primary,
        fontSize: 12,
        fontWeight: 800,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function cleanSignedDecimalInput(
  value: string
) {
  let cleaned =
    value.replace(
      /[^0-9.-]/g,
      ""
    );

  const negative =
    cleaned.startsWith("-");

  cleaned =
    cleaned.replace(/-/g, "");

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

  return negative
    ? `-${cleaned}`
    : cleaned;
}

function cleanIntegerInput(
  value: string
) {
  return value.replace(
    /[^0-9]/g,
    ""
  );
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
        1000000
    ) / 1000000;

  return rounded.toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 6,
    }
  );
}

const formCardStyle = {
  backgroundColor: theme.card,
  border: `1px solid ${theme.border}`,
  borderRadius: 26,
  padding: 20,
} as const;

const inputLabelStyle = {
  display: "block",
  color: theme.textSecondary,
  fontSize: 11,
  fontWeight: 700,
  marginBottom: 8,
} as const;

const inputShellStyle = {
  minHeight: 58,
  backgroundColor:
    theme.inputBackground,
  border: `1px solid ${theme.inputBorder}`,
  borderRadius: 16,
  display: "flex",
  alignItems: "center",
  padding: "0 14px",
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

const heroResultStyle = {
  backgroundColor: theme.card,
  border: `1px solid ${theme.primary}`,
  borderRadius: 26,
  padding: 22,
  marginTop: 16,
  textAlign: "center",
} as const;

const heroEyebrowStyle = {
  color: theme.primary,
  fontSize: 9,
  fontWeight: 900,
  letterSpacing: 2,
  marginBottom: 10,
} as const;

const heroValueStyle = {
  color: theme.text,
  fontSize: "clamp(34px, 10vw, 46px)",
  fontWeight: 800,
  letterSpacing: -1.5,
  overflowWrap: "anywhere",
} as const;

const heroSubtextStyle = {
  color: theme.textMuted,
  fontSize: 12,
  lineHeight: "18px",
  marginTop: 8,
} as const;

const resultsCardStyle = {
  backgroundColor: theme.surface,
  border: `1px solid ${theme.border}`,
  borderRadius: 24,
  padding: 20,
  marginTop: 16,
} as const;