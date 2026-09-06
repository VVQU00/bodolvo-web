import Link from "next/link";

export default function BodolvoLivePage() {
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

            <Link href="/live" className="text-white">
              Live
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
            className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-2.5 text-xs font-medium text-white/75 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            Back to products
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center px-6 pt-[74px]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[18%] top-[30%] h-[600px] w-[600px] rounded-full bg-violet-500/[0.075] blur-[170px]" />
          <div className="absolute right-[5%] top-[20%] h-[500px] w-[500px] rounded-full bg-fuchsia-500/[0.04] blur-[160px]" />
          <div className="absolute bottom-[-15%] left-1/2 h-[350px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/[0.035] blur-[150px]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl gap-20 py-24 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-violet-200/[0.1] bg-violet-300/[0.04] px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-violet-100/45">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-300 opacity-20" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-300/70" />
              </span>

              In development
            </div>

            <p className="text-[10px] uppercase tracking-[0.24em] text-white/25">
              Bodolvo Live
            </p>

            <h1 className="mt-6 max-w-4xl text-[54px] font-medium leading-[0.98] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[86px]">
              Be present
              <span className="block bg-gradient-to-r from-white/50 via-violet-100/40 to-fuchsia-100/30 bg-clip-text text-transparent">
                together.
              </span>
            </h1>

            <p className="mt-8 max-w-[620px] text-[17px] leading-8 text-white/45 md:text-lg">
              Bodolvo Live is being built as a social live environment for
              creators, communities, and people who want connection to feel
              more personal.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#vision"
                className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-white/90"
              >
                See the vision
              </a>

              <Link
                href="/products"
                className="rounded-full border border-white/[0.12] bg-white/[0.02] px-7 py-3.5 text-sm font-medium text-white/70 transition hover:border-white/25 hover:bg-white/[0.05] hover:text-white"
              >
                Explore Bodolvo
              </Link>
            </div>

            <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] uppercase tracking-[0.16em] text-white/18">
              <span>Creators</span>
              <span className="h-1 w-1 rounded-full bg-white/15" />
              <span>Community</span>
              <span className="h-1 w-1 rounded-full bg-white/15" />
              <span>Live connection</span>
            </div>
          </div>

          {/* LIVE CONCEPT */}
          <div className="relative mx-auto w-full max-w-[580px]">
            <div className="absolute -inset-16 rounded-full bg-violet-500/[0.06] blur-[100px]" />

            <div className="relative rounded-[34px] border border-white/[0.09] bg-white/[0.025] p-3 shadow-[0_40px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="overflow-hidden rounded-[27px] border border-white/[0.07] bg-[#101318]">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full border border-white/[0.09] bg-white/[0.04]" />

                    <div>
                      <div className="h-2 w-24 rounded-full bg-white/[0.13]" />
                      <div className="mt-2 h-1.5 w-14 rounded-full bg-white/[0.055]" />
                    </div>
                  </div>

                  <div className="rounded-full border border-violet-200/[0.12] bg-violet-300/[0.06] px-3 py-1.5 text-[8px] uppercase tracking-[0.16em] text-violet-100/45">
                    Live concept
                  </div>
                </div>

                <div className="relative aspect-[4/5] bg-gradient-to-br from-[#181b24] via-[#11141a] to-[#1a1320]">
                  <div className="absolute left-1/2 top-[36%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400/[0.075] blur-[70px]" />

                  <div className="absolute left-5 top-5 rounded-full border border-white/[0.08] bg-black/25 px-3 py-1.5 text-[8px] uppercase tracking-[0.16em] text-white/30 backdrop-blur">
                    Creator space
                  </div>

                  <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/25 px-3 py-1.5 backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-300/70" />
                    <span className="text-[8px] uppercase tracking-[0.14em] text-white/30">
                      Live
                    </span>
                  </div>

                  <div className="absolute bottom-6 left-5 right-20">
                    <div className="h-2.5 w-[72%] rounded-full bg-white/[0.14]" />
                    <div className="mt-3 h-1.5 w-[54%] rounded-full bg-white/[0.06]" />

                    <div className="mt-5 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full border border-white/[0.08] bg-white/[0.04]" />

                      <div>
                        <div className="h-1.5 w-16 rounded-full bg-white/[0.1]" />
                        <div className="mt-2 h-1 w-10 rounded-full bg-white/[0.05]" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-6 right-5 flex flex-col gap-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="h-11 w-11 rounded-full border border-white/[0.08] bg-white/[0.04] backdrop-blur"
                      />
                    ))}
                  </div>

                  <div className="absolute left-5 top-[55%] space-y-2">
                    <div className="rounded-full border border-white/[0.06] bg-black/20 px-3 py-2 text-[8px] text-white/25 backdrop-blur">
                      Community interaction
                    </div>

                    <div className="w-fit rounded-full border border-white/[0.06] bg-black/20 px-3 py-2 text-[8px] text-white/25 backdrop-blur">
                      Live conversation
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-px bg-white/[0.05]">
                  {["Watch", "Connect", "Support"].map((item) => (
                    <div
                      key={item}
                      className="bg-[#101318] px-4 py-5 text-center text-[9px] uppercase tracking-[0.15em] text-white/20"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section
        id="vision"
        className="border-y border-white/[0.055] bg-[#0b0e13] px-6 py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/24">
                The vision
              </p>

              <h2 className="mt-6 max-w-xl text-4xl font-medium leading-[1.06] tracking-[-0.045em] sm:text-5xl">
                Live should feel
                <span className="block text-white/35">alive.</span>
              </h2>
            </div>

            <div className="max-w-xl">
              <p className="text-[16px] leading-8 text-white/42">
                Livestreaming can be entertainment, conversation, community,
                opportunity, and self-expression at the same time.
              </p>

              <p className="mt-6 text-[16px] leading-8 text-white/36">
                Bodolvo Live is being designed around that reality instead of
                treating people like numbers moving through an endless feed.
              </p>
            </div>
          </div>

          <div className="mt-20 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <VisionCard
              number="01"
              title="Creator-first"
              text="Spaces that give creators room to express themselves, build community, and grow."
            />

            <VisionCard
              number="02"
              title="Human"
              text="Interaction should feel social and natural instead of purely transactional."
            />

            <VisionCard
              number="03"
              title="Personal"
              text="Profiles, spaces, and experiences should leave room for personality and identity."
            />

            <VisionCard
              number="04"
              title="Connected"
              text="Live belongs inside the larger Bodolvo world rather than existing as an isolated app."
            />
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/24">
              The experience
            </p>

            <h2 className="mt-6 text-4xl font-medium leading-[1.06] tracking-[-0.045em] sm:text-5xl">
              Built for both sides
              <span className="block text-white/35">
                of the screen.
              </span>
            </h2>

            <p className="mt-7 max-w-2xl text-[15px] leading-8 text-white/36">
              Bodolvo Live is being thought about from the perspective of the
              person broadcasting and the person choosing to spend their time
              there.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <ExperiencePanel
              label="For creators"
              title="Your space should feel like yours."
              description="The goal is to give creators meaningful control over how they present themselves, interact with their audience, and build a recognizable presence."
              items={[
                "Creator spaces",
                "Profile expression",
                "Live interaction",
                "Community building",
                "Audience relationships",
              ]}
            />

            <ExperiencePanel
              label="For viewers"
              title="Watching should still feel social."
              description="Discovery matters, but the experience should also make it easy to stay, participate, connect, and return to the people you actually care about."
              items={[
                "Live discovery",
                "Conversation",
                "Following",
                "Community participation",
                "Support and gifting",
              ]}
            />
          </div>
        </div>
      </section>

      {/* CURRENT STATUS */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[38px] border border-white/[0.07] bg-[#0d1015] px-8 py-20 sm:px-14 lg:px-20">
            <div className="absolute right-[-10%] top-[-60%] h-[600px] w-[600px] rounded-full bg-violet-500/[0.06] blur-[150px]" />

            <div className="relative grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/[0.07] bg-white/[0.025] px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-violet-300/60" />

                  <span className="text-[9px] uppercase tracking-[0.18em] text-white/30">
                    Currently in development
                  </span>
                </div>

                <h2 className="mt-8 text-4xl font-medium leading-[1.08] tracking-[-0.045em] sm:text-5xl md:text-[56px]">
                  We&apos;re building
                  <span className="block text-white/35">
                    the foundation first.
                  </span>
                </h2>

                <p className="mt-8 max-w-2xl text-[15px] leading-8 text-white/38">
                  Bodolvo Live is not publicly available yet. The product,
                  experience, systems, and creator tools are still being
                  developed and refined.
                </p>
              </div>

              <div className="rounded-[26px] border border-white/[0.065] bg-black/10 p-6">
                <p className="text-[9px] uppercase tracking-[0.18em] text-white/20">
                  Development status
                </p>

                <div className="mt-6 space-y-5">
                  <StatusItem label="Interface direction" status="Active" />
                  <StatusItem label="Creator experience" status="Active" />
                  <StatusItem label="Live systems" status="Building" />
                  <StatusItem label="Public release" status="Not yet" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section className="border-y border-white/[0.055] bg-[#0b0e13] px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="relative min-h-[420px]">
              <div className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.06] blur-[100px]" />

              <div className="absolute left-1/2 top-1/2 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-violet-200/[0.12] bg-white/[0.025] backdrop-blur">
                <div className="text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs">
                    L
                  </div>

                  <p className="mt-4 text-[10px] font-semibold tracking-[0.18em]">
                    BODOLVO LIVE
                  </p>

                  <p className="mt-2 text-[8px] uppercase tracking-[0.14em] text-white/20">
                    Connected space
                  </p>
                </div>
              </div>

              <EcosystemNode
                className="left-[4%] top-[10%]"
                letter="N"
                label="Notes"
              />

              <EcosystemNode
                className="right-[4%] top-[10%]"
                letter="R"
                label="Recall"
              />

              <EcosystemNode
                className="bottom-[8%] left-[8%]"
                letter="W"
                label="Whiteboard"
              />

              <EcosystemNode
                className="bottom-[8%] right-[8%]"
                letter="S"
                label="System Center"
              />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/24">
                Part of something larger
              </p>

              <h2 className="mt-6 max-w-xl text-4xl font-medium leading-[1.06] tracking-[-0.045em] sm:text-5xl">
                Live is one space
                <span className="block text-white/35">
                  inside the Bodolvo world.
                </span>
              </h2>

              <p className="mt-8 max-w-xl text-[15px] leading-8 text-white/37">
                Over time, Bodolvo products are intended to feel increasingly
                connected. Different tools, different purposes, but one
                environment you already understand.
              </p>

              <Link
                href="/products"
                className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/[0.1] bg-white/[0.03] px-6 py-3.5 text-sm text-white/65 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                Explore all products
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

              <Link href="/products" className="transition hover:text-white">
                Products
              </Link>

              <Link href="/live" className="text-white/60">
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
            © 2026 Bodolvo. Bodolvo Live is currently in development.
          </div>
        </div>
      </footer>
    </main>
  );
}

function VisionCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <article className="group min-h-[260px] rounded-[28px] border border-white/[0.065] bg-white/[0.02] p-7 transition duration-500 hover:-translate-y-1 hover:border-violet-200/[0.12] hover:bg-white/[0.035]">
      <div className="flex items-center justify-between">
        <span className="text-[9px] tracking-[0.18em] text-white/15">
          {number}
        </span>

        <span className="h-1.5 w-1.5 rounded-full bg-white/10 transition group-hover:bg-violet-200/30" />
      </div>

      <div className="mt-20">
        <h3 className="text-lg font-medium text-white/80">{title}</h3>

        <p className="mt-4 text-sm leading-7 text-white/30">{text}</p>
      </div>
    </article>
  );
}

