import Link from "next/link";

const products = [
  {
    letter: "L",
    title: "Bodolvo Live",
    short: "LIVE",
    description:
      "A social live environment built for creators, communities, and real connection.",
    status: "In development",
    href: "/live",
  },
  {
    letter: "N",
    title: "Bodolvo Notes",
    short: "NOTES",
    description:
      "A focused place for ideas, writing, planning, and everything worth keeping.",
    status: "Available",
    href: "/products",
  },
  {
    letter: "W",
    title: "Bodolvo Whiteboard",
    short: "WHITEBOARD",
    description:
      "A shared space for drawing, thinking, teaching, explaining, and collaborating.",
    status: "In development",
    href: "/products",
  },
  {
    letter: "R",
    title: "Bodolvo Recall",
    short: "RECALL",
    description:
      "A thoughtful system designed to help capture and revisit what matters.",
    status: "In development",
    href: "/products",
  },
  {
    letter: "S",
    title: "Bodolvo System Center",
    short: "SYSTEM CENTER",
    description:
      "A clearer way to understand and manage your computer environment.",
    status: "In development",
    href: "/products",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#090b0f] text-white">
      {/* HEADER */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#090b0f]/75 backdrop-blur-2xl">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-6">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
              <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-400/10 blur-sm" />

              <span className="relative text-xs font-semibold">B</span>
            </div>

            <span className="text-sm font-semibold tracking-[0.22em]">
              BODOLVO
            </span>
          </Link>

          <nav className="hidden items-center gap-9 text-[13px] text-white/45 md:flex">
            <Link href="/" className="text-white">
              Home
            </Link>

            <Link href="/products" className="transition hover:text-white">
              Products
            </Link>

            <Link href="/about" className="transition hover:text-white">
              About
            </Link>

            <Link href="/support" className="transition hover:text-white">
              Support
            </Link>
          </nav>

          <Link
            href="/products"
            className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-2.5 text-xs font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            Enter Bodolvo
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center px-6 pt-[74px]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[32%] top-[42%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.085] blur-[160px]" />

          <div className="absolute right-[10%] top-[34%] h-[420px] w-[420px] rounded-full bg-blue-500/[0.06] blur-[160px]" />

          <div className="absolute bottom-[-10%] left-[48%] h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-500/[0.035] blur-[140px]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl gap-20 py-24 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          {/* LEFT */}
          <div>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-[11px] text-white/50 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-30" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              The Bodolvo ecosystem
            </div>

            <h1 className="max-w-4xl text-[54px] font-medium leading-[0.98] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[86px]">
              A digital world
              <span className="block bg-gradient-to-r from-white/50 via-white/35 to-violet-200/40 bg-clip-text text-transparent">
                built around you.
              </span>
            </h1>

            <p className="mt-8 max-w-[590px] text-[17px] leading-8 text-white/48 md:text-lg">
              Create, connect, work, share, and stay organized through one
              growing ecosystem designed to feel familiar wherever you go.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-white/90"
              >
                Explore Bodolvo
              </Link>

              <a
                href="#world"
                className="rounded-full border border-white/[0.12] bg-white/[0.02] px-7 py-3.5 text-sm font-medium text-white/70 transition hover:border-white/25 hover:bg-white/[0.05] hover:text-white"
              >
                Discover the world
              </a>
            </div>

            <div className="mt-16 flex items-center gap-6 text-[11px] uppercase tracking-[0.15em] text-white/20">
              <span>Connected</span>

              <div className="h-px w-10 bg-white/10" />

              <span>Familiar</span>

              <div className="h-px w-10 bg-white/10" />

              <span>Dependable</span>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute -inset-12 rounded-full bg-violet-500/[0.06] blur-[90px]" />

            <div className="absolute -left-4 top-[20%] h-2 w-2 rounded-full bg-violet-300/50 shadow-[0_0_24px_rgba(196,181,253,0.7)]" />

            <div className="absolute -right-3 top-[48%] h-1.5 w-1.5 rounded-full bg-blue-300/50 shadow-[0_0_20px_rgba(147,197,253,0.6)]" />

            <div className="absolute bottom-[12%] left-[8%] h-1.5 w-1.5 rounded-full bg-white/30" />

            <div className="relative rounded-[34px] border border-white/[0.1] bg-white/[0.025] p-3 shadow-[0_40px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="rounded-[27px] border border-white/[0.07] bg-[#101318]/90 p-5">
                <div className="mb-10 flex items-start justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.19em] text-white/25">
                      Your space
                    </p>

                    <p className="mt-2.5 text-[16px] font-medium text-white/90">
                      Welcome to Bodolvo
                    </p>
                  </div>

                  <div className="mt-1 flex gap-2">
                    <span className="h-2 w-2 rounded-full bg-white/10" />
                    <span className="h-2 w-2 rounded-full bg-white/10" />
                    <span className="h-2 w-2 rounded-full bg-violet-300/25" />
                  </div>
                </div>

                <div className="relative grid gap-3 sm:grid-cols-2">
                  <div className="pointer-events-none absolute left-1/2 top-[22%] hidden h-[55%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-violet-300/[0.08] to-transparent sm:block" />

                  {[
                    ["L", "BODOLVO LIVE", "Create your space"],
                    ["N", "BODOLVO NOTES", "Keep what matters"],
                    ["W", "BODOLVO WHITEBOARD", "Think together"],
                    ["R", "BODOLVO RECALL", "Remember more"],
                  ].map(([letter, title, subtitle]) => (
                    <div
                      key={title}
                      className="group relative min-h-[150px] rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-200/[0.15] hover:bg-white/[0.045]"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.04] text-[11px] font-semibold text-white/55 transition group-hover:border-violet-200/20 group-hover:text-white/80">
                        {letter}
                      </div>

                      <div className="absolute bottom-5 left-5">
                        <p className="text-[9px] font-semibold tracking-[0.17em] text-white/25">
                          {title}
                        </p>

                        <p className="mt-2 text-sm text-white/72">{subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="group mt-3 flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition duration-300 hover:border-blue-200/[0.14] hover:bg-white/[0.045]">
                  <div>
                    <p className="text-[9px] font-semibold tracking-[0.17em] text-white/25">
                      BODOLVO SYSTEM CENTER
                    </p>

                    <p className="mt-2 text-sm text-white/72">
                      Your environment, understood.
                    </p>
                  </div>

                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025]">
                    <div className="h-2 w-2 rounded-full bg-blue-300/40 shadow-[0_0_18px_rgba(147,197,253,0.35)]" />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between px-1 text-[9px] uppercase tracking-[0.16em] text-white/15">
                  <span>One environment</span>
                  <span>Always growing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORLD */}
      <section
        id="world"
        className="relative border-y border-white/[0.055] bg-[#0b0e13] px-6 py-32"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[52%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.045] blur-[150px]" />

          <div className="absolute left-1/2 top-[52%] h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.025]" />

          <div className="absolute left-1/2 top-[52%] h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-200/[0.025]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/28">
              One world
            </p>

            <h2 className="mt-6 text-4xl font-medium tracking-[-0.045em] sm:text-5xl md:text-6xl">
              Your tools shouldn&apos;t
              <span className="block text-white/35">
                feel like strangers.
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/42">
              Every Bodolvo space serves a different purpose while still
              feeling like part of somewhere familiar.
            </p>
          </div>

          <div className="relative mx-auto mt-24 min-h-[680px] max-w-6xl">
            <svg
              className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
              viewBox="0 0 1200 680"
              fill="none"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="bodolvoLine" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.03)" />
                  <stop
                    offset="50%"
                    stopColor="rgba(196,181,253,0.16)"
                  />
                  <stop
                    offset="100%"
                    stopColor="rgba(255,255,255,0.03)"
                  />
                </linearGradient>
              </defs>

              <path
                d="M600 340 C470 280 420 210 290 180"
                stroke="url(#bodolvoLine)"
                strokeWidth="1"
              />

              <path
                d="M600 340 C730 280 790 210 920 180"
                stroke="url(#bodolvoLine)"
                strokeWidth="1"
              />

              <path
                d="M600 340 C450 390 390 470 250 500"
                stroke="url(#bodolvoLine)"
                strokeWidth="1"
              />

              <path
                d="M600 340 C600 430 600 470 600 535"
                stroke="url(#bodolvoLine)"
                strokeWidth="1"
              />

              <path
                d="M600 340 C750 390 810 470 950 500"
                stroke="url(#bodolvoLine)"
                strokeWidth="1"
              />
            </svg>

            <div className="absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 md:flex">
              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.09] blur-[75px]" />

              <div className="relative flex h-52 w-52 items-center justify-center rounded-full border border-violet-200/[0.14] bg-[#10131a]/85 shadow-[0_0_90px_rgba(139,92,246,0.09)] backdrop-blur-xl">
                <div className="absolute inset-3 rounded-full border border-white/[0.05]" />
                <div className="absolute inset-7 rounded-full border border-violet-200/[0.04]" />

                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-sm font-medium">
                    B
                  </div>

                  <p className="mt-4 text-[10px] font-semibold tracking-[0.23em]">
                    BODOLVO
                  </p>

                  <p className="mt-2 text-[9px] uppercase tracking-[0.18em] text-white/20">
                    Your world
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8 flex justify-center md:hidden">
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-violet-200/[0.12] bg-white/[0.025]">
                <div className="absolute h-52 w-52 rounded-full bg-violet-500/[0.06] blur-[55px]" />

                <div className="relative text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs">
                    B
                  </div>

                  <p className="mt-3 text-[9px] font-semibold tracking-[0.2em]">
                    BODOLVO
                  </p>
                </div>
              </div>
            </div>

            <WorldNode
              className="md:absolute md:left-[5%] md:top-[7%]"
              letter="N"
              purpose="CREATE"
              title="Bodolvo Notes"
              text="Capture ideas, plans, and the things worth keeping."
            />

            <WorldNode
              className="md:absolute md:right-[5%] md:top-[7%]"
              letter="L"
              purpose="CONNECT"
              title="Bodolvo Live"
              text="Share moments, build community, and be present together."
            />

            <WorldNode
              className="md:absolute md:bottom-[4%] md:left-[2%]"
              letter="W"
              purpose="THINK"
              title="Bodolvo Whiteboard"
              text="Draw, explain, collaborate, and build thoughts together."
            />

            <WorldNode
              className="md:absolute md:bottom-[-2%] md:left-1/2 md:-translate-x-1/2"
              letter="R"
              purpose="REMEMBER"
              title="Bodolvo Recall"
              text="Capture what matters and return to it when you need it."
            />

            <WorldNode
              className="md:absolute md:bottom-[4%] md:right-[2%]"
              letter="S"
              purpose="MANAGE"
              title="Bodolvo System Center"
              text="Understand your device and keep your environment in view."
            />
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/28">
                The ecosystem
              </p>

              <h2 className="mt-5 text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
                Different spaces.
                <span className="block text-white/35">One Bodolvo.</span>
              </h2>
            </div>

            <Link
              href="/products"
              className="inline-flex w-fit items-center gap-3 rounded-full border border-white/[0.1] bg-white/[0.03] px-6 py-3 text-sm text-white/60 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            >
              View all products
              <span>→</span>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.title}
                className="group relative min-h-[330px] overflow-hidden rounded-[28px] border border-white/[0.07] bg-white/[0.02] p-7 transition duration-500 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.04]"
              >
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/0 blur-[60px] transition duration-500 group-hover:bg-violet-500/[0.06]" />

                <div className="relative flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035] text-xs text-white/55">
                      {product.letter}
                    </div>

                    <span className="rounded-full border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] text-white/25">
                      {product.status}
                    </span>
                  </div>

                  <div className="mt-auto pt-20">
                    <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.17em] text-white/20">
                      {product.short}
                    </p>

                    <h3 className="text-xl font-medium">{product.title}</h3>

                    <p className="mt-3 max-w-sm text-sm leading-7 text-white/38">
                      {product.description}
                    </p>

                    <Link
                      href={product.href}
                      className="mt-7 flex items-center gap-2 text-xs text-white/28 transition group-hover:text-white/65"
                    >
                      Explore space
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}

            <article className="relative min-h-[330px] overflow-hidden rounded-[28px] border border-dashed border-white/[0.08] p-7">
              <div className="absolute bottom-[-80px] right-[-70px] h-52 w-52 rounded-full bg-blue-500/[0.04] blur-[70px]" />

              <div className="relative flex h-full flex-col justify-between">
                <span className="text-[9px] uppercase tracking-[0.2em] text-white/20">
                  Beyond
                </span>

                <div>
                  <h3 className="text-xl font-medium text-white/50">
                    The world keeps growing.
                  </h3>

                  <p className="mt-3 max-w-xs text-sm leading-7 text-white/28">
                    New spaces will join Bodolvo as the ecosystem evolves.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[38px] border border-white/[0.07] bg-[#0d1015] px-8 py-20 sm:px-14 lg:px-20 lg:py-24">
            <div className="absolute right-[-10%] top-[-60%] h-[500px] w-[500px] rounded-full bg-violet-500/[0.055] blur-[130px]" />

            <div className="absolute bottom-[-70%] left-[20%] h-[400px] w-[500px] rounded-full bg-blue-500/[0.035] blur-[130px]" />

            <div className="relative max-w-3xl">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/25">
                Built to stay with you
              </p>

              <h2 className="mt-7 text-4xl font-medium leading-[1.08] tracking-[-0.045em] sm:text-5xl md:text-[56px]">
                Technology should feel dependable
                <span className="block text-white/35">
                  before it feels impressive.
                </span>
              </h2>

              <p className="mt-8 max-w-2xl text-[16px] leading-8 text-white/40">
                Bodolvo is designed around that belief. Useful products,
                familiar experiences, thoughtful details, and an ecosystem you
                can grow into instead of eventually growing out of.
              </p>

              <Link
                href="/about"
                className="mt-9 inline-flex items-center gap-3 rounded-full border border-white/[0.1] bg-white/[0.025] px-6 py-3.5 text-sm text-white/65 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
              >
                About Bodolvo
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] bg-[#080a0d] px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-[10px]">
                B
              </div>

              <span className="text-xs font-semibold tracking-[0.2em]">
                BODOLVO
              </span>
            </Link>

            <div className="flex flex-wrap gap-7 text-xs text-white/30">
              <Link href="/" className="text-white/60">
                Home
              </Link>

              <Link href="/products" className="transition hover:text-white">
                Products
              </Link>

              <Link href="/live" className="transition hover:text-white">
                Live
              </Link>

              <Link href="/about" className="transition hover:text-white">
                About
              </Link>

              <Link href="/support" className="transition hover:text-white">
                Support
              </Link>

              <Link href="/privacy" className="transition hover:text-white">
                Privacy
              </Link>

              <Link href="/terms" className="transition hover:text-white">
                Terms
              </Link>
            </div>
          </div>

          <div className="mt-10 border-t border-white/[0.05] pt-7 text-[11px] text-white/18">
            © 2026 Bodolvo. A world built to stay with you.
          </div>
        </div>
      </footer>
    </main>
  );
}

function WorldNode({
  letter,
  purpose,
  title,
  text,
  className = "",
}: {
  letter: string;
  purpose: string;
  title: string;
  text: string;
  className?: string;
}) {
  return (
    <article
      className={`group relative z-10 mb-4 w-full rounded-[24px] border border-white/[0.065] bg-[#0d1015]/90 p-6 backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-violet-200/[0.14] hover:bg-white/[0.035] md:mb-0 md:w-[290px] ${className}`}
    >
      <div className="absolute right-5 top-5 flex items-center gap-2">
        <span className="text-[8px] font-medium tracking-[0.2em] text-white/18">
          {purpose}
        </span>

        <span className="h-1.5 w-1.5 rounded-full bg-white/10 transition group-hover:bg-violet-200/40 group-hover:shadow-[0_0_12px_rgba(196,181,253,0.4)]" />
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-[11px] text-white/50">
        {letter}
      </div>

      <div className="mt-12">
        <h3 className="text-[15px] font-medium text-white/82">{title}</h3>

        <p className="mt-2 max-w-[240px] text-xs leading-6 text-white/28">
          {text}
        </p>
      </div>
    </article>
  );
}