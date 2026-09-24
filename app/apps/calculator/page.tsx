"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
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
export default function CalculatorHomePage() {
  const [search, setSearch] = useState("");
  const results = useMemo(() => calculators.filter((item) =>
    [item.name, item.description, item.category].some((value) =>
      value.toLowerCase().includes(search.trim().toLowerCase()))), [search]);
  return <main className="site-width calculator-directory">
    <div className="tool-breadcrumb"><Link href="/apps">Apps</Link> / Calculator</div>
    <h1>Calculator</h1>
    <p className="tool-description">Choose a calculator or search by name.</p>
    <div className="search-row"><label htmlFor="calculator-search">Search calculators</label>
      <input id="calculator-search" type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search calculators" /></div>
    {categories.map(category => {
      const items = results.filter(item => item.category === category);
      if (!items.length) return null;
      return <section className="site-section" key={category}>
        <h2>{category}</h2><div className="directory-grid">
          {items.map(item => <div className="directory-item" key={item.id}>
            <h3>{item.name}</h3><p>{item.description}</p>
            <Link className="simple-button" href={`/apps/calculator/${item.id}`}>Open {item.name}</Link>
          </div>)}
        </div>
      </section>;
    })}
    {results.length === 0 && <p>No calculators match your search.</p>}
  </main>;
}
