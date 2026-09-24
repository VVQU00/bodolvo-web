"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Mode = "difference" | "add";

const theme = {
  background: "#FFFFFF",
  surface: "#0F1319",
  card: "#10141B",

  text: "#FFFFFF",
  textSecondary: "#7B8593",
  textMuted: "#65707D",

  border: "#1C232E",
  divider: "#202630",

  inputBackground: "#0B0F15",
  inputBorder: "#202733",

  primary: "#171717",
  primarySoft: "#F3F3F3",

  dangerBackground: "#211317",
  dangerBorder: "#442128",
  dangerText: "#E8A3AF",
};

export default function DateTimeCalculatorPage() {
  const [mode, setMode] =
    useState<Mode>("difference");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [baseDate, setBaseDate] =
    useState("");

  const [daysToAdd, setDaysToAdd] =
    useState("0");

  const [monthsToAdd, setMonthsToAdd] =
    useState("0");

  const [yearsToAdd, setYearsToAdd] =
    useState("0");

  const differenceResult = useMemo(() => {
    if (mode !== "difference") {
      return null;
    }

    const start =
      parseDateInput(startDate);

    const end =
      parseDateInput(endDate);

    if (!start || !end) {
      return null;
    }

    const diffMs =
      end.getTime() - start.getTime();

    const absoluteMs =
      Math.abs(diffMs);

    const totalDays =
      Math.floor(
        absoluteMs / 86400000
      );

    const totalWeeks =
      absoluteMs / 604800000;

    const calendarDifference =
      getCalendarDifference(
        start,
        end
      );

    return {
      direction:
        diffMs === 0
          ? "same"
          : diffMs > 0
            ? "after"
            : "before",

      totalDays,
      totalWeeks,
      totalHours:
        totalDays * 24,

      calendarDifference,
      start,
      end,
    };
  }, [
    mode,
    startDate,
    endDate,
  ]);

  const addResult = useMemo(() => {
    if (mode !== "add") {
      return null;
    }

    const base =
      parseDateInput(baseDate);

    const days =
      Number(daysToAdd);

    const months =
      Number(monthsToAdd);

    const years =
      Number(yearsToAdd);

    if (
      !base ||
      !Number.isFinite(days) ||
      !Number.isFinite(months) ||
      !Number.isFinite(years) ||
      !Number.isInteger(days) ||
      !Number.isInteger(months) ||
      !Number.isInteger(years)
    ) {
      return null;
    }

    const result =
      new Date(base);

    if (years !== 0) {
      result.setFullYear(
        result.getFullYear() +
          years
      );
    }

    if (months !== 0) {
      result.setMonth(
        result.getMonth() +
          months
      );
    }

    if (days !== 0) {
      result.setDate(
        result.getDate() +
          days
      );
    }

    return {
      base,
      result,
      days,
      months,
      years,
    };
  }, [
    mode,
    baseDate,
    daysToAdd,
    monthsToAdd,
    yearsToAdd,
  ]);

  function clearAll() {
    setStartDate("");
    setEndDate("");
    setBaseDate("");
    setDaysToAdd("0");
    setMonthsToAdd("0");
    setYearsToAdd("0");
  }

  const hasDifferenceInput =
    startDate.length > 0 ||
    endDate.length > 0;

  const hasAddInput =
    baseDate.length > 0;

  const hasResult =
    mode === "difference"
      ? differenceResult !== null
      : addResult !== null;

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor:
          theme.background,
        color: theme.text,
      }}
    >
      <div className="date-page-container">
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
              Date & Time
            </h1>
          </div>

          <div
            style={{
              backgroundColor:
                "#102A43",
              border:
                "1px solid #202833",
              borderRadius: 999,
              padding:
                "6px 11px",
              marginBottom: 3,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: "#171717",
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
          Find the time between two dates or add
          days, months and years to any date.
        </p>

        {/* MODE */}

        <div className="date-mode-switch">
          <ModeButton
            label="Date difference"
            active={
              mode ===
              "difference"
            }
            onClick={() =>
              setMode(
                "difference"
              )
            }
          />

          <ModeButton
            label="Add to date"
            active={
              mode === "add"
            }
            onClick={() =>
              setMode("add")
            }
          />
        </div>

        {/* WORKSPACE */}

        <div className="date-workspace">
          {/* LEFT - FORM */}

          <div>
            {mode ===
            "difference" ? (
              <section
                style={
                  formCardStyle
                }
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
                      DATE CALCULATOR
                    </div>

                    <div
                      style={
                        formTitleStyle
                      }
                    >
                      Difference
                    </div>
                  </div>

                  <div
                    style={
                      calendarMarkStyle
                    }
                  >
                    ◫
                  </div>
                </div>

                <label
                  style={
                    inputLabelStyle
                  }
                >
                  Start date
                </label>

                <DateField
                  value={
                    startDate
                  }
                  onChange={
                    setStartDate
                  }
                  placeholder="2026-09-06"
                />

                <div
                  style={
                    inputHintStyle
                  }
                >
                  Use YYYY-MM-DD
                </div>

                <h2
                  style={
                    sectionLabelStyle
                  }
                >
                  End date
                </h2>

                <DateField
                  value={
                    endDate
                  }
                  onChange={
                    setEndDate
                  }
                  placeholder="2026-12-31"
                />

                <div
                  style={
                    inputHintStyle
                  }
                >
                  Use YYYY-MM-DD
                </div>

                {hasDifferenceInput &&
                  !differenceResult && (
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
                        Enter two
                        valid dates
                        using
                        YYYY-MM-DD.
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
                style={
                  formCardStyle
                }
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
                      DATE CALCULATOR
                    </div>

                    <div
                      style={
                        formTitleStyle
                      }
                    >
                      Add to Date
                    </div>
                  </div>

                  <div
                    style={
                      calendarMarkStyle
                    }
                  >
                    +
                  </div>
                </div>

                <label
                  style={
                    inputLabelStyle
                  }
                >
                  Starting date
                </label>

                <DateField
                  value={
                    baseDate
                  }
                  onChange={
                    setBaseDate
                  }
                  placeholder="2026-09-06"
                />

                <div
                  style={
                    inputHintStyle
                  }
                >
                  Use YYYY-MM-DD
                </div>

                <h2
                  style={
                    sectionLabelStyle
                  }
                >
                  Add
                </h2>

                <div className="date-amount-grid">
                  <AmountField
                    label="Years"
                    value={
                      yearsToAdd
                    }
                    onChange={
                      setYearsToAdd
                    }
                  />

                  <AmountField
                    label="Months"
                    value={
                      monthsToAdd
                    }
                    onChange={
                      setMonthsToAdd
                    }
                  />

                  <AmountField
                    label="Days"
                    value={
                      daysToAdd
                    }
                    onChange={
                      setDaysToAdd
                    }
                  />
                </div>

                <div
                  style={
                    inputHintStyle
                  }
                >
                  Negative values subtract time.
                </div>

                {hasAddInput &&
                  !addResult && (
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
                        Enter a valid
                        date and whole
                        numbers for
                        years, months
                        and days.
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

          {/* RIGHT - RESULTS */}

          <div className="date-results-column">
            {mode ===
              "difference" &&
            differenceResult ? (
              <>
                <section
                  style={
                    heroResultStyle
                  }
                >
                  <div
                    style={
                      heroEyebrowStyle
                    }
                  >
                    TOTAL DIFFERENCE
                  </div>

                  <div
                    style={{
                      color:
                        theme.text,
                      fontSize:
                        "clamp(40px, 6vw, 58px)",
                      fontWeight: 800,
                      letterSpacing:
                        -1.5,
                      overflowWrap:
                        "anywhere",
                    }}
                  >
                    {
                      differenceResult.totalDays
                    }
                  </div>

                  <div
                    style={
                      heroUnitStyle
                    }
                  >
                    {differenceResult.totalDays ===
                    1
                      ? "day"
                      : "days"}
                  </div>

                  <div
                    style={
                      heroSubtextStyle
                    }
                  >
                    {formatDate(
                      differenceResult.end
                    )}{" "}
                    is{" "}
                    {differenceResult.direction ===
                    "same"
                      ? "the same date as"
                      : differenceResult.direction}{" "}
                    {formatDate(
                      differenceResult.start
                    )}
                  </div>
                </section>

                <section
                  style={
                    breakdownCardStyle
                  }
                >
                  <h2
                    style={
                      breakdownTitleStyle
                    }
                  >
                    Calendar difference
                  </h2>

                  <ResultRow
                    label="Years"
                    value={String(
                      differenceResult
                        .calendarDifference
                        .years
                    )}
                  />

                  <ResultRow
                    label="Months"
                    value={String(
                      differenceResult
                        .calendarDifference
                        .months
                    )}
                  />

                  <ResultRow
                    label="Days"
                    value={String(
                      differenceResult
                        .calendarDifference
                        .days
                    )}
                  />

                  <div
                    style={
                      dividerStyle
                    }
                  />

                  <ResultRow
                    label="Total weeks"
                    value={formatNumber(
                      differenceResult.totalWeeks
                    )}
                  />

                  <ResultRow
                    label="Total days"
                    value={String(
                      differenceResult.totalDays
                    )}
                  />

                  <ResultRow
                    label="Total hours"
                    value={differenceResult.totalHours.toLocaleString(
                      "en-US"
                    )}
                    strong
                  />
                </section>
              </>
            ) : null}

            {mode === "add" &&
            addResult ? (
              <>
                <section
                  style={
                    heroResultStyle
                  }
                >
                  <div
                    style={
                      heroEyebrowStyle
                    }
                  >
                    RESULTING DATE
                  </div>

                  <div
                    style={{
                      color:
                        theme.text,
                      fontSize:
                        "clamp(28px, 4vw, 42px)",
                      lineHeight: 1.2,
                      fontWeight: 800,
                      letterSpacing:
                        -0.8,
                      overflowWrap:
                        "anywhere",
                    }}
                  >
                    {formatDate(
                      addResult.result
                    )}
                  </div>

                  <div
                    style={
                      heroSubtextStyle
                    }
                  >
                    {formatISODate(
                      addResult.result
                    )}
                  </div>
                </section>

                <section
                  style={
                    breakdownCardStyle
                  }
                >
                  <h2
                    style={
                      breakdownTitleStyle
                    }
                  >
                    Date breakdown
                  </h2>

                  <ResultRow
                    label="Starting date"
                    value={formatDate(
                      addResult.base
                    )}
                  />

                  <ResultRow
                    label="Years added"
                    value={formatSigned(
                      addResult.years
                    )}
                  />

                  <ResultRow
                    label="Months added"
                    value={formatSigned(
                      addResult.months
                    )}
                  />

                  <ResultRow
                    label="Days added"
                    value={formatSigned(
                      addResult.days
                    )}
                  />

                  <div
                    style={
                      dividerStyle
                    }
                  />

                  <ResultRow
                    label="Final date"
                    value={formatISODate(
                      addResult.result
                    )}
                    strong
                  />
                </section>
              </>
            ) : null}

            {!hasResult && (
              <section
                className="date-empty-result"
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
                    border:
                      "1px solid #171717",
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
                  "difference"
                    ? "◫"
                    : "+"}
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
                  "difference"
                    ? "Date difference"
                    : "Resulting date"}
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
                  "difference"
                    ? "Enter a start date and end date to see the calendar difference and total time between them."
                    : "Enter a starting date and the years, months or days you want to add or subtract."}
                </p>
              </section>
            )}

            {/* INFO */}

            <section
              style={{
                backgroundColor:
                  "#0C1016",
                border:
                  "1px solid #191F28",
                borderRadius: 20,
                padding: 19,
              }}
            >
              <div
                style={{
                  color:
                    "#C9CED6",
                  fontSize: 13,
                  fontWeight: 800,
                  marginBottom: 7,
                }}
              >
                Date calculations
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
                Date difference uses
                calendar dates, while
                Add to Date applies
                years, months and days
                in sequence. Leap years
                and varying month
                lengths are handled by
                the device date system.
              </p>
            </section>
          </div>
        </div>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        .date-page-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 28px 32px 60px;
        }

        .date-mode-switch {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          background: #0f131a;
          border: 1px solid #1a2029;
          border-radius: 18px;
          padding: 5px;
          gap: 5px;
          margin-bottom: 18px;
          max-width: 560px;
        }

        .date-workspace {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(0, 1fr);
          gap: 18px;
          align-items: start;
        }

        .date-results-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 0;
        }

        .date-amount-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 8px;
        }

        .date-empty-result {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        @media (max-width: 900px) {
          .date-page-container {
            max-width: 760px;
            padding-left: 24px;
            padding-right: 24px;
          }

          .date-workspace {
            grid-template-columns: 1fr;
          }

          .date-mode-switch {
            max-width: none;
          }

          .date-empty-result {
            min-height: auto;
          }
        }

        @media (max-width: 600px) {
          .date-page-container {
            padding: 22px 16px 48px;
          }

          .date-amount-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 380px) {
          .date-page-container {
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
          ? "1px solid #171717"
          : "1px solid transparent",

        backgroundColor: active
          ? "#102A43"
          : "transparent",

        color: active
          ? "#171717"
          : "#687180",

        fontSize: 11,
        fontWeight: 800,
        cursor: "pointer",
        padding: "0 8px",
      }}
    >
      {label}
    </button>
  );
}

function DateField({
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
      <span
        style={{
          color: "#171717",
          fontSize: 18,
          marginRight: 11,
        }}
      >
        ◫
      </span>

      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(event) =>
          onChange(
            cleanDateInput(
              event.target.value
            )
          )
        }
        placeholder={placeholder}
        maxLength={10}
        style={{
          flex: 1,
          minWidth: 0,
          color: theme.text,
          fontSize: 19,
          fontWeight: 700,
          padding: "14px 0",
          letterSpacing: 1,
          background:
            "transparent",
          border: "none",
          outline: "none",
        }}
      />
    </div>
  );
}

