"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Category =
  | "length"
  | "mass"
  | "temperature"
  | "area"
  | "volume"
  | "speed"
  | "time"
  | "pressure"
  | "energy"
  | "power"
  | "force"
  | "angle"
  | "frequency"
  | "torque"
  | "data"
  | "cooking";

type Unit = {
  key: string;
  label: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
};

type CategoryConfig = {
  name: string;
  icon: string;
  units: Unit[];
};

type LinearUnitDefinition = [
  key: string,
  label: string,
  symbol: string,
  factor: number
];

const theme = {
  background: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceSecondary: "#F7F7F7",
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
};

function linearUnit(
  key: string,
  label: string,
  symbol: string,
  factor: number
): Unit {
  return {
    key,
    label,
    symbol,
    toBase: (value) => value * factor,
    fromBase: (value) => value / factor,
  };
}

function makeLinearUnits(
  definitions: LinearUnitDefinition[]
): Unit[] {
  return definitions.map(
    ([key, label, symbol, factor]) =>
      linearUnit(key, label, symbol, factor)
  );
}

const categories: Record<
  Category,
  CategoryConfig
> = {
  length: {
    name: "Length",
    icon: "↔",
    units: makeLinearUnits([
      ["nm", "Nanometers", "nm", 0.000000001],
      ["um", "Micrometers", "µm", 0.000001],
      ["mm", "Millimeters", "mm", 0.001],
      ["cm", "Centimeters", "cm", 0.01],
      ["dm", "Decimeters", "dm", 0.1],
      ["m", "Meters", "m", 1],
      ["dam", "Decameters", "dam", 10],
      ["hm", "Hectometers", "hm", 100],
      ["km", "Kilometers", "km", 1000],
      ["in", "Inches", "in", 0.0254],
      ["ft", "Feet", "ft", 0.3048],
      ["yd", "Yards", "yd", 0.9144],
      ["mi", "Miles", "mi", 1609.344],
      ["nmi", "Nautical Miles", "nmi", 1852],
      ["mil", "Mils", "mil", 0.0000254],
    ]),
  },

  mass: {
    name: "Mass",
    icon: "⚖",
    units: makeLinearUnits([
      ["ug", "Micrograms", "µg", 0.000000001],
      ["mg", "Milligrams", "mg", 0.000001],
      ["g", "Grams", "g", 0.001],
      ["kg", "Kilograms", "kg", 1],
      ["tonne", "Metric Tons", "t", 1000],
      ["oz", "Ounces", "oz", 0.028349523125],
      ["lb", "Pounds", "lb", 0.45359237],
      ["stone", "Stone", "st", 6.35029318],
      [
        "short-ton",
        "US Tons",
        "short ton",
        907.18474,
      ],
      [
        "long-ton",
        "Imperial Tons",
        "long ton",
        1016.0469088,
      ],
      [
        "grain",
        "Grains",
        "gr",
        0.00006479891,
      ],
    ]),
  },

  temperature: {
    name: "Temperature",
    icon: "°",
    units: [
      {
        key: "c",
        label: "Celsius",
        symbol: "°C",
        toBase: (value) => value,
        fromBase: (value) => value,
      },
      {
        key: "f",
        label: "Fahrenheit",
        symbol: "°F",
        toBase: (value) =>
          ((value - 32) * 5) / 9,
        fromBase: (value) =>
          (value * 9) / 5 + 32,
      },
      {
        key: "k",
        label: "Kelvin",
        symbol: "K",
        toBase: (value) => value - 273.15,
        fromBase: (value) => value + 273.15,
      },
      {
        key: "r",
        label: "Rankine",
        symbol: "°R",
        toBase: (value) =>
          ((value - 491.67) * 5) / 9,
        fromBase: (value) =>
          ((value + 273.15) * 9) / 5,
      },
    ],
  },

  area: {
    name: "Area",
    icon: "□",
    units: makeLinearUnits([
      [
        "sqmm",
        "Square Millimeters",
        "mm²",
        0.000001,
      ],
      [
        "sqcm",
        "Square Centimeters",
        "cm²",
        0.0001,
      ],
      ["sqm", "Square Meters", "m²", 1],
      [
        "sqkm",
        "Square Kilometers",
        "km²",
        1000000,
      ],
      [
        "sqin",
        "Square Inches",
        "in²",
        0.00064516,
      ],
      [
        "sqft",
        "Square Feet",
        "ft²",
        0.09290304,
      ],
      [
        "sqyd",
        "Square Yards",
        "yd²",
        0.83612736,
      ],
      [
        "sqmi",
        "Square Miles",
        "mi²",
        2589988.110336,
      ],
      [
        "acre",
        "Acres",
        "ac",
        4046.8564224,
      ],
      ["hectare", "Hectares", "ha", 10000],
    ]),
  },

  volume: {
    name: "Volume",
    icon: "◇",
    units: makeLinearUnits([
      ["ml", "Milliliters", "mL", 0.001],
      ["cl", "Centiliters", "cL", 0.01],
      ["dl", "Deciliters", "dL", 0.1],
      ["l", "Liters", "L", 1],
      [
        "cubic-cm",
        "Cubic Centimeters",
        "cm³",
        0.001,
      ],
      [
        "cubic-m",
        "Cubic Meters",
        "m³",
        1000,
      ],
      [
        "tsp",
        "US Teaspoons",
        "tsp",
        0.00492892159375,
      ],
      [
        "tbsp",
        "US Tablespoons",
        "tbsp",
        0.01478676478125,
      ],
      [
        "floz",
        "US Fluid Ounces",
        "fl oz",
        0.0295735295625,
      ],
      [
        "cup",
        "US Cups",
        "cup",
        0.2365882365,
      ],
      [
        "pint",
        "US Pints",
        "pt",
        0.473176473,
      ],
      [
        "quart",
        "US Quarts",
        "qt",
        0.946352946,
      ],
      [
        "gallon",
        "US Gallons",
        "gal",
        3.785411784,
      ],
      [
        "imp-floz",
        "Imperial Fluid Ounces",
        "imp fl oz",
        0.0284130625,
      ],
      [
        "imp-pint",
        "Imperial Pints",
        "imp pt",
        0.56826125,
      ],
      [
        "imp-gallon",
        "Imperial Gallons",
        "imp gal",
        4.54609,
      ],
    ]),
  },

  speed: {
    name: "Speed",
    icon: "»",
    units: makeLinearUnits([
      ["mps", "Meters / Second", "m/s", 1],
      [
        "kph",
        "Kilometers / Hour",
        "km/h",
        1 / 3.6,
      ],
      [
        "mph",
        "Miles / Hour",
        "mph",
        0.44704,
      ],
      [
        "fps",
        "Feet / Second",
        "ft/s",
        0.3048,
      ],
      [
        "knot",
        "Knots",
        "kn",
        0.514444444444,
      ],
      ["mach", "Mach", "Mach", 343],
    ]),
  },

  time: {
    name: "Time",
    icon: "◷",
    units: makeLinearUnits([
      [
        "ns",
        "Nanoseconds",
        "ns",
        0.000000001,
      ],
      [
        "us",
        "Microseconds",
        "µs",
        0.000001,
      ],
      [
        "ms",
        "Milliseconds",
        "ms",
        0.001,
      ],
      ["sec", "Seconds", "s", 1],
      ["min", "Minutes", "min", 60],
      ["hr", "Hours", "hr", 3600],
      ["day", "Days", "day", 86400],
      ["week", "Weeks", "week", 604800],
      [
        "fortnight",
        "Fortnights",
        "fortnight",
        1209600,
      ],
      [
        "year",
        "Years",
        "yr",
        31557600,
      ],
    ]),
  },

  pressure: {
    name: "Pressure",
    icon: "P",
    units: makeLinearUnits([
      ["pa", "Pascals", "Pa", 1],
      ["kpa", "Kilopascals", "kPa", 1000],
      [
        "mpa",
        "Megapascals",
        "MPa",
        1000000,
      ],
      ["bar", "Bar", "bar", 100000],
      ["mbar", "Millibar", "mbar", 100],
      [
        "atm",
        "Atmospheres",
        "atm",
        101325,
      ],
      [
        "psi",
        "PSI",
        "psi",
        6894.757293168,
      ],
      [
        "torr",
        "Torr",
        "Torr",
        133.322368421,
      ],
      [
        "mmhg",
        "Millimeters Mercury",
        "mmHg",
        133.322387415,
      ],
    ]),
  },

  energy: {
    name: "Energy",
    icon: "⚡",
    units: makeLinearUnits([
      ["j", "Joules", "J", 1],
      ["kj", "Kilojoules", "kJ", 1000],
      [
        "mj",
        "Megajoules",
        "MJ",
        1000000,
      ],
      ["cal", "Calories", "cal", 4.184],
      [
        "kcal",
        "Kilocalories",
        "kcal",
        4184,
      ],
      ["wh", "Watt Hours", "Wh", 3600],
      [
        "kwh",
        "Kilowatt Hours",
        "kWh",
        3600000,
      ],
      [
        "btu",
        "BTU",
        "BTU",
        1055.05585262,
      ],
      [
        "ftlb",
        "Foot-Pounds",
        "ft⋅lb",
        1.3558179483314,
      ],
      [
        "ev",
        "Electron Volts",
        "eV",
        1.602176634e-19,
      ],
    ]),
  },

  power: {
    name: "Power",
    icon: "W",
    units: makeLinearUnits([
      ["mw", "Milliwatts", "mW", 0.001],
      ["w", "Watts", "W", 1],
      ["kw", "Kilowatts", "kW", 1000],
      [
        "mw-power",
        "Megawatts",
        "MW",
        1000000,
      ],
      [
        "gw",
        "Gigawatts",
        "GW",
        1000000000,
      ],
      [
        "hp",
        "Mechanical Horsepower",
        "hp",
        745.699871582,
      ],
      [
        "metric-hp",
        "Metric Horsepower",
        "PS",
        735.49875,
      ],
      [
        "btuhr",
        "BTU / Hour",
        "BTU/h",
        0.293071070172,
      ],
    ]),
  },

  force: {
    name: "Force",
    icon: "F",
    units: makeLinearUnits([
      ["n", "Newtons", "N", 1],
      [
        "kn",
        "Kilonewtons",
        "kN",
        1000,
      ],
      ["dyn", "Dynes", "dyn", 0.00001],
      [
        "lbf",
        "Pound-Force",
        "lbf",
        4.4482216152605,
      ],
      [
        "kgf",
        "Kilogram-Force",
        "kgf",
        9.80665,
      ],
      [
        "ozf",
        "Ounce-Force",
        "ozf",
        0.278013850953781,
      ],
    ]),
  },

  angle: {
    name: "Angle",
    icon: "∠",
    units: makeLinearUnits([
      ["rad", "Radians", "rad", 1],
      [
        "deg",
        "Degrees",
        "°",
        Math.PI / 180,
      ],
      [
        "grad",
        "Gradians",
        "gon",
        Math.PI / 200,
      ],
      [
        "turn",
        "Turns",
        "turn",
        Math.PI * 2,
      ],
      [
        "arcmin",
        "Arc Minutes",
        "′",
        Math.PI / 10800,
      ],
      [
        "arcsec",
        "Arc Seconds",
        "″",
        Math.PI / 648000,
      ],
    ]),
  },

  frequency: {
    name: "Frequency",
    icon: "Hz",
    units: makeLinearUnits([
      ["hz", "Hertz", "Hz", 1],
      [
        "khz",
        "Kilohertz",
        "kHz",
        1000,
      ],
      [
        "mhz",
        "Megahertz",
        "MHz",
        1000000,
      ],
      [
        "ghz",
        "Gigahertz",
        "GHz",
        1000000000,
      ],
      [
        "thz",
        "Terahertz",
        "THz",
        1000000000000,
      ],
      [
        "rpm",
        "Revolutions / Minute",
        "RPM",
        1 / 60,
      ],
    ]),
  },

  torque: {
    name: "Torque",
    icon: "↻",
    units: makeLinearUnits([
      [
        "nm",
        "Newton-Meters",
        "N⋅m",
        1,
      ],
      [
        "knm",
        "Kilonewton-Meters",
        "kN⋅m",
        1000,
      ],
      [
        "lbft",
        "Pound-Feet",
        "lb⋅ft",
        1.3558179483314,
      ],
      [
        "lbin",
        "Pound-Inches",
        "lb⋅in",
        0.1129848290276167,
      ],
      [
        "kgfm",
        "Kilogram-Force Meters",
        "kgf⋅m",
        9.80665,
      ],
    ]),
  },

  data: {
    name: "Digital Data",
    icon: "01",
    units: makeLinearUnits([
      ["bit", "Bits", "bit", 0.125],
      ["byte", "Bytes", "B", 1],

      [
        "kb-bit",
        "Kilobits",
        "kb",
        125,
      ],
      [
        "mb-bit",
        "Megabits",
        "Mb",
        125000,
      ],
      [
        "gb-bit",
        "Gigabits",
        "Gb",
        125000000,
      ],

      [
        "kb",
        "Kilobytes",
        "KB",
        1000,
      ],
      [
        "mb",
        "Megabytes",
        "MB",
        1000000,
      ],
      [
        "gb",
        "Gigabytes",
        "GB",
        1000000000,
      ],
      [
        "tb",
        "Terabytes",
        "TB",
        1000000000000,
      ],
      [
        "pb",
        "Petabytes",
        "PB",
        1000000000000000,
      ],

      [
        "kib",
        "Kibibytes",
        "KiB",
        1024,
      ],
      [
        "mib",
        "Mebibytes",
        "MiB",
        1048576,
      ],
      [
        "gib",
        "Gibibytes",
        "GiB",
        1073741824,
      ],
      [
        "tib",
        "Tebibytes",
        "TiB",
        1099511627776,
      ],
    ]),
  },

  cooking: {
    name: "Cooking",
    icon: "♨",
    units: makeLinearUnits([
      ["ml", "Milliliters", "mL", 1],
      ["liter", "Liters", "L", 1000],
      [
        "tsp",
        "Teaspoons",
        "tsp",
        4.92892159375,
      ],
      [
        "tbsp",
        "Tablespoons",
        "tbsp",
        14.78676478125,
      ],
      [
        "floz",
        "Fluid Ounces",
        "fl oz",
        29.5735295625,
      ],
      [
        "cup",
        "US Cups",
        "cup",
        236.5882365,
      ],
      [
        "pint",
        "US Pints",
        "pt",
        473.176473,
      ],
      [
        "quart",
        "US Quarts",
        "qt",
        946.352946,
      ],
      [
        "gallon",
        "US Gallons",
        "gal",
        3785.411784,
      ],
    ]),
  },
};

