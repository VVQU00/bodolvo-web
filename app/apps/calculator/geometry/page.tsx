"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Mode =
  | "shapes"
  | "triangle"
  | "angles"
  | "pythagorean"
  | "polygon"
  | "coordinates";

type Shape =
  | "rectangle"
  | "circle"
  | "triangle"
  | "square"
  | "cube"
  | "cylinder"
  | "sphere";

type CoordinateMode =
  | "distance"
  | "midpoint"
  | "slope";

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
  danger: "#F05252",
};

export default function GeometryCalculatorPage() {
  const [mode, setMode] = useState<Mode>("shapes");
  const [shape, setShape] = useState<Shape>("rectangle");

  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [radius, setRadius] = useState("");
  const [height, setHeight] = useState("");
  const [base, setBase] = useState("");
  const [side, setSide] = useState("");

  const [triangleA, setTriangleA] = useState("");
  const [triangleB, setTriangleB] = useState("");
  const [triangleC, setTriangleC] = useState("");

  const [angleValue, setAngleValue] = useState("");

  const [pyA, setPyA] = useState("");
  const [pyB, setPyB] = useState("");
  const [pyC, setPyC] = useState("");

  const [polygonSides, setPolygonSides] = useState("");

  const [coordinateMode, setCoordinateMode] =
    useState<CoordinateMode>("distance");

  const [x1, setX1] = useState("");
  const [y1, setY1] = useState("");
  const [x2, setX2] = useState("");
  const [y2, setY2] = useState("");

  const shapeResult = useMemo(() => {
    const l = Number(length);
    const w = Number(width);
    const r = Number(radius);
    const h = Number(height);
    const b = Number(base);
    const s = Number(side);

    switch (shape) {
      case "rectangle":
        if (!validPositive(l) || !validPositive(w)) return null;

        return {
          title: "Rectangle",
          rows: [
            ["Area", l * w],
            ["Perimeter", 2 * (l + w)],
            ["Diagonal", Math.sqrt(l * l + w * w)],
          ] as [string, number][],
          formula: "A = l × w",
        };

      case "circle":
        if (!validPositive(r)) return null;

        return {
          title: "Circle",
          rows: [
            ["Area", Math.PI * r * r],
            ["Circumference", 2 * Math.PI * r],
            ["Diameter", 2 * r],
          ] as [string, number][],
          formula: "A = πr²",
        };

      case "triangle":
        if (!validPositive(b) || !validPositive(h)) return null;

        return {
          title: "Triangle",
          rows: [["Area", 0.5 * b * h]] as [string, number][],
          formula: "A = ½bh",
        };

      case "square":
        if (!validPositive(s)) return null;

        return {
          title: "Square",
          rows: [
            ["Area", s * s],
            ["Perimeter", 4 * s],
            ["Diagonal", s * Math.sqrt(2)],
          ] as [string, number][],
          formula: "A = s²",
        };

      case "cube":
        if (!validPositive(s)) return null;

        return {
          title: "Cube",
          rows: [
            ["Volume", s ** 3],
            ["Surface Area", 6 * s * s],
            ["Space Diagonal", s * Math.sqrt(3)],
          ] as [string, number][],
          formula: "V = s³",
        };

      case "cylinder":
        if (!validPositive(r) || !validPositive(h)) return null;

        return {
          title: "Cylinder",
          rows: [
            ["Volume", Math.PI * r * r * h],
            ["Surface Area", 2 * Math.PI * r * (r + h)],
            ["Base Area", Math.PI * r * r],
          ] as [string, number][],
          formula: "V = πr²h",
        };

      case "sphere":
        if (!validPositive(r)) return null;

        return {
          title: "Sphere",
          rows: [
            ["Volume", (4 / 3) * Math.PI * r ** 3],
            ["Surface Area", 4 * Math.PI * r * r],
            ["Diameter", 2 * r],
          ] as [string, number][],
          formula: "V = ⁴⁄₃πr³",
        };
    }
  }, [shape, length, width, radius, height, base, side]);

  const triangleResult = useMemo(() => {
    const a = Number(triangleA);
    const b = Number(triangleB);
    const c = Number(triangleC);

    if (
      !validPositive(a) ||
      !validPositive(b) ||
      !validPositive(c)
    ) {
      return null;
    }

    const sides = [a, b, c].sort((x, y) => x - y);
    const [smallA, smallB, largest] = sides;

    if (smallA + smallB <= largest) {
      return {
        valid: false,
        type: "Not a triangle",
        reason:
          "The two shorter sides must add up to more than the longest side.",
        sideType: "",
      };
    }

    const left = smallA * smallA + smallB * smallB;
    const right = largest * largest;
    const epsilon = 0.0000001;

    let angleType = "";

    if (Math.abs(left - right) < epsilon) {
      angleType = "Right";
    } else if (left > right) {
      angleType = "Acute";
    } else {
      angleType = "Obtuse";
    }

    let sideType = "";

    if (a === b && b === c) {
      sideType = "Equilateral";
    } else if (a === b || b === c || a === c) {
      sideType = "Isosceles";
    } else {
      sideType = "Scalene";
    }

    return {
      valid: true,
      type: `${angleType} triangle`,
      reason:
        angleType === "Right"
          ? "a² + b² = c²"
          : angleType === "Acute"
          ? "a² + b² > c²"
          : "a² + b² < c²",
      sideType,
    };
  }, [triangleA, triangleB, triangleC]);

  const angleResult = useMemo(() => {
    const angle = Number(angleValue);

    if (
      angleValue.trim() === "" ||
      !Number.isFinite(angle)
    ) {
      return null;
    }

    let type = "";

    if (angle < 0 || angle > 360) {
      type = "Outside standard 0°–360° range";
    } else if (angle === 0) {
      type = "Zero angle";
    } else if (angle < 90) {
      type = "Acute angle";
    } else if (angle === 90) {
      type = "Right angle";
    } else if (angle < 180) {
      type = "Obtuse angle";
    } else if (angle === 180) {
      type = "Straight angle";
    } else if (angle < 360) {
      type = "Reflex angle";
    } else {
      type = "Full angle";
    }

    const complement =
      angle >= 0 && angle <= 90 ? 90 - angle : null;

    const supplement =
      angle >= 0 && angle <= 180 ? 180 - angle : null;

    return {
      angle,
      type,
      complement,
      supplement,
    };
  }, [angleValue]);

  const pythagoreanResult = useMemo(() => {
    const a = parseOptionalNumber(pyA);
    const b = parseOptionalNumber(pyB);
    const c = parseOptionalNumber(pyC);

    const filled = [a, b, c].filter(
      (value) => value !== null
    );

    if (filled.length !== 2) {
      return null;
    }

    if (
      filled.some(
        (value) =>
          value !== null &&
          value <= 0
      )
    ) {
      return null;
    }

    if (a === null && b !== null && c !== null) {
      if (c <= b) {
        return {
          error:
            "Hypotenuse must be longer than either leg.",
        };
      }

      return {
        missing: "a",
        value: Math.sqrt(c * c - b * b),
        formula: "a = √(c² − b²)",
      };
    }

    if (b === null && a !== null && c !== null) {
      if (c <= a) {
        return {
          error:
            "Hypotenuse must be longer than either leg.",
        };
      }

      return {
        missing: "b",
        value: Math.sqrt(c * c - a * a),
        formula: "b = √(c² − a²)",
      };
    }

    if (c === null && a !== null && b !== null) {
      return {
        missing: "c",
        value: Math.sqrt(a * a + b * b),
        formula: "c = √(a² + b²)",
      };
    }

    return null;
  }, [pyA, pyB, pyC]);

  const polygonResult = useMemo(() => {
    const n = Number(polygonSides);

    if (
      polygonSides.trim() === "" ||
      !Number.isInteger(n) ||
      n < 3
    ) {
      return null;
    }

    return {
      sides: n,
      interiorSum: (n - 2) * 180,
      eachInterior: ((n - 2) * 180) / n,
      eachExterior: 360 / n,
      diagonals: (n * (n - 3)) / 2,
    };
  }, [polygonSides]);

  const coordinateResult = useMemo(() => {
    const a = Number(x1);
    const b = Number(y1);
    const c = Number(x2);
    const d = Number(y2);

    if (
      [x1, y1, x2, y2].some(
        (value) => value.trim() === ""
      ) ||
      ![a, b, c, d].every(Number.isFinite)
    ) {
      return null;
    }

    if (coordinateMode === "distance") {
      return {
        label: "Distance",
        value: Math.sqrt(
          (c - a) ** 2 +
            (d - b) ** 2
        ),
        extra: `√((${formatNumber(
          c - a
        )})² + (${formatNumber(
          d - b
        )})²)`,
      };
    }

    if (coordinateMode === "midpoint") {
      return {
        label: "Midpoint",
        value: null,
        extra: `(${formatNumber(
          (a + c) / 2
        )}, ${formatNumber(
          (b + d) / 2
        )})`,
      };
    }

    if (c - a === 0) {
      return {
        label: "Slope",
        value: null,
        extra: "Undefined",
      };
    }

    const slope =
      (d - b) / (c - a);

    return {
      label: "Slope",
      value: slope,
      extra: `(${formatNumber(
        d - b
      )}) ÷ (${formatNumber(
        c - a
      )})`,
    };
  }, [
    x1,
    y1,
    x2,
    y2,
    coordinateMode,
  ]);

  function clearAll() {
    setLength("");
    setWidth("");
    setRadius("");
    setHeight("");
    setBase("");
    setSide("");

    setTriangleA("");
    setTriangleB("");
    setTriangleC("");

    setAngleValue("");

    setPyA("");
    setPyB("");
    setPyC("");

    setPolygonSides("");

    setX1("");
    setY1("");
    setX2("");
    setY2("");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      <div className="geometry-page-container">
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
              Geometry Lab
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
              }}
            >
              MATH
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
          Solve shapes, triangles, angles, polygons and coordinate
          geometry.
        </p>

        <div className="geometry-mode-grid">
          <ModeButton
            label="Shapes"
            active={mode === "shapes"}
            onClick={() => setMode("shapes")}
          />
          <ModeButton
            label="Triangles"
            active={mode === "triangle"}
            onClick={() => setMode("triangle")}
          />
          <ModeButton
            label="Angles"
            active={mode === "angles"}
            onClick={() => setMode("angles")}
          />
          <ModeButton
            label="Pythagorean"
            active={mode === "pythagorean"}
            onClick={() => setMode("pythagorean")}
          />
          <ModeButton
            label="Polygons"
            active={mode === "polygon"}
            onClick={() => setMode("polygon")}
          />
          <ModeButton
            label="Coordinates"
            active={mode === "coordinates"}
            onClick={() => setMode("coordinates")}
          />
        </div>

        {mode === "shapes" && (
          <div className="geometry-workspace">
            <div>
              <Card>
              <SectionHeader
                eyebrow="SHAPE CALCULATOR"
                title="Measurements"
                mark="△"
              />

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {(
                  [
                    "rectangle",
                    "circle",
                    "triangle",
                    "square",
                    "cube",
                    "cylinder",
                    "sphere",
                  ] as Shape[]
                ).map((item) => (
                  <ChoiceButton
                    key={item}
                    label={capitalize(item)}
                    active={shape === item}
                    onClick={() => setShape(item)}
                  />
                ))}
              </div>

              <div style={{ marginTop: 18 }}>
                {shape === "rectangle" && (
                  <>
                    <NumberField
                      label="Length"
                      value={length}
                      onChange={setLength}
                    />
                    <NumberField
                      label="Width"
                      value={width}
                      onChange={setWidth}
                    />
                  </>
                )}

                {shape === "circle" && (
                  <NumberField
                    label="Radius"
                    value={radius}
                    onChange={setRadius}
                  />
                )}

                {shape === "triangle" && (
                  <>
                    <NumberField
                      label="Base"
                      value={base}
                      onChange={setBase}
                    />
                    <NumberField
                      label="Height"
                      value={height}
                      onChange={setHeight}
                    />
                  </>
                )}

                {(shape === "square" || shape === "cube") && (
                  <NumberField
                    label="Side"
                    value={side}
                    onChange={setSide}
                  />
                )}

                {shape === "cylinder" && (
                  <>
                    <NumberField
                      label="Radius"
                      value={radius}
                      onChange={setRadius}
                    />
                    <NumberField
                      label="Height"
                      value={height}
                      onChange={setHeight}
                    />
                  </>
                )}

                {shape === "sphere" && (
                  <NumberField
                    label="Radius"
                    value={radius}
                    onChange={setRadius}
                  />
                )}
              </div>

                <ClearButton onClick={clearAll} />
              </Card>
            </div>

            <div className="geometry-results-column">
              {shapeResult && (
              <ResultPanel
                title={shapeResult.title}
                rows={shapeResult.rows}
                formula={shapeResult.formula}
                />
              )}
            </div>
          </div>
        )}

        {mode === "triangle" && (
          <div className="geometry-workspace">
            <div>
              <Card>
              <SectionHeader
                eyebrow="TRIANGLE CLASSIFIER"
                title="Three sides"
                mark="△"
              />

              <p style={helperStyle}>
                Enter all three side lengths to classify the triangle
                by both sides and angles.
              </p>

              <NumberField
                label="Side A"
                value={triangleA}
                onChange={setTriangleA}
              />
              <NumberField
                label="Side B"
                value={triangleB}
                onChange={setTriangleB}
              />
              <NumberField
                label="Side C"
                value={triangleC}
                onChange={setTriangleC}
              />

                <ClearButton onClick={clearAll} />
              </Card>
            </div>

            <div className="geometry-results-column">
              {triangleResult && (
              <section
                style={{
                  ...resultCardStyle,
                  borderColor: triangleResult.valid
                    ? theme.primary
                    : theme.danger,
                }}
              >
                <div style={eyebrowStyle}>
                  TRIANGLE RESULT
                </div>

                <div
                  style={{
                    color: theme.text,
                    fontSize: 28,
                    fontWeight: 800,
                    lineHeight: "36px",
                  }}
                >
                  {triangleResult.type}
                </div>

                {triangleResult.sideType && (
                  <div
                    style={{
                      color: theme.primary,
                      fontSize: 16,
                      fontWeight: 800,
                      marginTop: 7,
                    }}
                  >
                    {triangleResult.sideType}
                  </div>
                )}

                <p style={resultSubtextStyle}>
                  {triangleResult.reason}
                </p>
                </section>
              )}
            </div>
          </div>
        )}

        {mode === "angles" && (
          <div className="geometry-workspace">
            <div>
              <Card>
              <SectionHeader
                eyebrow="ANGLE CLASSIFIER"
                title="Angle"
                mark="∠"
              />

              <NumberField
                label="Angle"
                suffix="°"
                value={angleValue}
                onChange={(value) =>
                  setAngleValue(cleanNumberInput(value, true))
                }
              />

                <ClearButton onClick={clearAll} />
              </Card>
            </div>

            <div className="geometry-results-column">
              {angleResult && (
              <>
                <section style={resultCardStyle}>
                  <div style={eyebrowStyle}>
                    ANGLE TYPE
                  </div>

                  <div
                    style={{
                      color: theme.text,
                      fontSize: 28,
                      fontWeight: 800,
                    }}
                  >
                    {angleResult.type}
                  </div>

                  <div
                    style={{
                      color: theme.primary,
                      fontSize: 16,
                      fontWeight: 800,
                      marginTop: 7,
                    }}
                  >
                    {formatNumber(angleResult.angle)}°
                  </div>
                </section>

                <section style={panelStyle}>
                  <h2 style={panelTitleStyle}>
                    Related angles
                  </h2>

                  <ResultRow
                    label="Complement"
                    value={
                      angleResult.complement === null
                        ? "Not available"
                        : `${formatNumber(
                            angleResult.complement
                          )}°`
                    }
                  />

                  <ResultRow
                    label="Supplement"
                    value={
                      angleResult.supplement === null
                        ? "Not available"
                        : `${formatNumber(
                            angleResult.supplement
                          )}°`
                    }
                  />
                </section>
                </>
              )}
            </div>
          </div>
        )}

        {mode === "pythagorean" && (
          <div className="geometry-workspace">
            <div>
              <Card>
              <SectionHeader
                eyebrow="PYTHAGOREAN THEOREM"
                title="Right triangle"
                mark="△"
              />

              <p style={helperStyle}>
                Fill in exactly two sides. Leave the side you want to
                solve blank. C is the hypotenuse.
              </p>

              <NumberField
                label="Side A"
                value={pyA}
                onChange={setPyA}
              />
              <NumberField
                label="Side B"
                value={pyB}
                onChange={setPyB}
              />
              <NumberField
                label="Hypotenuse C"
                value={pyC}
                onChange={setPyC}
              />

                <ClearButton onClick={clearAll} />
              </Card>
            </div>

            <div className="geometry-results-column">
              {pythagoreanResult &&
              "error" in pythagoreanResult && (
                <div style={errorStyle}>
                  {pythagoreanResult.error}
                </div>
              )}

            {pythagoreanResult &&
              !("error" in pythagoreanResult) && (
                <section style={resultCardStyle}>
                  <div style={eyebrowStyle}>
                    MISSING SIDE
                  </div>

                  <div
                    style={{
                      color: theme.text,
                      fontSize: 28,
                      fontWeight: 800,
                    }}
                  >
                    {pythagoreanResult.missing} ={" "}
                    {formatNumber(
                      pythagoreanResult.value
                    )}
                  </div>

                  <div
                    style={{
                      color: theme.primary,
                      fontSize: 14,
                      fontWeight: 800,
                      marginTop: 10,
                    }}
                  >
                    {pythagoreanResult.formula}
                  </div>
                  </section>
                )}
            </div>
          </div>
        )}

        {mode === "polygon" && (
          <div className="geometry-workspace">
            <div>
              <Card>
              <SectionHeader
                eyebrow="REGULAR POLYGON"
                title="Polygon angles"
                mark="⬡"
              />

              <p style={helperStyle}>
                Enter the number of sides. A polygon must have at
                least 3 sides.
              </p>

              <NumberField
                label="Number of sides"
                value={polygonSides}
                onChange={(value) =>
                  setPolygonSides(
                    value.replace(/[^0-9]/g, "")
                  )
                }
              />

                <ClearButton onClick={clearAll} />
              </Card>
            </div>

            <div className="geometry-results-column">
              {polygonResult && (
              <section style={panelStyle}>
                <h2 style={panelTitleStyle}>
                  {polygonResult.sides}-sided polygon
                </h2>

                <ResultRow
                  label="Interior angle sum"
                  value={`${formatNumber(
                    polygonResult.interiorSum
                  )}°`}
                />

                <ResultRow
                  label="Each interior angle"
                  value={`${formatNumber(
                    polygonResult.eachInterior
                  )}°`}
                />

                <ResultRow
                  label="Each exterior angle"
                  value={`${formatNumber(
                    polygonResult.eachExterior
                  )}°`}
                />

                <ResultRow
                  label="Diagonals"
                  value={formatNumber(
                    polygonResult.diagonals
                  )}
                  strong
                />
                </section>
              )}
            </div>
          </div>
        )}

        {mode === "coordinates" && (
          <div className="geometry-workspace">
            <div>
              <Card>
              <SectionHeader
                eyebrow="COORDINATE GEOMETRY"
                title="Two points"
                mark="⌖"
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 7,
                  marginBottom: 20,
                }}
              >
                {(
                  [
                    "distance",
                    "midpoint",
                    "slope",
                  ] as CoordinateMode[]
                ).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setCoordinateMode(item)
                    }
                    style={{
                      minHeight: 44,
                      backgroundColor:
                        coordinateMode === item
                          ? theme.primarySoft
                          : theme.surface,
                      border: `1px solid ${
                        coordinateMode === item
                          ? theme.primary
                          : theme.border
                      }`,
                      borderRadius: 13,
                      color:
                        coordinateMode === item
                          ? theme.primary
                          : theme.textMuted,
                      fontSize: 10,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {capitalize(item)}
                  </button>
                ))}
              </div>

              <div
                style={{
                  color: theme.text,
                  fontSize: 13,
                  fontWeight: 800,
                  marginBottom: 10,
                }}
              >
                Point 1
              </div>

              <div style={twoColumnStyle}>
                <NumberField
                  label="X₁"
                  value={x1}
                  allowNegative
                  onChange={setX1}
                />
                <NumberField
                  label="Y₁"
                  value={y1}
                  allowNegative
                  onChange={setY1}
                />
              </div>

              <div
                style={{
                  color: theme.text,
                  fontSize: 13,
                  fontWeight: 800,
                  marginBottom: 10,
                  marginTop: 5,
                }}
              >
                Point 2
              </div>

              <div style={twoColumnStyle}>
                <NumberField
                  label="X₂"
                  value={x2}
                  allowNegative
                  onChange={setX2}
                />
                <NumberField
                  label="Y₂"
                  value={y2}
                  allowNegative
                  onChange={setY2}
                />
              </div>

                <ClearButton onClick={clearAll} />
              </Card>
            </div>

            <div className="geometry-results-column">
              {coordinateResult && (
              <section style={resultCardStyle}>
                <div style={eyebrowStyle}>
                  {coordinateResult.label.toUpperCase()}
                </div>

                <div
                  style={{
                    color: theme.text,
                    fontSize: 28,
                    fontWeight: 800,
                    overflowWrap: "anywhere",
                  }}
                >
                  {coordinateResult.value === null
                    ? coordinateResult.extra
                    : formatNumber(
                        coordinateResult.value
                      )}
                </div>

                {coordinateResult.value !== null && (
                  <div
                    style={{
                      color: theme.primary,
                      fontSize: 13,
                      fontWeight: 800,
                      marginTop: 10,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {coordinateResult.extra}
                  </div>
                )}
                </section>
              )}
            </div>
          </div>
        )}

        <section
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: 20,
            padding: 17,
            marginTop: 16,
          }}
        >
          <div
            style={{
              color: theme.textSecondary,
              fontSize: 13,
              fontWeight: 800,
              marginBottom: 7,
            }}
          >
            Geometry Lab
          </div>

          <p
            style={{
              color: theme.textMuted,
              fontSize: 11,
              lineHeight: "18px",
              margin: 0,
            }}
          >
            Results are rounded to a maximum of six decimal places.
          </p>
        </section>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        .geometry-page-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 28px 32px 60px;
        }

        .geometry-mode-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 18px;
        }

        .geometry-workspace {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 18px;
          align-items: start;
        }

        .geometry-results-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 0;
        }

        @media (max-width: 1050px) {
          .geometry-mode-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .geometry-page-container {
            max-width: 760px;
            padding-left: 24px;
            padding-right: 24px;
          }

          .geometry-workspace {
            grid-template-columns: 1fr;
          }

          .geometry-results-column {
            gap: 16px;
          }

          .geometry-results-column > section,
          .geometry-results-column > div {
            margin-top: 0 !important;
          }
        }

        @media (max-width: 600px) {
          .geometry-page-container {
            padding: 22px 16px 48px;
          }

          .geometry-mode-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 430px) {
          .geometry-page-container {
            padding-left: 14px;
            padding-right: 14px;
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
        width: "100%",
        minHeight: 48,
        backgroundColor: active
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
        fontSize: 10,
        fontWeight: 800,
        cursor: "pointer",
        padding: "0 7px",
      }}
    >
      {label}
    </button>
  );
}

