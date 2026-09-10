"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ThemePreference = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

type Calculator = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "Everyday" | "Money" | "Math" | "Utilities";
};

const calculators: Calculator[] = [
  {
    id: "standard",
    name: "Standard",
    description: "Everyday arithmetic",
    icon: "＋",
    category: "Everyday",
  },
  {
    id: "percentage",
    name: "Percentage",
    description: "Percentages & change",
    icon: "%",
    category: "Everyday",
  },
  {
    id: "tip",
    name: "Tip & Split",
    description: "Bills, tips & groups",
    icon: "$",
    category: "Everyday",
  },
  {
    id: "discount",
    name: "Discount",
    description: "Sales & final prices",
    icon: "↓",
    category: "Everyday",
  },
  {
    id: "loan",
    name: "Loan",
    description: "Payments & interest",
    icon: "▣",
    category: "Money",
  },
  {
    id: "compound-interest",
    name: "Compound Interest",
    description: "Grow money over time",
    icon: "↗",
    category: "Money",
  },
  {
    id: "salary",
    name: "Salary",
    description: "Hourly to yearly",
    icon: "⌁",
    category: "Money",
  },
  {
    id: "savings",
    name: "Savings",
    description: "Savings goals",
    icon: "◎",
    category: "Money",
  },
  {
    id: "scientific",
    name: "Scientific",
    description: "Advanced mathematics",
    icon: "π",
    category: "Math",
  },
  {
    id: "fraction",
    name: "Fractions",
    description: "Calculate & simplify",
    icon: "½",
    category: "Math",
  },
  {
    id: "geometry",
    name: "Geometry",
    description: "Shapes, triangles, angles & more",
    icon: "△",
    category: "Math",
  },
  {
    id: "programmer",
    name: "Programmer",
    description: "Binary, hex & bitwise",
    icon: "01",
    category: "Math",
  },
  {
    id: "converter",
    name: "Unit Converter",
    description: "100+ units across 16 categories",
    icon: "⇄",
    category: "Utilities",
  },
  {
    id: "date-time",
    name: "Date & Time",
    description: "Dates, age & duration",
    icon: "◷",
    category: "Utilities",
  },
  {
    id: "fuel",
    name: "Fuel",
    description: "Mileage & trip cost",
    icon: "◇",
    category: "Utilities",
  },
  {
    id: "random",
    name: "Random",
    description: "Numbers, dice & coin",
    icon: "⚂",
    category: "Utilities",
  },
];

const categories = ["Everyday", "Money", "Math", "Utilities"] as const;