const categoryOrder: Category[] = [
  "length",
  "mass",
  "temperature",
  "area",
  "volume",
  "speed",
  "time",
  "pressure",
  "energy",
  "power",
  "force",
  "angle",
  "frequency",
  "torque",
  "data",
  "cooking",
];

export default function UnitConverterPage() {
  const [category, setCategory] =
    useState<Category>("length");

  const [inputValue, setInputValue] =
    useState("");

  const [fromUnitKey, setFromUnitKey] =
    useState("m");

  const [toUnitKey, setToUnitKey] =
    useState("ft");

  const currentCategory =
    categories[category];

  const fromUnit =
    currentCategory.units.find(
      (unit) => unit.key === fromUnitKey
    ) ?? currentCategory.units[0];

  const toUnit =
    currentCategory.units.find(
      (unit) => unit.key === toUnitKey
    ) ??
    currentCategory.units[1] ??
    currentCategory.units[0];

  const numericInput = Number(inputValue);

  const result = useMemo(() => {
    if (
      inputValue.trim() === "" ||
      !Number.isFinite(numericInput)
    ) {
      return null;
    }

    const baseValue =
      fromUnit.toBase(numericInput);

    const converted =
      toUnit.fromBase(baseValue);

    if (!Number.isFinite(converted)) {
      return null;
    }

    return converted;
  }, [
    inputValue,
    numericInput,
    fromUnit,
    toUnit,
  ]);

  function switchCategory(
    nextCategory: Category
  ) {
    const next =
      categories[nextCategory];

    setCategory(nextCategory);
    setInputValue("");

    setFromUnitKey(
      next.units[0].key
    );

    setToUnitKey(
      next.units[1]?.key ??
        next.units[0].key
    );
  }

  function swapUnits() {
    const previousFrom =
      fromUnitKey;

    setFromUnitKey(toUnitKey);
    setToUnitKey(previousFrom);
  }

  function clearAll() {
    setInputValue("");
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
      <div className="converter-page-container">
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
              Unit Converter
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
            marginBottom: 20,
            maxWidth: 680,
          }}
        >
          Convert measurements,
          technical values, digital
          storage, cooking units and
          more.
        </p>

        {/* STATS */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor:
              theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: 18,
            padding: "14px 0",
            marginBottom: 28,
          }}
        >
          <Stat
            value="16"
            label="CATEGORIES"
          />

          <StatDivider />

          <Stat
            value="100+"
            label="UNITS"
          />

          <StatDivider />

          <Stat
            value="OFF"
            label="NETWORK"
          />
        </div>

        {/* CATEGORY */}

        <div
          style={{
            color:
              theme.textMuted,
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: 1.6,
            marginBottom: 11,
          }}
        >
          CATEGORY
        </div>

        <div className="converter-category-grid">
          {categoryOrder.map(
            (item) => {
              const config =
                categories[item];

              const active =
                item === category;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    switchCategory(item)
                  }
                  style={{
                    minHeight: 78,
                    backgroundColor:
                      active
                        ? theme.primarySoft
                        : theme.surface,
                    border: `1px solid ${
                      active
                        ? theme.primary
                        : theme.border
                    }`,
                    borderRadius: 16,
                    display: "flex",
                    flexDirection:
                      "column",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    padding: "8px 5px",
                    color: active
                      ? theme.primary
                      : theme.textMuted,
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      marginBottom: 6,
                      lineHeight: 1,
                    }}
                  >
                    {config.icon}
                  </span>

                  <span
                    style={{
                      fontSize: 8,
                      fontWeight: 800,
                      textAlign:
                        "center",
                    }}
                  >
                    {config.name}
                  </span>
                </button>
              );
            }
          )}
        </div>

        {/* WORKSPACE */}

        <div className="converter-workspace">
          {/* LEFT */}

          <section
            style={{
              backgroundColor:
                theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: 26,
              padding: 22,
            }}
          >
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
                  CONVERT
                </div>

                <div
                  style={{
                    color: theme.text,
                    fontSize: 21,
                    fontWeight: 800,
                    marginTop: 5,
                  }}
                >
                  {currentCategory.name}
                </div>
              </div>

              <div
                style={{
                  color:
                    theme.primary,
                  fontSize: 32,
                  fontWeight: 900,
                }}
              >
                {currentCategory.icon}
              </div>
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
              Value
            </label>

            <div
              style={{
                minHeight: 66,
                backgroundColor:
                  theme.inputBackground,
                border: `1px solid ${theme.inputBorder}`,
                borderRadius: 18,
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
              }}
            >
              <input
                type="text"
                inputMode="decimal"
                value={inputValue}
                onChange={(event) =>
                  setInputValue(
                    cleanSignedDecimalInput(
                      event.target.value
                    )
                  )
                }
                placeholder="1"
                style={{
                  flex: 1,
                  minWidth: 0,
                  color: theme.text,
                  background:
                    "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 24,
                  fontWeight: 700,
                  padding: "14px 0",
                }}
              />

              <span
                style={{
                  color:
                    theme.primary,
                  fontSize: 16,
                  fontWeight: 800,
                  marginLeft: 8,
                }}
              >
                {fromUnit.symbol}
              </span>
            </div>

            <div
              style={{
                color: theme.text,
                fontSize: 15,
                fontWeight: 800,
                marginTop: 25,
                marginBottom: 11,
              }}
            >
              From
            </div>

            <UnitGrid
              units={
                currentCategory.units
              }
              activeKey={
                fromUnit.key
              }
              onSelect={
                setFromUnitKey
              }
            />

            <button
              type="button"
              onClick={swapUnits}
              style={{
                width: "100%",
                minHeight: 50,
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                gap: 8,
                backgroundColor:
                  theme.surfaceSecondary,
                border: `1px solid ${theme.border}`,
                borderRadius: 15,
                marginTop: 17,
                color:
                  theme.textSecondary,
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  color:
                    theme.primary,
                  fontSize: 20,
                  fontWeight: 900,
                }}
              >
                ⇅
              </span>

              Swap units
            </button>

            <div
              style={{
                color: theme.text,
                fontSize: 15,
                fontWeight: 800,
                marginTop: 25,
                marginBottom: 11,
              }}
            >
              To
            </div>

            <UnitGrid
              units={
                currentCategory.units
              }
              activeKey={
                toUnit.key
              }
              onSelect={
                setToUnitKey
              }
            />

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
                marginTop: 14,
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </section>

          {/* RIGHT */}

          <div className="converter-results-column">
            {result !== null ? (
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
                    RESULT
                  </div>

                  <div
                    style={{
                      color: theme.text,
                      fontSize:
                        "clamp(32px, 5vw, 52px)",
                      fontWeight: 800,
                      letterSpacing: -1.5,
                      overflowWrap:
                        "anywhere",
                    }}
                  >
                    {formatNumber(
                      result
                    )}
                  </div>

                  <div
                    style={{
                      color:
                        theme.primary,
                      fontSize: 16,
                      fontWeight: 800,
                      marginTop: 3,
                    }}
                  >
                    {toUnit.symbol}
                  </div>

                  <div
                    style={{
                      color:
                        theme.textMuted,
                      fontSize: 12,
                      lineHeight: "18px",
                      marginTop: 13,
                      overflowWrap:
                        "anywhere",
                    }}
                  >
                    {formatNumber(
                      numericInput
                    )}{" "}
                    {fromUnit.symbol} ={" "}
                    {formatNumber(
                      result
                    )}{" "}
                    {toUnit.symbol}
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
                      color: theme.text,
                      fontSize: 16,
                      fontWeight: 800,
                      margin:
                        "0 0 20px 0",
                    }}
                  >
                    Conversion details
                  </h2>

                  <DetailRow
                    label="Category"
                    value={
                      currentCategory.name
                    }
                  />

                  <DetailRow
                    label="From"
                    value={`${fromUnit.label} (${fromUnit.symbol})`}
                  />

                  <DetailRow
                    label="To"
                    value={`${toUnit.label} (${toUnit.symbol})`}
                  />

                  <DetailRow
                    label="Input"
                    value={formatNumber(
                      numericInput
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

                  <DetailRow
                    label="Converted"
                    value={formatNumber(
                      result
                    )}
                    strong
                  />
                </section>
              </>
            ) : (
              <section
                className="converter-empty-result"
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
                    alignItems: "center",
                    justifyContent:
                      "center",
                    color:
                      theme.primary,
                    fontSize: 25,
                    fontWeight: 900,
                  }}
                >
                  ⇄
                </div>

                <h2
                  style={{
                    color: theme.text,
                    fontSize: 20,
                    fontWeight: 800,
                    margin:
                      "22px 0 8px",
                  }}
                >
                  Your conversion
                </h2>

                <p
                  style={{
                    color:
                      theme.textSecondary,
                    fontSize: 13,
                    lineHeight: "21px",
                    margin: 0,
                    maxWidth: 430,
                  }}
                >
                  Choose a category,
                  select your units
                  and enter a value to
                  see the converted
                  result here.
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
                Offline conversions
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
                These conversions are
                built directly into
                Bodolvo and do not
                require an internet
                connection. Values are
                mathematical conversions
                and may be rounded for
                display.
              </p>
            </section>
          </div>
        </div>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        .converter-page-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 28px 32px 60px;
        }

        .converter-category-grid {
          display: grid;
          grid-template-columns:
            repeat(8, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 18px;
        }

        .converter-workspace {
          display: grid;
          grid-template-columns:
            minmax(0, 1.08fr)
            minmax(0, 0.92fr);
          gap: 18px;
          align-items: start;
        }

        .converter-results-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 0;
        }

        .converter-unit-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 8px;
        }

        .converter-empty-result {
          min-height: 290px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        @media (max-width: 1100px) {
          .converter-category-grid {
            grid-template-columns:
              repeat(4, minmax(0, 1fr));
          }

          .converter-unit-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .converter-page-container {
            max-width: 760px;
            padding-left: 24px;
            padding-right: 24px;
          }

          .converter-workspace {
            grid-template-columns: 1fr;
          }

          .converter-empty-result {
            min-height: auto;
          }

          .converter-results-column {
            margin-top: 0;
          }
        }

        @media (max-width: 600px) {
          .converter-page-container {
            padding:
              22px 16px 48px;
          }

          .converter-category-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .converter-unit-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 380px) {
          .converter-page-container {
            padding-left: 12px;
            padding-right: 12px;
          }

          .converter-unit-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: theme.text,
          fontSize: 17,
          fontWeight: 900,
        }}
      >
        {value}
      </div>

      <div
        style={{
          color:
            theme.textMuted,
          fontSize: 7,
          fontWeight: 900,
          letterSpacing: 1.1,
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function StatDivider() {
  return (
    <div
      style={{
        width: 1,
        height: 27,
        backgroundColor:
          theme.divider,
      }}
    />
  );
}

function UnitGrid({
  units,
  activeKey,
  onSelect,
}: {
  units: Unit[];
  activeKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="converter-unit-grid">
      {units.map((unit) => {
        const active =
          activeKey === unit.key;

        return (
          <button
            key={unit.key}
            type="button"
            onClick={() =>
              onSelect(unit.key)
            }
            style={{
              minHeight: 62,
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
              display: "flex",
              flexDirection:
                "column",
              alignItems:
                "center",
              justifyContent:
                "center",
              padding: "8px 7px",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                color: active
                  ? theme.primary
                  : theme.textSecondary,
                fontSize: 14,
                fontWeight: 900,
              }}
            >
              {unit.symbol}
            </span>

            <span
              style={{
                color: active
                  ? theme.primary
                  : theme.textMuted,
                fontSize: 8,
                fontWeight: 700,
                marginTop: 4,
                textAlign:
                  "center",
              }}
            >
              {unit.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function DetailRow({
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
            : theme.textSecondary,
          fontSize: strong
            ? 15
            : 13,
          fontWeight: strong
            ? 800
            : 400,
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
          fontSize: strong
            ? 18
            : 13,
          fontWeight: strong
            ? 900
            : 700,
          textAlign: "right",
          maxWidth: "65%",
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </span>
    </div>
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

  if (negative) {
    cleaned =
      `-${cleaned}`;
  }

  return cleaned;
}

function formatNumber(
  value: number
) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  const absolute =
    Math.abs(value);

  if (
    absolute !== 0 &&
    (
      absolute >=
        1000000000000 ||
      absolute <
        0.00000001
    )
  ) {
    return value.toExponential(8);
  }

  const rounded =
    Math.round(
      (
        value +
        Number.EPSILON
      ) *
        100000000
    ) /
    100000000;

  return rounded.toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 8,
    }
  );
}