function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        backgroundColor: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 26,
        padding: 20,
      }}
    >
      {children}
    </section>
  );
}

function SectionHeader({
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
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 22,
      }}
    >
      <div>
        <div
          style={{
            color: theme.textMuted,
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
          fontSize: 30,
          fontWeight: 900,
        }}
      >
        {mark}
      </div>
    </div>
  );
}

function ChoiceButton({
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
        width: "100%",
        minHeight: 46,
        backgroundColor: active
          ? theme.primarySoft
          : theme.surface,
        border: `1px solid ${
          active
            ? theme.primary
            : theme.border
        }`,
        borderRadius: 13,
        color: active
          ? theme.primary
          : theme.textMuted,
        fontSize: 10,
        fontWeight: 800,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function NumberField({
  label,
  value,
  onChange,
  suffix,
  allowNegative = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  allowNegative?: boolean;
}) {
  return (
    <div
      style={{
        flex: 1,
        marginBottom: 14,
      }}
    >
      <label
        style={{
          display: "block",
          color: theme.textSecondary,
          fontSize: 11,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        {label}
      </label>

      <div
        style={{
          minHeight: 58,
          backgroundColor: theme.inputBackground,
          border: `1px solid ${theme.inputBorder}`,
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
        }}
      >
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) =>
            onChange(
              cleanNumberInput(
                event.target.value,
                allowNegative
              )
            )
          }
          placeholder="0"
          style={{
            flex: 1,
            minWidth: 0,
            background: "transparent",
            border: "none",
            outline: "none",
            color: theme.text,
            fontSize: 18,
            fontWeight: 700,
            padding: "13px 0",
          }}
        />

        {suffix && (
          <span
            style={{
              color: theme.primary,
              fontSize: 16,
              fontWeight: 800,
            }}
          >
            {suffix}
          </span>
        )}
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
        minHeight: 48,
        border: "none",
        background: "transparent",
        color: theme.textMuted,
        fontSize: 12,
        fontWeight: 700,
        marginTop: 18,
        cursor: "pointer",
      }}
    >
      Clear
    </button>
  );
}

