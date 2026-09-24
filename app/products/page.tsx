import Link from "next/link";

const products = [
  {
    letter: "L",
    name: "Bodolvo Live",
    type: "Social",
    statement: "Be present together.",
    description:
      "A live social environment designed around creators, communities, conversation, and real human connection.",
    status: "In development",
    href: "/live",
    accent: "violet",
    features: [
      "Live broadcasting",
      "Creator spaces",
      "Community interaction",
      "Personal expression",
    ],
  },
  {
    letter: "N",
    name: "Bodolvo Notes",
    type: "Create",
    statement: "Keep what matters.",
    description:
      "A focused workspace for ideas, writing, planning, organization, and the things you want to come back to.",
    status: "Available",
    href: "/products",
    accent: "blue",
    features: [
      "Writing workspace",
      "Organized notes",
      "Focused sessions",
      "Bodolvo assistance",
    ],
  },
  {
    letter: "W",
    name: "Bodolvo Whiteboard",
    type: "Collaborate",
    statement: "Think together.",
    description:
      "A shared visual space for drawing, explaining, teaching, planning, and building ideas with other people.",
    status: "In development",
    href: "/products",
    accent: "violet",
    features: [
      "Shared drawing",
      "Host controls",
      "Live sessions",
      "Visual collaboration",
    ],
  },
  {
    letter: "R",
    name: "Bodolvo Recall",
    type: "Remember",
    statement: "Return to the moment.",
    description:
      "A thoughtful capture and recall environment designed to help you preserve important information and revisit it later.",
    status: "In development",
    href: "/products",
    accent: "blue",
    features: [
      "Capture",
      "Transcription",
      "Recall",
      "Organized history",
    ],
  },
  {
    letter: "S",
    name: "Bodolvo System Center",
    type: "Understand",
    statement: "Know your environment.",
    description:
      "A clearer way to understand your computer, monitor important information, and eventually manage connected systems.",
    status: "In development",
    href: "/products",
    accent: "violet",
    features: [
      "System information",
      "Device monitoring",
      "Diagnostics",
      "Connected management",
    ],
  },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#090b0f] text-white">
      {/* HEADER */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#090b0f]/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
              <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-400/10 blur-sm" />
              <span className="relative text-xs font-semibold">B</span>
            </div>

            <span className="text-sm font-semibold tracking-[0.22em]">
              BODOLVO
            </span>
          </Link>

          <nav className="hidden items-center gap-9 text-[13px] text-white/45 md:flex">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>

            <Link href="/products" className="text-white">
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
            href="/"
            className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-2.5 text-xs font-medium text-white/75 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            Return home
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative px-6 pb-28 pt-[180px]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[15%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-violet-500/[0.055] blur-[180px]" />

          <div className="absolute right-[-10%] top-[30%] h-[450px] w-[450px] rounded-full bg-blue-500/[0.035] blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-white/35">
              The Bodolvo ecosystem
            </div>

            <h1 className="text-5xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[86px]">
              One world.
              <span className="block bg-gradient-to-r from-white/45 via-white/30 to-violet-200/35 bg-clip-text text-transparent">
                Many spaces.
              </span>
            </h1>

            <p className="mt-9 max-w-2xl text-lg leading-8 text-white/42">
              Bodolvo products are built for different parts of your digital
              life without making every experience feel disconnected from the
              last.
            </p>
          </div>

          <div className="mt-20 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/[0.06] pt-7 text-[10px] uppercase tracking-[0.18em] text-white/20">
            <span>Create</span>
            <span className="h-1 w-1 rounded-full bg-white/15" />
            <span>Connect</span>
            <span className="h-1 w-1 rounded-full bg-white/15" />
            <span>Collaborate</span>
            <span className="h-1 w-1 rounded-full bg-white/15" />
            <span>Remember</span>
            <span className="h-1 w-1 rounded-full bg-white/15" />
            <span>Understand</span>
          </div>
        </div>
      </section>

      {/* FEATURED LIVE */}
      <section className="px-6 pb-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[38px] border border-white/[0.08] bg-[#0d1016]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute right-[5%] top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-violet-500/[0.08] blur-[130px]" />

              <div className="absolute bottom-[-50%] left-[20%] h-[400px] w-[500px] rounded-full bg-blue-500/[0.035] blur-[120px]" />
            </div>

            <div className="relative grid min-h-[620px] lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex flex-col justify-between p-8 sm:p-12 lg:p-16">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-300 opacity-20" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-300/70" />
                    </span>

                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/28">
                      Featured space
                    </span>
                  </div>

                  <p className="mt-12 text-[11px] uppercase tracking-[0.22em] text-white/22">
                    Social / Live
                  </p>

                  <h2 className="mt-5 text-4xl font-medium tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                    Bodolvo Live
                  </h2>

                  <p className="mt-5 text-xl text-white/45">
                    Be present together.
                  </p>

                  <p className="mt-8 max-w-xl text-[15px] leading-8 text-white/36">
                    A live social world where creators can broadcast,
                    communities can gather, and people can interact without
                    making the experience feel cold or transactional.
                  </p>
                </div>

                <div className="mt-12">
                  <Link
                    href="/live"
                    className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-white/90"
                  >
                    Enter Bodolvo Live
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* LIVE PREVIEW */}
              <div className="relative flex items-center justify-center border-t border-white/[0.06] p-8 lg:border-l lg:border-t-0 lg:p-12">
                <div className="absolute h-[420px] w-[420px] rounded-full bg-violet-500/[0.07] blur-[100px]" />

                <div className="relative w-full max-w-[560px] rounded-[32px] border border-white/[0.09] bg-[#0a0c10]/85 p-3 shadow-[0_40px_100px_rgba(0,0,0,0.45)] backdrop-blur">
                  <div className="overflow-hidden rounded-[25px] border border-white/[0.07] bg-[#11141a]">
                    <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full border border-white/[0.1] bg-white/[0.05]" />

                        <div>
                          <div className="h-2 w-20 rounded-full bg-white/[0.14]" />
                          <div className="mt-2 h-1.5 w-12 rounded-full bg-white/[0.06]" />
                        </div>
                      </div>

                      <div className="rounded-full border border-violet-200/[0.1] bg-violet-300/[0.06] px-3 py-1.5 text-[8px] uppercase tracking-[0.16em] text-violet-100/45">
                        Live
                      </div>
                    </div>

                    <div className="relative aspect-[4/3] bg-gradient-to-br from-[#171b24] via-[#10131a] to-[#16121f]">
                      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400/[0.07] blur-[60px]" />

                      <div className="absolute left-5 top-5 rounded-full border border-white/[0.08] bg-black/20 px-3 py-1.5 text-[8px] uppercase tracking-[0.18em] text-white/28 backdrop-blur">
                        Creator space
                      </div>

                      <div className="absolute bottom-5 left-5 right-5">
                        <div className="h-2 w-[55%] rounded-full bg-white/[0.13]" />
                        <div className="mt-3 h-1.5 w-[38%] rounded-full bg-white/[0.06]" />
                      </div>

                      <div className="absolute bottom-5 right-5 flex flex-col gap-3">
                        <div className="h-10 w-10 rounded-full border border-white/[0.08] bg-white/[0.04]" />
                        <div className="h-10 w-10 rounded-full border border-white/[0.08] bg-white/[0.04]" />
                        <div className="h-10 w-10 rounded-full border border-white/[0.08] bg-white/[0.04]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-px bg-white/[0.05]">
                      {["Community", "Gifts", "Discover"].map((item) => (
                        <div
                          key={item}
                          className="bg-[#101319] px-4 py-5 text-center text-[9px] uppercase tracking-[0.14em] text-white/20"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT LIST */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/25">
                Explore the world
              </p>

              <h2 className="mt-5 text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
                Find your space.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-white/32">
              Every product is designed to stand on its own while still feeling
              unmistakably part of Bodolvo.
            </p>
          </div>

          <div className="space-y-4">
            {products.map((product, index) => (
              <ProductRow
                key={product.name}
                product={product}
                number={String(index + 1).padStart(2, "0")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CONNECTION */}
      <section className="border-y border-white/[0.055] bg-[#0b0e13] px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/25">
                Designed together
              </p>

              <h2 className="mt-6 max-w-xl text-4xl font-medium leading-[1.06] tracking-[-0.045em] sm:text-5xl">
                Familiar,
                <span className="block text-white/35">
                  wherever you enter.
                </span>
              </h2>

              <p className="mt-8 max-w-xl text-[15px] leading-8 text-white/38">
                Bodolvo should never make you relearn the world every time you
                open another product. Navigation, language, interaction, and
                identity are designed to feel connected from one space to the
                next.
              </p>
            </div>

            <div className="relative min-h-[400px]">
              <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.06] blur-[90px]" />

              <div className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-violet-200/[0.12] bg-white/[0.025] backdrop-blur">
                <div className="text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs">
                    B
                  </div>

                  <p className="mt-3 text-[9px] font-semibold tracking-[0.2em]">
                    BODOLVO
                  </p>
                </div>
              </div>

              <FloatingNode
                className="left-[4%] top-[8%]"
                letter="N"
                title="Notes"
              />

              <FloatingNode
                className="right-[4%] top-[8%]"
                letter="L"
                title="Live"
              />

              <FloatingNode
                className="bottom-[7%] left-[9%]"
                letter="W"
                title="Whiteboard"
              />

              <FloatingNode
                className="bottom-[7%] right-[9%]"
                letter="S"
                title="System"
              />

              <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-[9px] uppercase tracking-[0.16em] text-white/20">
                Recall
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FUTURE */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[38px] border border-white/[0.07] bg-[#0d1015] px-8 py-20 sm:px-14 lg:px-20">
            <div className="absolute right-[-12%] top-[-70%] h-[600px] w-[600px] rounded-full bg-violet-500/[0.055] blur-[140px]" />

            <div className="relative max-w-3xl">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/25">
                And beyond
              </p>

              <h2 className="mt-6 text-4xl font-medium leading-[1.08] tracking-[-0.045em] sm:text-5xl md:text-[56px]">
                Bodolvo is not finished.
                <span className="block text-white/35">
                  It&apos;s being built to grow.
                </span>
              </h2>

              <p className="mt-8 max-w-2xl text-[15px] leading-8 text-white/38">
                New products, services, and spaces can join the ecosystem
                without changing the reason Bodolvo exists: to make technology
                feel useful, familiar, and dependable.
              </p>

              <Link
                href="/about"
                className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/[0.1] bg-white/[0.035] px-6 py-3.5 text-sm text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                Learn about Bodolvo
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
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>

              <Link href="/products" className="text-white/60">
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

type Product = {
  letter: string;
  name: string;
  type: string;
  statement: string;
  description: string;
  status: string;
  href: string;
  accent: string;
  features: string[];
};

function ProductRow({
  product,
  number,
}: {
  product: Product;
  number: string;
}) {
  return (
    <article className="group relative overflow-hidden rounded-[30px] border border-white/[0.065] bg-white/[0.018] transition duration-500 hover:border-white/[0.13] hover:bg-white/[0.03]">
      <div
        className={`pointer-events-none absolute right-[-100px] top-1/2 h-[260px] w-[260px] -translate-y-1/2 rounded-full blur-[100px] transition duration-500 ${
          product.accent === "blue"
            ? "bg-blue-500/0 group-hover:bg-blue-500/[0.04]"
            : "bg-violet-500/0 group-hover:bg-violet-500/[0.05]"
        }`}
      />

      <div className="relative grid gap-10 p-7 md:grid-cols-[80px_1fr] md:p-9 lg:grid-cols-[80px_0.85fr_1.15fr_0.8fr] lg:items-center">
        <div className="flex items-center gap-4 lg:block">
          <span className="text-[9px] tracking-[0.18em] text-white/16">
            {number}
          </span>

          <div className="mt-0 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-xs text-white/50 lg:mt-5">
            {product.letter}
          </div>
        </div>

        <div>
          <p className="text-[9px] uppercase tracking-[0.19em] text-white/20">
            {product.type}
          </p>

          <h3 className="mt-3 text-2xl font-medium tracking-[-0.03em]">
            {product.name}
          </h3>

          <p className="mt-2 text-sm text-white/35">{product.statement}</p>
        </div>

        <p className="max-w-xl text-sm leading-7 text-white/32">
          {product.description}
        </p>

        <div className="flex flex-col gap-5 lg:items-end">
          <span className="w-fit rounded-full border border-white/[0.065] px-3 py-1.5 text-[8px] uppercase tracking-[0.14em] text-white/22">
            {product.status}
          </span>

          <Link
            href={product.href}
            className="flex items-center gap-2 text-xs text-white/30 transition group-hover:text-white/65"
          >
            Explore space
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>

      <div className="relative border-t border-white/[0.05] px-7 py-5 md:px-9">
        <div className="flex flex-wrap gap-x-7 gap-y-3">
          {product.features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-white/16"
            >
              <span className="h-1 w-1 rounded-full bg-white/15" />
              {feature}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function FloatingNode({
  className,
  letter,
  title,
}: {
  className: string;
  letter: string;
  title: string;
}) {
  return (
    <div
      className={`absolute flex min-w-[130px] items-center gap-3 rounded-2xl border border-white/[0.065] bg-white/[0.02] p-4 backdrop-blur ${className}`}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-[9px] text-white/40">
        {letter}
      </div>

      <span className="text-[10px] text-white/32">{title}</span>
    </div>
  );
}