function AmountField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      style={{
        minWidth: 0,
      }}
    >
      <div
        style={{
          color: "#737D8C",
          fontSize: 10,
          fontWeight: 700,
          marginBottom: 7,
        }}
      >
        {label}
      </div>

      <div
        style={{
          minHeight: 56,
          backgroundColor:
            theme.inputBackground,
          border: `1px solid ${theme.inputBorder}`,
          borderRadius: 15,
          display: "flex",
          alignItems: "center",
          justifyContent:
            "center",
          padding: "0 8px",
        }}
      >
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(event) =>
            onChange(
              cleanSignedIntegerInput(
                event.target.value
              )
            )
          }
          placeholder="0"
          style={{
            width: "100%",
            color: theme.text,
            fontSize: 18,
            fontWeight: 700,
            textAlign: "center",
            padding: "12px 0",
            background:
              "transparent",
            border: "none",
            outline: "none",
          }}
        />
      </div>
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
        justifyContent:
          "center",
        marginTop: 12,
        border: "none",
        background:
          "transparent",
        color: "#7F8996",
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
        gap: 14,
        marginBottom: 14,
      }}
    >
      <span
        style={{
          color: strong
            ? theme.text
            : "#737D8C",

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
            : "#C7CCD4",

          fontSize:
            strong ? 17 : 13,

          fontWeight:
            strong ? 900 : 700,

          textAlign: "right",
          maxWidth: "66%",
          overflowWrap:
            "anywhere",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function parseDateInput(
  value: string
): Date | null {
  const match =
    value.match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    );

  if (!match) {
    return null;
  }

  const year =
    Number(match[1]);

  const month =
    Number(match[2]);

  const day =
    Number(match[3]);

  const date =
    new Date(
      year,
      month - 1,
      day
    );

  if (
    date.getFullYear() !==
      year ||
    date.getMonth() !==
      month - 1 ||
    date.getDate() !==
      day
  ) {
    return null;
  }

  date.setHours(
    12,
    0,
    0,
    0
  );

  return date;
}

function getCalendarDifference(
  dateA: Date,
  dateB: Date
) {
  const start =
    dateA <= dateB
      ? new Date(dateA)
      : new Date(dateB);

  const end =
    dateA <= dateB
      ? new Date(dateB)
      : new Date(dateA);

  let years =
    end.getFullYear() -
    start.getFullYear();

  let months =
    end.getMonth() -
    start.getMonth();

  let days =
    end.getDate() -
    start.getDate();

  if (days < 0) {
    months -= 1;

    const previousMonth =
      new Date(
        end.getFullYear(),
        end.getMonth(),
        0
      );

    days +=
      previousMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years,
    months,
    days,
  };
}

function cleanDateInput(
  value: string
) {
  return value.replace(
    /[^0-9-]/g,
    ""
  );
}

function cleanSignedIntegerInput(
  value: string
) {
  let cleaned =
    value.replace(
      /[^0-9-]/g,
      ""
    );

  const negative =
    cleaned.startsWith("-");

  cleaned =
    cleaned.replace(
      /-/g,
      ""
    );

  if (negative) {
    cleaned =
      `-${cleaned}`;
  }

  return cleaned;
}

function formatDate(
  date: Date
) {
  return date.toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

function formatISODate(
  date: Date
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

  return rounded.toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 2,
    }
  );
}

