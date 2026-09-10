"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type BaseMode = 2 | 8 | 10 | 16;

type Operator =
  | "+"
  | "−"
  | "×"
  | "÷"
  | "AND"
  | "OR"
  | "XOR"
  | "<<"
  | ">>";

type HistoryItem = {
  expression: string;
  value: number;
};

const MAX_SAFE_BIGINT = BigInt(Number.MAX_SAFE_INTEGER);
const MIN_SAFE_BIGINT = BigInt(Number.MIN_SAFE_INTEGER);

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

  primary: "#208AEF",
  primarySoft: "#102A43",
};

export default function ProgrammerCalculatorPage() {
  const [displayValue, setDisplayValue] = useState("0");
  const [baseMode, setBaseMode] = useState<BaseMode>(10);
  const [firstValue, setFirstValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForSecondValue, setWaitingForSecondValue] =
    useState(false);

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const currentDecimalValue = parseDisplayValue(
    displayValue,
    baseMode
  );

  const baseRepresentations = useMemo(() => {
    if (currentDecimalValue === null) {
      return {
        dec: "Error",
        hex: "Error",
        oct: "Error",
        bin: "Error",
      };
    }

    return {
      dec: formatForBase(currentDecimalValue, 10),
      hex: formatForBase(currentDecimalValue, 16),
      oct: formatForBase(currentDecimalValue, 8),
      bin: formatForBase(currentDecimalValue, 2),
    };
  }, [currentDecimalValue]);

  const expression =
    firstValue !== null && operator !== null
      ? `${formatForBase(firstValue, baseMode)} ${operator}`
      : "Programmer";

  function clearAll() {
    setDisplayValue("0");
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecondValue(false);
  }

  function showError() {
    setDisplayValue("Error");
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecondValue(true);
  }

  function inputDigit(digit: string) {
    if (!digitAllowedForBase(digit, baseMode)) {
      return;
    }

    if (displayValue === "Error") {
      setDisplayValue(digit);
      setFirstValue(null);
      setOperator(null);
      setWaitingForSecondValue(false);
      return;
    }

    if (waitingForSecondValue) {
      setDisplayValue(digit);
      setWaitingForSecondValue(false);
      return;
    }

    if (displayValue === "0") {
      setDisplayValue(digit);
      return;
    }

    const negative = displayValue.startsWith("-");

    const body = negative
      ? displayValue.slice(1)
      : displayValue;

    if (body.length >= 32) {
      return;
    }

    setDisplayValue((current) => current + digit);
  }

  function backspace() {
    if (displayValue === "Error") {
      clearAll();
      return;
    }

    if (waitingForSecondValue) {
      return;
    }

    if (
      displayValue.length <= 1 ||
      (displayValue.length === 2 &&
        displayValue.startsWith("-"))
    ) {
      setDisplayValue("0");
      return;
    }

    setDisplayValue((current) => current.slice(0, -1));
  }

  function toggleSign() {
    if (displayValue === "Error") {
      clearAll();
      return;
    }

    if (displayValue === "0") {
      return;
    }

    setDisplayValue((current) =>
      current.startsWith("-")
        ? current.slice(1)
        : `-${current}`
    );
  }

  function chooseOperator(nextOperator: Operator) {
    if (displayValue === "Error") {
      clearAll();
      return;
    }

    const inputValue = parseDisplayValue(
      displayValue,
      baseMode
    );

    if (inputValue === null) {
      showError();
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

      if (result === null) {
        showError();
        return;
      }

      setFirstValue(result);
      setDisplayValue(
        formatForBase(result, baseMode)
      );
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
      displayValue === "Error"
    ) {
      return;
    }

    const secondValue = parseDisplayValue(
      displayValue,
      baseMode
    );

    if (secondValue === null) {
      showError();
      return;
    }

    const result = calculateBinary(
      firstValue,
      secondValue,
      operator
    );

    if (result === null) {
      showError();
      return;
    }

    const expressionText =
      `${formatForBase(firstValue, baseMode)} ` +
      `${operator} ` +
      `${formatForBase(secondValue, baseMode)} = ` +
      `${formatForBase(result, baseMode)}`;

    setHistory((current) =>
      [
        {
          expression: expressionText,
          value: result,
        },
        ...current,
      ].slice(0, 10)
    );

    setDisplayValue(
      formatForBase(result, baseMode)
    );

    setFirstValue(null);
    setOperator(null);
    setWaitingForSecondValue(true);
  }

  function applyNot() {
    const value = parseDisplayValue(
      displayValue,
      baseMode
    );

    if (value === null) {
      showError();
      return;
    }

    const result = bitwiseNot(value);

    setDisplayValue(
      formatForBase(result, baseMode)
    );

    setHistory((current) =>
      [
        {
          expression:
            `NOT ${formatForBase(value, baseMode)} = ` +
            `${formatForBase(result, baseMode)}`,
          value: result,
        },
        ...current,
      ].slice(0, 10)
    );

    setWaitingForSecondValue(true);
  }

  function switchBase(nextBase: BaseMode) {
    const currentValue = parseDisplayValue(
      displayValue,
      baseMode
    );

    setBaseMode(nextBase);

    if (currentValue === null) {
      setDisplayValue("0");
      return;
    }

    setDisplayValue(
      formatForBase(currentValue, nextBase)
    );
  }

  function useHistory(item: HistoryItem) {
    setDisplayValue(
      formatForBase(item.value, baseMode)
    );

    setFirstValue(null);
    setOperator(null);
    setWaitingForSecondValue(true);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      <div className="programmer-page-container">
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
              Programmer
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
              TECH
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
          Work with decimal, hexadecimal, octal, binary and
          bitwise operations.
        </p>

        <div
          className="programmer-base-selector"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 5,
            padding: 5,
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: 18,
            marginBottom: 14,
          }}
        >
          <BaseButton
            label="DEC"
            active={baseMode === 10}
            onClick={() => switchBase(10)}
          />

          <BaseButton
            label="HEX"
            active={baseMode === 16}
            onClick={() => switchBase(16)}
          />

          <BaseButton
            label="OCT"
            active={baseMode === 8}
            onClick={() => switchBase(8)}
          />

          <BaseButton
            label="BIN"
            active={baseMode === 2}
            onClick={() => switchBase(2)}
          />
        </div>

        <div className="programmer-workspace">
          <div className="programmer-calculator-column">
            <section
              style={{
                minHeight: 160,
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
              fontSize: "clamp(34px, 9vw, 50px)",
              fontWeight: 300,
              letterSpacing: -1.5,
              textAlign: "right",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {displayValue}
          </div>
        </section>

        <section
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: 20,
            padding: "8px 16px",
            marginBottom: 12,
          }}
        >
          <BaseRow
            label="DEC"
            value={baseRepresentations.dec}
          />

          <BaseRow
            label="HEX"
            value={baseRepresentations.hex}
          />

          <BaseRow
            label="OCT"
            value={baseRepresentations.oct}
          />

          <BaseRow
            label="BIN"
            value={baseRepresentations.bin}
          />
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <ProgrammerButton
            label="AND"
            variant="bitwise"
            active={operator === "AND"}
            onClick={() => chooseOperator("AND")}
          />

          <ProgrammerButton
            label="OR"
            variant="bitwise"
            active={operator === "OR"}
            onClick={() => chooseOperator("OR")}
          />

          <ProgrammerButton
            label="XOR"
            variant="bitwise"
            active={operator === "XOR"}
            onClick={() => chooseOperator("XOR")}
          />

          <ProgrammerButton
            label="NOT"
            variant="bitwise"
            onClick={applyNot}
          />

          <ProgrammerButton
            label="<<"
            variant="bitwise"
            active={operator === "<<"}
            onClick={() => chooseOperator("<<")}
          />

          <ProgrammerButton
            label=">>"
            variant="bitwise"
            active={operator === ">>"}
            onClick={() => chooseOperator(">>")}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
          }}
        >
          <ProgrammerButton
            label="AC"
            variant="utility"
            onClick={clearAll}
          />

          <ProgrammerButton
            label="+/−"
            variant="utility"
            onClick={toggleSign}
          />

          <ProgrammerButton
            label="⌫"
            variant="utility"
            onClick={backspace}
          />

          <ProgrammerButton
            label="÷"
            variant="operator"
            active={operator === "÷"}
            onClick={() => chooseOperator("÷")}
          />

          <ProgrammerButton
            label="A"
            disabled={baseMode !== 16}
            onClick={() => inputDigit("A")}
          />

          <ProgrammerButton
            label="B"
            disabled={baseMode !== 16}
            onClick={() => inputDigit("B")}
          />

          <ProgrammerButton
            label="C"
            disabled={baseMode !== 16}
            onClick={() => inputDigit("C")}
          />

          <ProgrammerButton
            label="×"
            variant="operator"
            active={operator === "×"}
            onClick={() => chooseOperator("×")}
          />

          <ProgrammerButton
            label="D"
            disabled={baseMode !== 16}
            onClick={() => inputDigit("D")}
          />

          <ProgrammerButton
            label="E"
            disabled={baseMode !== 16}
            onClick={() => inputDigit("E")}
          />

          <ProgrammerButton
            label="F"
            disabled={baseMode !== 16}
            onClick={() => inputDigit("F")}
          />

          <ProgrammerButton
            label="−"
            variant="operator"
            active={operator === "−"}
            onClick={() => chooseOperator("−")}
          />

          <ProgrammerButton
            label="7"
            disabled={baseMode === 2}
            onClick={() => inputDigit("7")}
          />

          <ProgrammerButton
            label="8"
            disabled={baseMode === 2 || baseMode === 8}
            onClick={() => inputDigit("8")}
          />

          <ProgrammerButton
            label="9"
            disabled={baseMode === 2 || baseMode === 8}
            onClick={() => inputDigit("9")}
          />

          <ProgrammerButton
            label="+"
            variant="operator"
            active={operator === "+"}
            onClick={() => chooseOperator("+")}
          />

          <ProgrammerButton
            label="4"
            disabled={baseMode === 2}
            onClick={() => inputDigit("4")}
          />

          <ProgrammerButton
            label="5"
            disabled={baseMode === 2}
            onClick={() => inputDigit("5")}
          />

          <ProgrammerButton
            label="6"
            disabled={baseMode === 2}
            onClick={() => inputDigit("6")}
          />

          <ProgrammerButton
            label="="
            variant="equals"
            onClick={equals}
          />

          <ProgrammerButton
            label="1"
            onClick={() => inputDigit("1")}
          />

          <ProgrammerButton
            label="2"
            disabled={baseMode === 2}
            onClick={() => inputDigit("2")}
          />

          <ProgrammerButton
            label="3"
            disabled={baseMode === 2}
            onClick={() => inputDigit("3")}
          />

          <button
            type="button"
            onClick={() => inputDigit("0")}
            style={{
              gridColumn: "span 2",
              minHeight: 66,
              backgroundColor: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: 20,
              color: theme.text,
              fontSize: 22,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            0
          </button>
        </div>

          </div>

          <div className="programmer-side-column">
            <section
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 20,
                padding: 17,
              }}
            >
              <div
                style={{
                  color: theme.text,
                  fontSize: 14,
                  fontWeight: 800,
                  marginBottom: 7,
                }}
              >
                Integer operations
              </div>

          <p
            style={{
              color: theme.textMuted,
              fontSize: 11,
              lineHeight: "18px",
              margin: 0,
            }}
          >
            Programmer mode uses whole-number arithmetic for bitwise
            operations. Decimal, hexadecimal, octal and binary values
            stay synchronized.
          </p>
        </section>

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
              Programmer calculations will appear here.
            </div>
          ) : (
            history.map((item, index) => (
              <button
                key={`${item.expression}-${index}`}
                type="button"
                onClick={() => useHistory(item)}
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
                  overflowWrap: "anywhere",
                }}
              >
                {item.expression}
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

        .programmer-page-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 28px 32px 60px;
        }

        .programmer-base-selector {
          max-width: 560px;
        }

        .programmer-workspace {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
          gap: 18px;
          align-items: start;
        }

        .programmer-calculator-column,
        .programmer-side-column {
          min-width: 0;
        }

        .programmer-side-column {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        @media (max-width: 900px) {
          .programmer-page-container {
            max-width: 760px;
            padding-left: 24px;
            padding-right: 24px;
          }

          .programmer-workspace {
            grid-template-columns: 1fr;
          }

          .programmer-base-selector {
            max-width: none;
          }
        }

        @media (max-width: 600px) {
          .programmer-page-container {
            padding: 22px 16px 48px;
          }
        }

        @media (max-width: 380px) {
          .programmer-page-container {
            padding-left: 12px;
            padding-right: 12px;
          }
        }
      `}</style>
    </main>
  );
}

function BaseButton({
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
        fontSize: 11,
        fontWeight: 800,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function BaseRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        minHeight: 42,
        display: "flex",
        alignItems: "center",
        gap: 12,
        borderBottom: `1px solid ${theme.divider}`,
      }}
    >
      <div
        style={{
          width: 38,
          flexShrink: 0,
          color: theme.primary,
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: 1,
        }}
      >
        {label}
      </div>

      <div
        style={{
          minWidth: 0,
          flex: 1,
          color: theme.textSecondary,
          fontSize: 13,
          fontWeight: 700,
          textAlign: "right",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ProgrammerButton({
  label,
  onClick,
  variant = "number",
  active = false,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  variant?:
    | "number"
    | "utility"
    | "operator"
    | "equals"
    | "bitwise";
  active?: boolean;
  disabled?: boolean;
}) {
  let backgroundColor = theme.card;
  let color = theme.text;
  let borderColor = theme.border;

  if (variant === "utility") {
    backgroundColor = theme.surfaceSecondary;
    color = theme.textSecondary;
  }

  if (variant === "operator") {
    backgroundColor = theme.primarySoft;
    color = theme.primary;
  }

  if (variant === "equals") {
    backgroundColor = theme.primary;
    color = "#FFFFFF";
    borderColor = theme.primary;
  }

  if (variant === "bitwise") {
    backgroundColor = theme.surfaceSecondary;
    color = theme.primary;
  }

  if (active) {
    borderColor = theme.primary;
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        minHeight: 66,
        backgroundColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 20,
        color,
        fontSize:
          variant === "bitwise"
            ? 13
            : variant === "operator" || variant === "equals"
            ? 24
            : 18,
        fontWeight: 800,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.25 : 1,
      }}
    >
      {label}
    </button>
  );
}

function digitAllowedForBase(
  digit: string,
  base: BaseMode
) {
  const upper = digit.toUpperCase();

  if (
    ["A", "B", "C", "D", "E", "F"].includes(upper)
  ) {
    return base === 16;
  }

  const number = Number(digit);

  if (!Number.isInteger(number)) {
    return false;
  }

  return number < base;
}

function parseDisplayValue(
  display: string,
  base: BaseMode
): number | null {
  if (display === "Error") {
    return null;
  }

  const negative = display.startsWith("-");

  const body = negative
    ? display.slice(1)
    : display;

  if (body.length === 0) {
    return null;
  }

  if (
    !body
      .split("")
      .every((character) =>
        digitAllowedForBase(character, base)
      )
  ) {
    return null;
  }

  const parsed = parseInt(body, base);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  const value = negative
    ? -parsed
    : parsed;

  if (!Number.isSafeInteger(value)) {
    return null;
  }

  return value;
}

function formatForBase(
  value: number,
  base: BaseMode
) {
  if (!Number.isSafeInteger(value)) {
    return "Error";
  }

  const negative = value < 0;
  const absolute = Math.abs(value);

  const body = absolute
    .toString(base)
    .toUpperCase();

  return negative
    ? `-${body}`
    : body;
}

function calculateBinary(
  left: number,
  right: number,
  selectedOperator: Operator
): number | null {
  if (
    !Number.isSafeInteger(left) ||
    !Number.isSafeInteger(right)
  ) {
    return null;
  }

  switch (selectedOperator) {
    case "+":
      return safeIntegerResult(left + right);

    case "−":
      return safeIntegerResult(left - right);

    case "×":
      return safeIntegerResult(left * right);

    case "÷":
      if (right === 0) {
        return null;
      }

      return safeIntegerResult(
        Math.trunc(left / right)
      );

    case "AND":
      return performBigIntBinary(
        left,
        right,
        (a, b) => a & b
      );

    case "OR":
      return performBigIntBinary(
        left,
        right,
        (a, b) => a | b
      );

    case "XOR":
      return performBigIntBinary(
        left,
        right,
        (a, b) => a ^ b
      );

    case "<<":
      if (right < 0 || right > 53) {
        return null;
      }

      return performBigIntBinary(
        left,
        right,
        (a, b) => a << b
      );

    case ">>":
      if (right < 0 || right > 53) {
        return null;
      }

      return performBigIntBinary(
        left,
        right,
        (a, b) => a >> b
      );
  }
}

function bitwiseNot(value: number) {
  const result = ~BigInt(value);

  if (
    result > MAX_SAFE_BIGINT ||
    result < MIN_SAFE_BIGINT
  ) {
    return 0;
  }

  return Number(result);
}

function performBigIntBinary(
  left: number,
  right: number,
  operation: (
    a: bigint,
    b: bigint
  ) => bigint
): number | null {
  try {
    const result = operation(
      BigInt(left),
      BigInt(right)
    );

    if (
      result > MAX_SAFE_BIGINT ||
      result < MIN_SAFE_BIGINT
    ) {
      return null;
    }

    return Number(result);
  } catch {
    return null;
  }
}

function safeIntegerResult(
  value: number
) {
  return Number.isSafeInteger(value)
    ? value
    : null;
}