function ResultPanel({
  title,
  rows,
  formula,
}: {
  title: string;
  rows: [string, number][];
  formula: string;
}) {
  return (
    <section style={panelStyle}>
      <h2 style={panelTitleStyle}>
        {title}
      </h2>

      {rows.map(([label, value]) => (
        <ResultRow
          key={label}
          label={label}
          value={formatNumber(value)}
        />
      ))}

      <div
        style={{
          height: 1,
          backgroundColor: theme.divider,
          marginBottom: 15,
        }}
      />

      <div
        style={{
          color: theme.primary,
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        {formula}
      </div>
    </section>
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
        justifyContent: "space-between",
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
          fontSize: 13,
          fontWeight: strong ? 800 : 400,
          flex: 1,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: strong
            ? theme.text
            : theme.textSecondary,
          fontSize: strong ? 17 : 14,
          fontWeight: strong ? 900 : 700,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function validPositive(value: number) {
  return Number.isFinite(value) && value > 0;
}

function parseOptionalNumber(value: string) {
  if (value.trim() === "") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}

function cleanNumberInput(
  value: string,
  allowNegative = false
) {
  let cleaned = value.replace(
    allowNegative
      ? /[^0-9.-]/g
      : /[^0-9.]/g,
    ""
  );

  const negative =
    allowNegative &&
    cleaned.startsWith("-");

  cleaned = cleaned.replace(/-/g, "");

  const firstDecimal =
    cleaned.indexOf(".");

  if (firstDecimal !== -1) {
    cleaned =
      cleaned.slice(0, firstDecimal + 1) +
      cleaned
        .slice(firstDecimal + 1)
        .replace(/\./g, "");
  }

  return negative
    ? `-${cleaned}`
    : cleaned;
}

function capitalize(value: string) {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  const rounded =
    Math.round(
      (value + Number.EPSILON) *
        1000000
    ) / 1000000;

  return rounded.toLocaleString("en-US", {
    maximumFractionDigits: 6,
  });
}

const helperStyle = {
  color: theme.textMuted,
  fontSize: 11,
  lineHeight: "17px",
  marginBottom: 17,
} as const;

const resultCardStyle = {
  backgroundColor: theme.card,
  border: `1px solid ${theme.primary}`,
  borderRadius: 26,
  padding: 22,
  marginTop: 0,
} as const;

const eyebrowStyle = {
  color: theme.primary,
  fontSize: 9,
  fontWeight: 900,
  letterSpacing: 2,
  marginBottom: 10,
} as const;

const resultSubtextStyle = {
  color: theme.textMuted,
  fontSize: 11,
  lineHeight: "18px",
  marginTop: 10,
  marginBottom: 0,
} as const;

const panelStyle = {
  backgroundColor: theme.surface,
  border: `1px solid ${theme.border}`,
  borderRadius: 24,
  padding: 20,
  marginTop: 0,
} as const;

const panelTitleStyle = {
  color: theme.text,
  fontSize: 17,
  fontWeight: 800,
  marginTop: 0,
  marginBottom: 18,
} as const;

const errorStyle = {
  backgroundColor: `${theme.danger}14`,
  border: `1px solid ${theme.danger}55`,
  borderRadius: 15,
  padding: 14,
  marginTop: 0,
  color: theme.danger,
  fontSize: 12,
  lineHeight: "18px",
} as const;

const twoColumnStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
} as const;