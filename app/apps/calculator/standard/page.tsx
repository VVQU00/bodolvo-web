"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Operator = "+" | "−" | "×" | "÷";

const lightTheme = {
  background: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceSecondary: "#F6F6F6",
  card: "#FFFFFF",
  cardPressed: "#EEEEEE",
  text: "#171717",
  textSecondary: "#4B4B4B",
  textMuted: "#626262",
  border: "#D9D9D9",
  primary: "#171717",
  primarySoft: "#F5F5F5",
};

const darkTheme = {
  background: "#07090D",
  surface: "#0D1117",
  surfaceSecondary: "#131922",
  card: "#10151D",
  cardPressed: "#18202B",
  text: "#F5F7FA",
  textSecondary: "#AEB7C4",
  textMuted: "#788391",
  border: "#202833",
  primary: "#171717",
  primarySoft: "#102A43",
};

export default function StandardCalculatorPage() {
  const [display, setDisplay] = useState("0");
  const [firstValue, setFirstValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForSecondValue, setWaitingForSecondValue] =
    useState(false);

  const [history, setHistory] = useState<string[]>([]);

  const theme = lightTheme;

  const displayText = useMemo(() => {
    if (display === "Error") return display;

    if (display.length <= 14) return display;

    const numeric = Number(display);

    if (!Number.isFinite(numeric)) return display;

    return numeric.toExponential(7);
  }, [display]);

  function clearAll() {
    setDisplay("0");
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecondValue(false);
  }

  function inputDigit(digit: string) {
    if (display === "Error") {
      setDisplay(digit);
      setFirstValue(null);
      setOperator(null);
      setWaitingForSecondValue(false);
      return;
    }

    if (waitingForSecondValue) {
      setDisplay(digit);
      setWaitingForSecondValue(false);
      return;
    }

    if (display === "0") {
      setDisplay(digit);
      return;
    }

    if (display.replace("-", "").replace(".", "").length >= 14) {
      return;
    }

    setDisplay((current) => current + digit);
  }

  function inputDecimal() {
    if (display === "Error") {
      setDisplay("0.");
      setFirstValue(null);
      setOperator(null);
      setWaitingForSecondValue(false);
      return;
    }

    if (waitingForSecondValue) {
      setDisplay("0.");
      setWaitingForSecondValue(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay((current) => current + ".");
    }
  }

  function backspace() {
    if (display === "Error") {
      clearAll();
      return;
    }

    if (waitingForSecondValue) return;

    if (display.length <= 1) {
      setDisplay("0");
      return;
    }

    if (display.length === 2 && display.startsWith("-")) {
      setDisplay("0");
      return;
    }

    setDisplay((current) => current.slice(0, -1));
  }

  function toggleSign() {
    if (display === "Error") {
      clearAll();
      return;
    }

    if (display === "0") return;

    setDisplay((current) =>
      current.startsWith("-") ? current.slice(1) : `-${current}`
    );
  }

  function percentage() {
    if (display === "Error") {
      clearAll();
      return;
    }

    const value = Number(display);

    if (!Number.isFinite(value)) return;

    setDisplay(formatResult(value / 100));
  }

  function calculate(
    left: number,
    right: number,
    selectedOperator: Operator
  ) {
    switch (selectedOperator) {
      case "+":
        return left + right;
      case "−":
        return left - right;
      case "×":
        return left * right;
      case "÷":
        return right === 0 ? NaN : left / right;
    }
  }

  function chooseOperator(nextOperator: Operator) {
    if (display === "Error") {
      clearAll();
      return;
    }

    const inputValue = Number(display);

    if (!Number.isFinite(inputValue)) {
      return;
    }

    if (
      operator !== null &&
      firstValue !== null &&
      !waitingForSecondValue
    ) {
      const result = calculate(firstValue, inputValue, operator);

      if (!Number.isFinite(result)) {
        setDisplay("Error");
        setFirstValue(null);
        setOperator(null);
        setWaitingForSecondValue(true);
        return;
      }

      setDisplay(formatResult(result));
      setFirstValue(result);
    } else {
      setFirstValue(inputValue);
    }

    setOperator(nextOperator);
    setWaitingForSecondValue(true);
  }

  function equals() {
    if (
      firstValue === null ||
      operator === null ||
      waitingForSecondValue ||
      display === "Error"
    ) {
      return;
    }

    const secondValue = Number(display);

    const result = calculate(firstValue, secondValue, operator);

    if (!Number.isFinite(result)) {
      setDisplay("Error");
      setFirstValue(null);
      setOperator(null);
      setWaitingForSecondValue(true);
      return;
    }

    const formattedResult = formatResult(result);

    const expression = `${formatResult(firstValue)} ${operator} ${formatResult(
      secondValue
    )} = ${formattedResult}`;

    setHistory((current) => [expression, ...current].slice(0, 10));

    setDisplay(formattedResult);
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecondValue(true);
  }

  function useHistoryResult(item: string) {
    const result = item.split("=").pop()?.trim();

    if (!result) return;

    setDisplay(result);
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecondValue(true);
  }

  const expression =
    firstValue !== null && operator
      ? `${formatResult(firstValue)} ${operator}`
      : "Standard";

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      <div className="standard-page-container">
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
            marginBottom: 24,
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
              Standard
            </h1>
          </div>

          <div
            style={{
              backgroundColor: theme.primarySoft,
              border: `1px solid ${theme.border}`,
              borderRadius: 999,
              padding: "6px 11px",
              marginBottom: 3,
              color: theme.primary,
              fontSize: 8,
              fontWeight: 900,
              letterSpacing: 1.2,
            }}
          >
            STANDARD
          </div>
        </div>

        <div className="standard-workspace">
          <div className="standard-calculator-column">
            <section
              style={{
                minHeight: 170,
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 28,
                padding: 22,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                marginBottom: 14,
              }}
            >
          <div
            style={{
              color: theme.textSecondary,
              fontSize: 15,
              textAlign: "right",
              marginBottom: 10,
            }}
          >
            {expression}
          </div>

          <div
            style={{
              color: theme.text,
              fontSize: "clamp(38px, 9vw, 56px)",
              fontWeight: 300,
              textAlign: "right",
              letterSpacing: -2,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {displayText}
          </div>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
          }}
        >
          <CalculatorButton
            label="AC"
            variant="utility"
            onClick={clearAll}
            theme={theme}
          />

          <CalculatorButton
            label="+/−"
            variant="utility"
            onClick={toggleSign}
            theme={theme}
          />

          <CalculatorButton
            label="%"
            variant="utility"
            onClick={percentage}
            theme={theme}
          />

          <CalculatorButton
            label="÷"
            variant="operator"
            active={operator === "÷"}
            onClick={() => chooseOperator("÷")}
            theme={theme}
          />

          <CalculatorButton
            label="7"
            onClick={() => inputDigit("7")}
            theme={theme}
          />

          <CalculatorButton
            label="8"
            onClick={() => inputDigit("8")}
            theme={theme}
          />

          <CalculatorButton
            label="9"
            onClick={() => inputDigit("9")}
            theme={theme}
          />

          <CalculatorButton
            label="×"
            variant="operator"
            active={operator === "×"}
            onClick={() => chooseOperator("×")}
            theme={theme}
          />

          <CalculatorButton
            label="4"
            onClick={() => inputDigit("4")}
            theme={theme}
          />

          <CalculatorButton
            label="5"
            onClick={() => inputDigit("5")}
            theme={theme}
          />

          <CalculatorButton
            label="6"
            onClick={() => inputDigit("6")}
            theme={theme}
          />

          <CalculatorButton
            label="−"
            variant="operator"
            active={operator === "−"}
            onClick={() => chooseOperator("−")}
            theme={theme}
          />

          <CalculatorButton
            label="1"
            onClick={() => inputDigit("1")}
            theme={theme}
          />

          <CalculatorButton
            label="2"
            onClick={() => inputDigit("2")}
            theme={theme}
          />

          <CalculatorButton
            label="3"
            onClick={() => inputDigit("3")}
            theme={theme}
          />

          <CalculatorButton
            label="+"
            variant="operator"
            active={operator === "+"}
            onClick={() => chooseOperator("+")}
            theme={theme}
          />

          <CalculatorButton
            label="⌫"
            variant="utility"
            onClick={backspace}
            theme={theme}
          />

          <CalculatorButton
            label="0"
            onClick={() => inputDigit("0")}
            theme={theme}
          />

          <CalculatorButton
            label="."
            onClick={inputDecimal}
            theme={theme}
          />

          <CalculatorButton
            label="="
            variant="equals"
            onClick={equals}
            theme={theme}
          />
        </div>

          </div>

          <div className="standard-history-column">
            <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h2
              style={{
                color: theme.text,
                fontSize: 18,
                fontWeight: 800,
                margin: 0,
              }}
            >
              History
            </h2>

            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setHistory([])}
                style={{
                  border: "none",
                  background: "transparent",
                  color: theme.primary,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 18,
                padding: 18,
                color: theme.textMuted,
                fontSize: 13,
                lineHeight: "20px",
              }}
            >
              Your recent calculations will appear here.
            </div>
          ) : (
            history.map((item, index) => (
              <button
                key={`${item}-${index}`}
                type="button"
                onClick={() => useHistoryResult(item)}
                style={{
                  width: "100%",
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 17,
                  padding: "14px 16px",
                  marginBottom: 8,
                  color: theme.textSecondary,
                  fontSize: 14,
                  textAlign: "right",
                  cursor: "pointer",
                }}
              >
                {item}
              </button>
            ))
          )}
            </section>
          </div>
        </div>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        .standard-page-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 28px 32px 50px;
        }

        .standard-workspace {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 0.78fr);
          gap: 18px;
          align-items: start;
        }

        .standard-calculator-column,
        .standard-history-column {
          min-width: 0;
        }

        @media (max-width: 900px) {
          .standard-page-container {
            max-width: 760px;
            padding-left: 24px;
            padding-right: 24px;
          }

          .standard-workspace {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .standard-page-container {
            padding: 22px 16px 48px;
          }
        }

        @media (max-width: 380px) {
          .standard-page-container {
            padding-left: 12px;
            padding-right: 12px;
          }
        }
      `}</style>
    </main>
  );
}

function CalculatorButton({
  label,
  onClick,
  variant = "number",
  active = false,
  theme,
}: {
  label: string;
  onClick: () => void;
  variant?: "number" | "utility" | "operator" | "equals";
  active?: boolean;
  theme: typeof lightTheme;
}) {
  let backgroundColor = theme.card;
  let color = theme.text;
  let borderColor = theme.border;
  let fontSize = 25;
  let fontWeight = 600;

  if (variant === "utility") {
    backgroundColor = theme.surfaceSecondary;
    color = theme.textSecondary;
    fontSize = 19;
  }

  if (variant === "operator") {
    backgroundColor = theme.primarySoft;
    color = theme.primary;
    fontSize = 29;
  }

  if (variant === "equals") {
    backgroundColor = theme.primary;
    color = "#FFFFFF";
    borderColor = theme.primary;
    fontSize = 30;
    fontWeight = 800;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        aspectRatio: "1 / 1",
        width: "100%",
        borderRadius: 24,
        backgroundColor,
        border: `${active ? 2 : 1}px solid ${
          active ? theme.primary : borderColor
        }`,
        color,
        fontSize,
        fontWeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "transform 100ms ease, opacity 100ms ease",
      }}
      onMouseDown={(event) => {
        event.currentTarget.style.transform = "scale(0.96)";
        event.currentTarget.style.opacity = "0.65";
      }}
      onMouseUp={(event) => {
        event.currentTarget.style.transform = "scale(1)";
        event.currentTarget.style.opacity = "1";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = "scale(1)";
        event.currentTarget.style.opacity = "1";
      }}
    >
      {label}
    </button>
  );
}

function formatResult(value: number) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  const rounded =
    Math.round((value + Number.EPSILON) * 10000000000) /
    10000000000;

  return String(rounded);
}