const lightTheme = {
  background: "#F4F7FB",
  surface: "#FFFFFF",
  surfaceSecondary: "#EDF2F7",

  card: "#FFFFFF",
  cardPressed: "#E8EEF5",

  text: "#101318",
  textSecondary: "#5D6673",
  textMuted: "#88919E",

  border: "#DCE3EA",
  divider: "#E5EAF0",

  primary: "#208AEF",
  primaryPressed: "#1876CE",
  primarySoft: "#E6F4FE",
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
  divider: "#1B222C",

  primary: "#208AEF",
  primaryPressed: "#4DA4F4",
  primarySoft: "#102A43",
};

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function CalculatorHomePage() {
  const [search, setSearch] = useState("");
  const [preference, setPreference] =
    useState<ThemePreference>("system");
  const [systemTheme, setSystemTheme] =
    useState<ResolvedTheme>("dark");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSystemTheme(getSystemTheme());

    const stored = window.localStorage.getItem(
      "bodolvo-calculator-theme"
    );

    if (
      stored === "system" ||
      stored === "light" ||
      stored === "dark"
    ) {
      setPreference(stored);
    }

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleSystemThemeChange = () => {
      setSystemTheme(mediaQuery.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener(
      "change",
      handleSystemThemeChange
    );

    setLoaded(true);

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleSystemThemeChange
      );
    };
  }, []);

  const resolvedTheme: ResolvedTheme =
    preference === "system" ? systemTheme : preference;

  const theme =
    resolvedTheme === "dark" ? darkTheme : lightTheme;

  const filteredCalculators = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return calculators;
    }

    return calculators.filter((calculator) => {
      return (
        calculator.name.toLowerCase().includes(query) ||
        calculator.description.toLowerCase().includes(query) ||
        calculator.category.toLowerCase().includes(query)
      );
    });
  }, [search]);

  function changeTheme(value: ThemePreference) {
    setPreference(value);

    window.localStorage.setItem(
      "bodolvo-calculator-theme",
      value
    );
  }

  if (!loaded) {
    return (
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "#07090D",
        }}
      />
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: theme.background,
        color: theme.text,
        transition:
          "background-color 180ms ease, color 180ms ease",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "30px 32px 60px",
        }}
      >
        {/* HEADER */}

        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 42,
          }}
        >
          <div>
            <div
              style={{
                color: theme.primary,
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: 4,
              }}
            >
              BODOLVO
            </div>

            <div
              style={{
                color: theme.text,
                fontSize: 20,
                fontWeight: 700,
                marginTop: 5,
              }}
            >
              Calculator
            </div>
          </div>

          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: theme.primarySoft,
              border: `1px solid ${theme.border}`,
              color: theme.primary,
              fontSize: 25,
              fontWeight: 900,
            }}
          >
            B
          </div>
        </header>

        {/* HERO */}

        <h1
          style={{
            color: theme.text,
            fontSize: "clamp(36px, 7vw, 46px)",
            lineHeight: 1.12,
            fontWeight: 800,
            letterSpacing: -1.5,
            margin: 0,
          }}
        >
          One calculator.
          <br />

          <span
            style={{
              color: theme.primary,
            }}
          >
            Every calculation.
          </span>
        </h1>

        <p
          style={{
            color: theme.textSecondary,
            fontSize: 15,
            lineHeight: "23px",
            marginTop: 14,
            marginBottom: 0,
            maxWidth: 620,
          }}
        >
          Everything you need for everyday math, money, conversions
          and more.
        </p>

        {/* THEME */}

        <section
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: 20,
            marginTop: 28,
            padding: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 3px",
              marginBottom: 12,
            }}
          >
            <div>
              <div
                style={{
                  color: theme.textMuted,
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: 1.8,
                }}
              >
                APPEARANCE
              </div>

              <div
                style={{
                  color: theme.textSecondary,
                  fontSize: 11,
                  fontWeight: 600,
                  marginTop: 4,
                }}
              >
                Current:{" "}
                {resolvedTheme === "dark" ? "Dark" : "Light"}
              </div>
            </div>

            <div
              style={{
                color: theme.primary,
                fontSize: 20,
              }}
            >
              {resolvedTheme === "dark" ? "☾" : "☀"}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 4,
              backgroundColor: theme.surfaceSecondary,
              borderRadius: 15,
              padding: 4,
            }}
          >
            <ThemeButton
              label="System"
              icon="◉"
              active={preference === "system"}
              onClick={() => changeTheme("system")}
              theme={theme}
            />

            <ThemeButton
              label="Light"
              icon="☀"
              active={preference === "light"}
              onClick={() => changeTheme("light")}
              theme={theme}
            />

            <ThemeButton
              label="Dark"
              icon="☾"
              active={preference === "dark"}
              onClick={() => changeTheme("dark")}
              theme={theme}
            />
          </div>
        </section>

        {/* SEARCH */}

        <div
          style={{
            minHeight: 58,
            borderRadius: 20,
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            padding: "0 17px",
            marginTop: 18,
          }}
        >
          <span
            style={{
              color: theme.textMuted,
              fontSize: 24,
              marginRight: 11,
              lineHeight: 1,
            }}
          >
            ⌕
          </span>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search calculators"
            autoComplete="off"
            spellCheck={false}
            style={{
              flex: 1,
              minWidth: 0,
              border: "none",
              outline: "none",
              background: "transparent",
              color: theme.text,
              fontSize: 16,
              padding: "15px 0",
            }}
          />

          {search.length > 0 && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              style={{
                width: 34,
                height: 34,
                border: "none",
                background: "transparent",
                color: theme.textSecondary,
                fontSize: 25,
                lineHeight: "28px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* SEARCH RESULTS */}

        {search.trim().length > 0 ? (
          <section
            style={{
              marginTop: 38,
            }}
          >
            <SectionHeader
              title="Results"
              count={filteredCalculators.length}
              theme={theme}
            />

            {filteredCalculators.length === 0 ? (
              <div
                style={{
                  backgroundColor: theme.card,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 24,
                  padding: "48px 25px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: theme.textMuted,
                    fontSize: 35,
                    marginBottom: 12,
                  }}
                >
                  ⌕
                </div>

                <div
                  style={{
                    color: theme.text,
                    fontSize: 17,
                    fontWeight: 800,
                  }}
                >
                  Nothing found
                </div>

                <div
                  style={{
                    color: theme.textSecondary,
                    fontSize: 13,
                    marginTop: 7,
                  }}
                >
                  Try searching for another calculator.
                </div>
              </div>
            ) : (
              <CalculatorGrid
                calculators={filteredCalculators}
                theme={theme}
              />
            )}
          </section>
        ) : (
          <>
            {/* QUICK ACCESS */}

            <section
              style={{
                marginTop: 35,
              }}
            >
              <div
                style={{
                  color: theme.textMuted,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 2,
                  marginBottom: 14,
                }}
              >
                QUICK ACCESS
              </div>

              <div
                className="bodolvo-quick-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 10,
                }}
              >
                <QuickButton
                  icon="＋"
                  label="Standard"
                  href="/apps/calculator/standard"
                  theme={theme}
                />

                <QuickButton
                  icon="%"
                  label="Percentage"
                  href="/apps/calculator/percentage"
                  theme={theme}
                />

                <QuickButton
                  icon="⇄"
                  label="Convert"
                  href="/apps/calculator/converter"
                  theme={theme}
                />
              </div>
            </section>

            {/* CATEGORIES */}

            {categories.map((category) => {
              const categoryCalculators = calculators.filter(
                (calculator) => calculator.category === category
              );

              return (
                <section
                  key={category}
                  style={{
                    marginTop: 38,
                  }}
                >
                  <SectionHeader
                    title={category}
                    count={categoryCalculators.length}
                    theme={theme}
                  />

                  <CalculatorGrid
                    calculators={categoryCalculators}
                    theme={theme}
                  />
                </section>
              );
            })}
          </>
        )}

        {/* FOOTER */}

        <footer
          style={{
            marginTop: 55,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              height: 1,
              backgroundColor: theme.divider,
              marginBottom: 26,
            }}
          />

          <div
            style={{
              width: 42,
              height: 42,
              margin: "0 auto 10px",
              borderRadius: 13,
              background: theme.primarySoft,
              border: `1px solid ${theme.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.primary,
              fontWeight: 900,
              fontSize: 20,
            }}
          >
            B
          </div>

          <div
            style={{
              color: theme.textMuted,
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: 3,
            }}
          >
            BODOLVO
          </div>

          <div
            style={{
              color: theme.textMuted,
              fontSize: 11,
              marginTop: 7,
            }}
          >
            Built to make everyday tools better.
          </div>
        </footer>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        .bodolvo-calculator-card {
          transition:
            transform 120ms ease,
            border-color 120ms ease,
            background-color 120ms ease;
        }

        .bodolvo-calculator-card:hover {
          transform: translateY(-2px);
        }

        .bodolvo-calculator-card:active {
          transform: scale(0.985);
        }

        .bodolvo-quick-button {
          transition:
            transform 120ms ease,
            background-color 120ms ease;
        }

        .bodolvo-quick-button:hover {
          transform: translateY(-1px);
        }

        .bodolvo-quick-button:active {
          transform: scale(0.98);
        }

        @media (max-width: 1100px) {
          .bodolvo-calculator-grid {
            grid-template-columns: repeat(
              3,
              minmax(0, 1fr)
            ) !important;
          }
        }

        @media (max-width: 800px) {
          .bodolvo-calculator-grid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            ) !important;
          }
        }

        @media (max-width: 560px) {
          .bodolvo-page-container {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }

          .bodolvo-calculator-grid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            ) !important;
          }

          .bodolvo-quick-grid {
            grid-template-columns: repeat(
              3,
              minmax(0, 1fr)
            ) !important;
          }
        }
      `}</style>
    </main>
  );
}

