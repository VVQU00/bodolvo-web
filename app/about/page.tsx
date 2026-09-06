import Link from "next/link";

export default function AboutPage() {
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

            <Link href="/products" className="transition hover:text-white">
              Products
            </Link>

            <Link href="/live" className="transition hover:text-white">
              Live
            </Link>

            <Link href="/about" className="text-white">
              About
            </Link>

            <Link href="/support" className="transition hover:text-white">
              Support
            </Link>
          </nav>

          <Link
            href="/products"
            className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-2.5 text-xs font-medium text-white/75 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            Explore Bodolvo
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative px-6 pb-28 pt-[190px]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[15%] top-[10%] h-[650px] w-[650px] rounded-full bg-violet-500/[0.06] blur-[180px]" />

          <div className="absolute right-[5%] top-[18%] h-[500px] w-[500px] rounded-full bg-blue-500/[0.035] blur-[160px]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-5xl">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/25">
              About Bodolvo
            </p>

            <h1 className="mt-7 text-5xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[86px]">
              Technology should
              <span className="block bg-gradient-to-r from-white/50 via-white/35 to-violet-200/35 bg-clip-text text-transparent">
                feel like somewhere.
              </span>
            </h1>

            <p className="mt-9 max-w-3xl text-[17px] leading-8 text-white/42 md:text-lg">
              Bodolvo is being built as a connected digital environment where
              useful tools feel familiar, thoughtful, and dependable instead of
              disconnected from one another.
            </p>
          </div>

          <div className="mt-20 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/[0.06] pt-7 text-[10px] uppercase tracking-[0.18em] text-white/18">
            <span>Useful</span>
            <span className="h-1 w-1 rounded-full bg-white/15" />
            <span>Familiar</span>
            <span className="h-1 w-1 rounded-full bg-white/15" />
            <span>Connected</span>
            <span className="h-1 w-1 rounded-full bg-white/15" />
            <span>Dependable</span>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="border-y border-white/[0.055] bg-[#0b0e13] px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/24">
                Why Bodolvo exists
              </p>

              <h2 className="mt-6 max-w-xl text-4xl font-medium leading-[1.06] tracking-[-0.045em] sm:text-5xl">
                Digital tools work better
                <span className="block text-white/35">
                  when they understand each other.
                </span>
              </h2>
            </div>

            <div className="max-w-xl">
              <p className="text-[16px] leading-8 text-white/42">
                Most digital experiences are fragmented. One app looks one way,
                another works completely differently, and every new tool asks
                you to learn a new environment.
              </p>

              <p className="mt-6 text-[16px] leading-8 text-white/36">
                Bodolvo is being built around a different idea: products can
                serve different purposes while still feeling like part of one
                world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/24">
              The principles
            </p>

            <h2 className="mt-6 text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
              What Bodolvo should always feel like.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <PrincipleCard
              number="01"
              title="Dependable"
              text="A product should earn trust by being clear, consistent, and there when you need it."
            />

            <PrincipleCard
              number="02"
              title="Familiar"
              text="Moving between Bodolvo spaces should feel natural instead of forcing you to relearn everything."
            />

            <PrincipleCard
              number="03"
              title="Human"
              text="Technology should support people without making every interaction feel cold or mechanical."
            />

            <PrincipleCard
              number="04"
              title="Thoughtful"
              text="Every feature should have a reason to exist rather than being added simply because it can be."
            />
          </div>
        </div>
      </section>

      {/* WORLD */}
      <section className="border-y border-white/[0.055] bg-[#0b0e13] px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/24">
                The world
              </p>

              <h2 className="mt-6 max-w-xl text-4xl font-medium leading-[1.06] tracking-[-0.045em] sm:text-5xl">
                Different spaces.
                <span className="block text-white/35">
                  One environment.
                </span>
              </h2>

              <p className="mt-8 max-w-xl text-[15px] leading-8 text-white/37">
                Bodolvo Live, Notes, Whiteboard, Recall, System Center, and
                future products are being designed as individual spaces inside
                one larger ecosystem.
              </p>

              <Link
                href="/products"
                className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/[0.1] bg-white/[0.03] px-6 py-3.5 text-sm text-white/65 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                Explore the ecosystem
                <span>→</span>
              </Link>
            </div>

            <div className="relative min-h-[520px]">
              <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.06] blur-[110px]" />

              <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035]" />

              <div className="absolute left-1/2 top-1/2 h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-200/[0.05]" />

              <div className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-violet-200/[0.12] bg-[#0f1218]/90 backdrop-blur">
                <div className="text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs">
                    B
                  </div>

                  <p className="mt-4 text-[10px] font-semibold tracking-[0.2em]">
                    BODOLVO
                  </p>

                  <p className="mt-2 text-[8px] uppercase tracking-[0.15em] text-white/18">
                    One world
                  </p>
                </div>
              </div>

              <WorldItem
                className="left-[2%] top-[8%]"
                letter="L"
                title="Live"
              />

              <WorldItem
                className="right-[2%] top-[8%]"
                letter="N"
                title="Notes"
              />

              <WorldItem
                className="bottom-[8%] left-[3%]"
                letter="W"
                title="Whiteboard"
              />

              <WorldItem
                className="bottom-[8%] right-[3%]"
                letter="S"
                title="System Center"
              />

              <WorldItem
                className="bottom-[1%] left-1/2 -translate-x-1/2"
                letter="R"
                title="Recall"
              />
            </div>
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[38px] border border-white/[0.07] bg-[#0d1015] px-8 py-20 sm:px-14 lg:px-20">
            <div className="absolute right-[-12%] top-[-70%] h-[600px] w-[600px] rounded-full bg-violet-500/[0.055] blur-[140px]" />

            <div className="absolute bottom-[-70%] left-[10%] h-[500px] w-[500px] rounded-full bg-blue-500/[0.03] blur-[140px]" />

            <div className="relative grid gap-16 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/24">
                  The approach
                </p>

                <h2 className="mt-6 max-w-3xl text-4xl font-medium leading-[1.08] tracking-[-0.045em] sm:text-5xl md:text-[56px]">
                  Build something useful.
                  <span className="block text-white/35">
                    Then make it better.
                  </span>
                </h2>

                <p className="mt-8 max-w-2xl text-[15px] leading-8 text-white/38">
                  Bodolvo is growing product by product. The focus is not on
                  pretending everything is finished. It is on building real
                  foundations, learning from each space, and improving the
                  ecosystem over time.
                </p>
              </div>

              <div className="space-y-3">
                <ApproachItem
                  number="01"
                  title="Build the foundation"
                  text="Start with something real and usable."
                />

                <ApproachItem
                  number="02"
                  title="Learn from the product"
                  text="Understand what works and what needs to change."
                />

                <ApproachItem
                  number="03"
                  title="Connect the world"
                  text="Let each product strengthen the larger ecosystem."
                />

                <ApproachItem
                  number="04"
                  title="Keep evolving"
                  text="Bodolvo should grow without losing its identity."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FUTURE */}
      <section className="border-y border-white/[0.055] bg-[#0b0e13] px-6 py-32">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/24">
            The future
          </p>

          <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-medium leading-[1.06] tracking-[-0.045em] sm:text-5xl md:text-6xl">
            Bodolvo is being built
            <span className="block text-white/35">
              to become more useful over time.
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-[15px] leading-8 text-white/36">
            The ecosystem will continue expanding with new products, deeper
            connections, and better ways for each space to work together.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-white/90"
            >
              Explore products
            </Link>

            <Link
              href="/support"
              className="rounded-full border border-white/[0.1] bg-white/[0.025] px-7 py-3.5 text-sm text-white/65 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
            >
              Visit support
            </Link>
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

              <Link href="/products" className="transition hover:text-white">
                Products
              </Link>

              <Link href="/live" className="transition hover:text-white">
                Live
              </Link>

              <Link href="/about" className="text-white/60">
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

function PrincipleCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <article className="group min-h-[280px] rounded-[28px] border border-white/[0.065] bg-white/[0.02] p-7 transition duration-500 hover:-translate-y-1 hover:border-violet-200/[0.12] hover:bg-white/[0.035]">
      <div className="flex items-center justify-between">
        <span className="text-[9px] tracking-[0.18em] text-white/15">
          {number}
        </span>

        <span className="h-1.5 w-1.5 rounded-full bg-white/10 transition group-hover:bg-violet-200/30" />
      </div>

      <div className="mt-24">
        <h3 className="text-lg font-medium text-white/80">{title}</h3>

        <p className="mt-4 text-sm leading-7 text-white/30">{text}</p>
      </div>
    </article>
  );
}

function WorldItem({
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
      className={`absolute flex min-w-[145px] items-center gap-3 rounded-2xl border border-white/[0.065] bg-[#0d1015]/90 p-4 backdrop-blur ${className}`}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-[9px] text-white/40">
        {letter}
      </div>

      <span className="text-[10px] text-white/30">{title}</span>
    </div>
  );
}

function ApproachItem({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/[0.06] bg-black/10 p-5">
      <div className="flex gap-5">
        <span className="text-[9px] tracking-[0.18em] text-white/16">
          {number}
        </span>

        <div>
          <h3 className="text-sm font-medium text-white/70">{title}</h3>

          <p className="mt-2 text-xs leading-6 text-white/28">{text}</p>
        </div>
      </div>
    </div>
  );
}