function formatSigned(
  value: number
) {
  if (value > 0) {
    return `+${value}`;
  }

  return String(value);
}

const formCardStyle = {
  backgroundColor:
    theme.card,
  border:
    `1px solid ${theme.border}`,
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
  color: "#6B7482",
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

const calendarMarkStyle = {
  color: theme.primary,
  fontSize: 34,
  fontWeight: 800,
} as const;

const inputLabelStyle = {
  display: "block",
  color: "#AEB5BF",
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 9,
} as const;

const sectionLabelStyle = {
  color: "#F0F2F5",
  fontSize: 15,
  fontWeight: 800,
  marginTop: 25,
  marginBottom: 12,
} as const;

const inputHintStyle = {
  color: "#596370",
  fontSize: 10,
  marginTop: 8,
} as const;

const errorCardStyle = {
  backgroundColor:
    theme.dangerBackground,
  border:
    `1px solid ${theme.dangerBorder}`,
  borderRadius: 13,
  padding: "11px 13px",
  marginTop: 16,
} as const;

const errorTextStyle = {
  color:
    theme.dangerText,
  fontSize: 12,
  lineHeight: "18px",
} as const;

const heroResultStyle = {
  backgroundColor:
    "#11151D",
  border:
    "1px solid #171717",
  borderRadius: 26,
  padding: 24,
} as const;

const heroEyebrowStyle = {
  color: "#171717",
  fontSize: 9,
  fontWeight: 900,
  letterSpacing: 2,
  marginBottom: 10,
} as const;

const heroUnitStyle = {
  color: "#171717",
  fontSize: 15,
  fontWeight: 800,
  marginTop: 1,
} as const;

const heroSubtextStyle = {
  color: "#687280",
  fontSize: 11,
  lineHeight: "18px",
  marginTop: 12,
} as const;

const breakdownCardStyle = {
  backgroundColor:
    theme.surface,
  border:
    "1px solid #1B222D",
  borderRadius: 24,
  padding: 22,
} as const;

const breakdownTitleStyle = {
  color: "#F4F5F7",
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