function ThemeButton({
  label,
  icon,
  active,
  onClick,
  theme,
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
  theme: typeof lightTheme;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minHeight: 44,
        borderRadius: 12,
        border: "none",
        backgroundColor: active ? theme.primary : "transparent",
        color: active ? "#FFFFFF" : theme.textSecondary,
        fontSize: 12,
        fontWeight: 800,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
      }}
    >
      <span
        style={{
          fontSize: 15,
          fontWeight: 800,
        }}
      >
        {icon}
      </span>

      <span>{label}</span>
    </button>
  );
}

function SectionHeader({
  title,
  count,
  theme,
}: {
  title: string;
  count: number;
  theme: typeof lightTheme;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 14,
      }}
    >
      <h2
        style={{
          color: theme.text,
          fontSize: 19,
          fontWeight: 800,
          margin: 0,
        }}
      >
        {title}
      </h2>

      <span
        style={{
          color: theme.textSecondary,
          fontSize: 12,
          fontWeight: 700,
          marginLeft: 9,
          backgroundColor: theme.surfaceSecondary,
          padding: "4px 9px",
          borderRadius: 999,
        }}
      >
        {count}
      </span>
    </div>
  );
}

function CalculatorGrid({
  calculators,
  theme,
}: {
  calculators: Calculator[];
  theme: typeof lightTheme;
}) {
  return (
    <div
      className="bodolvo-calculator-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 14,
      }}
    >
      {calculators.map((calculator) => (
        <CalculatorCard
          key={calculator.id}
          calculator={calculator}
          theme={theme}
        />
      ))}
    </div>
  );
}