function ExperiencePanel({
  label,
  title,
  description,
  items,
}: {
  label: string;
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <article className="relative overflow-hidden rounded-[32px] border border-white/[0.07] bg-[#0d1015] p-8 sm:p-10">
      <div className="absolute right-[-20%] top-[-20%] h-64 w-64 rounded-full bg-violet-500/[0.04] blur-[90px]" />

      <div className="relative">
        <p className="text-[9px] uppercase tracking-[0.2em] text-white/22">
          {label}
        </p>

        <h3 className="mt-5 max-w-lg text-3xl font-medium tracking-[-0.035em]">
          {title}
        </h3>

        <p className="mt-6 max-w-xl text-sm leading-7 text-white/34">
          {description}
        </p>

        <div className="mt-10 border-t border-white/[0.06] pt-7">
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.015] px-4 py-3"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-violet-200/25" />

                <span className="text-xs text-white/32">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function StatusItem({
  label,
  status,
}: {
  label: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-white/[0.05] pb-4 last:border-none last:pb-0">
      <span className="text-xs text-white/30">{label}</span>

      <span className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[8px] uppercase tracking-[0.14em] text-white/28">
        {status}
      </span>
    </div>
  );
}

function EcosystemNode({
  className,
  letter,
  label,
}: {
  className: string;
  letter: string;
  label: string;
}) {
  return (
    <div
      className={`absolute flex min-w-[145px] items-center gap-3 rounded-2xl border border-white/[0.065] bg-white/[0.02] p-4 backdrop-blur ${className}`}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-[9px] text-white/40">
        {letter}
      </div>

      <span className="text-[10px] text-white/30">{label}</span>
    </div>
  );
}