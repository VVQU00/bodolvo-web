"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Operator = "+" | "−" | "×" | "÷" | "^";
type AngleMode = "DEG" | "RAD";

const theme = {
  background: "#07090D",
  surface: "#0D1117",
  surfaceSecondary: "#131922",
  card: "#10151D",
  text: "#F5F7FA",
  textSecondary: "#AEB7C4",
  textMuted: "#788391",
  border: "#202833",
  primary: "#208AEF",
  primarySoft: "#102A43",
};

export default function ScientificCalculatorPage() {
  const [display, setDisplay] = useState("0");
  const [firstValue, setFirstValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForSecondValue, setWaitingForSecondValue] =
    useState(false);

  const [angleMode, setAngleMode] = useState<AngleMode>("DEG");
  const [history, setHistory] = useState<string[]>([]);

  const displayText = useMemo(() => {
    if (display === "Error") {
      return display;
    }

    if (display.length <= 15) {
      return display;
    }

    const number = Number(display);

    if (!Number.isFinite(number)) {
      return display;
    }

    return number.toExponential(8);
  }, [display]);

  function clearAll() {
    setDisplay("0");
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecondValue(false);
  }

  function showError() {
    setDisplay("Error");
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecondValue(true);
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

    if (
      display.replace("-", "").replace(".", "").length >= 15
    ) {
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

    if (waitingForSecondValue) {
      return;
    }

    if (
      display.length <= 1 ||
      (display.length === 2 && display.startsWith("-"))
    ) {
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

    if (display === "0") {
      return;
    }

    setDisplay((current) =>
      current.startsWith("-")
        ? current.slice(1)
        : `-${current}`
    );
  }

  function calculateBinary(
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
      case "^":
        return Math.pow(left, right);
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
      const result = calculateBinary(
        firstValue,
        inputValue,
        operator
      );

      if (!Number.isFinite(result)) {
        showError();
        return;
      }

      setDisplay(formatNumber(result));
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

    const result = calculateBinary(
      firstValue,
      secondValue,
      operator
    );

    if (!Number.isFinite(result)) {
      showError();
      return;
    }

    const formatted = formatNumber(result);

    const entry = `${formatNumber(
      firstValue
    )} ${operator} ${formatNumber(
      secondValue
    )} = ${formatted}`;

    setHistory((current) =>
      [entry, ...current].slice(0, 10)
    );

    setDisplay(formatted);
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecondValue(true);
  }

  function applyUnary(
    label: string,
    operation: (value: number) => number
  ) {
    if (display === "Error") {
      clearAll();
      return;
    }

    const value = Number(display);

    if (!Number.isFinite(value)) {
      showError();
      return;
    }

    const result = operation(value);

    if (!Number.isFinite(result)) {
      showError();
      return;
    }

    const formatted = formatNumber(result);

    const entry = `${label}(${formatNumber(
      value
    )}) = ${formatted}`;

    setHistory((current) =>
      [entry, ...current].slice(0, 10)
    );

    setDisplay(formatted);
    setWaitingForSecondValue(true);
  }

  function applyTrig(trig: "sin" | "cos" | "tan") {
    applyUnary(trig, (value) => {
      const angle =
        angleMode === "DEG"
          ? (value * Math.PI) / 180
          : value;

      if (trig === "sin") {
        return Math.sin(angle);
      }

      if (trig === "cos") {
        return Math.cos(angle);
      }

      return Math.tan(angle);
    });
  }

  function factorial() {
    if (display === "Error") {
      clearAll();
      return;
    }

    const value = Number(display);

    if (
      !Number.isInteger(value) ||
      value < 0 ||
      value > 170
    ) {
      showError();
      return;
    }

    let result = 1;

    for (let index = 2; index <= value; index++) {
      result *= index;
    }

    const formatted = formatNumber(result);

    const entry = `${value}! = ${formatted}`;

    setHistory((current) =>
      [entry, ...current].slice(0, 10)
    );

    setDisplay(formatted);
    setWaitingForSecondValue(true);
  }

  function insertConstant(value: number) {
    setDisplay(formatNumber(value));
    setWaitingForSecondValue(false);
  }

  function useHistoryResult(item: string) {
    const result = item.split("=").pop()?.trim();

    if (!result) {
      return;
    }

    setDisplay(result);
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecondValue(true);
  }

  const expression =
    firstValue !== null && operator !== null
      ? `${formatNumber(firstValue)} ${operator}`
      : "Scientific";

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      <div className="scientific-page-container">
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
            marginBottom: 18,
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
              Scientific
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
              MATH
            </span>
          </div>
        </div>

        <div
          className="scientific-angle-switch"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 5,
            padding: 5,
            borderRadius: 18,
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            marginBottom: 14,
          }}
        >
          <AngleButton
            label="DEG"
            active={angleMode === "DEG"}
            onClick={() => setAngleMode("DEG")}
          />

          <AngleButton
            label="RAD"
            active={angleMode === "RAD"}
            onClick={() => setAngleMode("RAD")}
          />
        </div>

        <div className="scientific-workspace">
          <div className="scientific-calculator-column">
            <section
              style={{
                minHeight: 165,
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 26,
                padding: 22,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                marginBottom: 12,
              }}
            >
          <div
            style={{
              color: theme.textSecondary,
              fontSize: 14,
              textAlign: "right",
              marginBottom: 9,
            }}
          >
            {expression}
          </div>

          <div
            style={{
              color: theme.text,
              fontSize: "clamp(36px, 9vw, 52px)",
              fontWeight: 300,
              letterSpacing: -1.5,
              textAlign: "right",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {displayText}
          </div>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <ScientificButton
            label="sin"
            onClick={() => applyTrig("sin")}
          />
          <ScientificButton
            label="cos"
            onClick={() => applyTrig("cos")}
          />
          <ScientificButton
            label="tan"
            onClick={() => applyTrig("tan")}
          />
          <ScientificButton
            label="π"
            onClick={() => insertConstant(Math.PI)}
          />

          <ScientificButton
            label="ln"
            onClick={() => applyUnary("ln", Math.log)}
          />
          <ScientificButton
            label="log"
            onClick={() => applyUnary("log", Math.log10)}
          />
          <ScientificButton
            label="√x"
            onClick={() => applyUnary("√", Math.sqrt)}
          />
          <ScientificButton
            label="e"
            onClick={() => insertConstant(Math.E)}
          />

          <ScientificButton
            label="x²"
            onClick={() =>
              applyUnary("square", (value) => value * value)
            }
          />
          <ScientificButton
            label="xʸ"
            active={operator === "^"}
            onClick={() => chooseOperator("^")}
          />
          <ScientificButton
            label="1/x"
            onClick={() =>
              applyUnary(
                "1/x",
                (value) => (value === 0 ? NaN : 1 / value)
              )
            }
          />
          <ScientificButton
            label="x!"
            onClick={factorial}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 9,
          }}
        >
          <CalculatorButton
            label="AC"
            variant="utility"
            onClick={clearAll}
          />

          <CalculatorButton
            label="+/−"
            variant="utility"
            onClick={toggleSign}
          />

          <CalculatorButton
            label="⌫"
            variant="utility"
            onClick={backspace}
          />

          <CalculatorButton
            label="÷"
            variant="operator"
            active={operator === "÷"}
            onClick={() => chooseOperator("÷")}
          />

          <CalculatorButton
            label="7"
            onClick={() => inputDigit("7")}
          />
          <CalculatorButton
            label="8"
            onClick={() => inputDigit("8")}
          />
          <CalculatorButton
            label="9"
            onClick={() => inputDigit("9")}
          />

          <CalculatorButton
            label="×"
            variant="operator"
            active={operator === "×"}
            onClick={() => chooseOperator("×")}
          />

          <CalculatorButton
            label="4"
            onClick={() => inputDigit("4")}
          />
          <CalculatorButton
            label="5"
            onClick={() => inputDigit("5")}
          />
          <CalculatorButton
            label="6"
            onClick={() => inputDigit("6")}
          />

          <CalculatorButton
            label="−"
            variant="operator"
            active={operator === "−"}
            onClick={() => chooseOperator("−")}
          />

          <CalculatorButton
            label="1"
            onClick={() => inputDigit("1")}
          />
          <CalculatorButton
            label="2"
            onClick={() => inputDigit("2")}
          />
          <CalculatorButton
            label="3"
            onClick={() => inputDigit("3")}
          />

          <CalculatorButton
            label="+"
            variant="operator"
            active={operator === "+"}
            onClick={() => chooseOperator("+")}
          />

          <CalculatorButton
            label="0"
            onClick={() => inputDigit("0")}
          />

          <CalculatorButton
            label="."
            onClick={inputDecimal}
          />

          <button
            type="button"
            onClick={equals}
            style={{
              gridColumn: "span 2",
              minHeight: 74,
              borderRadius: 22,
              border: `1px solid ${theme.primary}`,
              backgroundColor: theme.primary,
              color: "#FFFFFF",
              fontSize: 29,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            =
          </button>
        </div>

          </div>

          <div className="scientific-history-column">
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
              }}
            >
              Scientific calculations will appear here.
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

        .scientific-page-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 28px 32px 60px;
        }

        .scientific-angle-switch {
          max-width: 560px;
        }

        .scientific-workspace {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
          gap: 18px;
          align-items: start;
        }

        .scientific-calculator-column,
        .scientific-history-column {
          min-width: 0;
        }

        .scientific-history-column {
          position: sticky;
          top: 24px;
        }

        @media (max-width: 900px) {
          .scientific-page-container {
            max-width: 760px;
            padding-left: 24px;
            padding-right: 24px;
          }

          .scientific-workspace {
            grid-template-columns: 1fr;
          }

          .scientific-angle-switch {
            max-width: none;
          }

          .scientific-history-column {
            position: static;
          }
        }

        @media (max-width: 600px) {
          .scientific-page-container {
            padding: 22px 16px 48px;
          }
        }

        @media (max-width: 380px) {
          .scientific-page-container {
            padding-left: 12px;
            padding-right: 12px;
          }
        }
      `}</style>
    </main>
  );
}

function AngleButton({
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
        minHeight: 46,
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

function ScientificButton({
  label,
  onClick,
  active = false,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minHeight: 55,
        borderRadius: 16,
        border: `1px solid ${
          active ? theme.primary : theme.border
        }`,
        backgroundColor: active
          ? theme.primarySoft
          : theme.surfaceSecondary,
        color: theme.primary,
        fontSize: 15,
        fontWeight: 800,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function CalculatorButton({
  label,
  onClick,
  variant = "number",
  active = false,
}: {
  label: string;
  onClick: () => void;
  variant?: "number" | "utility" | "operator";
  active?: boolean;
}) {
  let backgroundColor = theme.card;
  let color = theme.text;
  let fontSize = 23;

  if (variant === "utility") {
    backgroundColor = theme.surfaceSecondary;
    color = theme.textSecondary;
    fontSize = 17;
  }

  if (variant === "operator") {
    backgroundColor = theme.primarySoft;
    color = theme.primary;
    fontSize = 27;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minHeight: 74,
        borderRadius: 22,
        border: `1px solid ${
          active ? theme.primary : theme.border
        }`,
        backgroundColor,
        color,
        fontSize,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  if (Object.is(value, -0)) {
    return "0";
  }

  const absolute = Math.abs(value);

  if (
    absolute !== 0 &&
    (absolute >= 1e12 || absolute < 1e-9)
  ) {
    return value.toExponential(8);
  }

  const rounded =
    Math.round((value + Number.EPSILON) * 1e12) / 1e12;

  return String(rounded);
}