function CalculatorCard({
  calculator,
  theme,
}: {
  calculator: Calculator;
  theme: typeof lightTheme;
}) {
  return (
    <Link
      href={`/apps/calculator/${calculator.id}`}
      className="bodolvo-calculator-card"
      style={{
        minHeight: 177,
        backgroundColor: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 22,
        padding: 17,
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 14,
          backgroundColor: theme.primarySoft,
          border: `1px solid ${theme.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 15,
          color: theme.primary,
          fontSize: 19,
          fontWeight: 800,
        }}
      >
        {calculator.icon}
      </div>

      <div
        style={{
          color: theme.text,
          fontSize: 15,
          fontWeight: 800,
          marginBottom: 6,
        }}
      >
        {calculator.name}
      </div>

      <div
        style={{
          color: theme.textSecondary,
          fontSize: 12,
          lineHeight: "17px",
          flex: 1,
        }}
      >
        {calculator.description}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: 14,
        }}
      >
        <span
          style={{
            color: theme.textMuted,
            fontSize: 8,
            fontWeight: 800,
            letterSpacing: 1.1,
          }}
        >
          {calculator.category.toUpperCase()}
        </span>

        <span
          style={{
            color: theme.primary,
            fontSize: 22,
            lineHeight: "22px",
          }}
        >
          ›
        </span>
      </div>
    </Link>
  );
}

function QuickButton({
  icon,
  label,
  href,
  theme,
}: {
  icon: string;
  label: string;
  href: string;
  theme: typeof lightTheme;
}) {
  return (
    <Link
      href={href}
      className="bodolvo-quick-button"
      style={{
        minHeight: 68,
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: 19,
        padding: "8px",
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          color: theme.primary,
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 4,
        }}
      >
        {icon}
      </span>

      <span
        style={{
          color: theme.textSecondary,
          fontSize: 11,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </Link>
  );
}