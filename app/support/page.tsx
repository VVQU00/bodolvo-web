import Link from "next/link";

export default function SupportPage() {
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

            <Link href="/about" className="transition hover:text-white">
              About
            </Link>

            <Link href="/support" className="text-white">
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
      <section className="relative px-6 pb-24 pt-[190px]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[20%] top-[15%] h-[620px] w-[620px] rounded-full bg-violet-500/[0.055] blur-[180px]" />

          <div className="absolute right-[5%] top-[20%] h-[450px] w-[450px] rounded-full bg-blue-500/[0.035] blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/25">
              Bodolvo Support
            </p>

            <h1 className="mt-7 text-5xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[82px]">
              Help should feel
              <span className="block bg-gradient-to-r from-white/50 via-white/35 to-violet-200/35 bg-clip-text text-transparent">
                easy to reach.
              </span>
            </h1>

            <p className="mt-9 max-w-2xl text-[17px] leading-8 text-white/42">
              Find guidance, product information, and clear ways to understand
              where each Bodolvo space currently stands.
            </p>
          </div>
        </div>
      </section>

      {/* SUPPORT OPTIONS */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SupportCard
              number="01"
              title="Product help"
              text="Learn what each Bodolvo product is designed to do and see its current public development status."
              href="/products"
              action="Explore products"
            />

            <SupportCard
              number="02"
              title="Bodolvo Live"
              text="See the product vision, creator direction, and current development status for Bodolvo Live."
              href="/live"
              action="Visit Bodolvo Live"
            />

            <SupportCard
              number="03"
              title="About Bodolvo"
              text="Understand the thinking behind the ecosystem and the principles guiding how Bodolvo is being built."
              href="/about"
              action="Learn about Bodolvo"
            />
          </div>
        </div>
      </section>

      {/* CURRENT AVAILABILITY */}
      <section className="border-y border-white/[0.055] bg-[#0b0e13] px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/24">
                Current availability
              </p>

              <h2 className="mt-6 max-w-xl text-4xl font-medium leading-[1.06] tracking-[-0.045em] sm:text-5xl">
                Some spaces are still
                <span className="block text-white/35">
                  being built.
                </span>
              </h2>

              <p className="mt-8 max-w-xl text-[15px] leading-8 text-white/37">
                Bodolvo is still in active development. Product pages may
                describe features and experiences that are currently being
                created, tested, or refined.
              </p>
            </div>

            <div className="space-y-3">
              <StatusRow
                title="Bodolvo Notes"
                status="Available"
                description="An early usable version is available."
              />

              <StatusRow
                title="Bodolvo Live"
                status="In development"
                description="The product and live experience are still being built."
              />

              <StatusRow
                title="Bodolvo Whiteboard"
                status="In development"
                description="Core collaboration and session features are being developed."
              />

              <StatusRow
                title="Bodolvo Recall"
                status="In development"
                description="Capture and recall systems are being developed."
              />

              <StatusRow
                title="Bodolvo System Center"
                status="In development"
                description="System monitoring and management features are being expanded."
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/24">
              Common questions
            </p>

            <h2 className="mt-6 text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
              A few things worth knowing.
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <FaqCard
              question="Is every Bodolvo product available now?"
              answer="No. Bodolvo is still growing. Some products have early usable versions, while others are still in active development."
            />

            <FaqCard
              question="Can I download Bodolvo Live?"
              answer="Not yet. Bodolvo Live is currently in development and does not have a public release available."
            />

            <FaqCard
              question="Are Bodolvo products meant to work together?"
              answer="Yes. The long-term direction is for individual Bodolvo spaces to feel increasingly connected while still working well on their own."
            />

            <FaqCard
              question="Will more products be added?"
              answer="Yes. Bodolvo is being designed as a growing ecosystem, so new tools and services may be introduced over time."
            />

            <FaqCard
              question="Why are some pages showing concept interfaces?"
              answer="Some visuals are design previews used to communicate the intended product direction while development continues."
            />

            <FaqCard
              question="Where can I see the latest product status?"
              answer="The Products page is the best place to see the current public status of each Bodolvo space."
            />
          </div>
        </div>
      </section>

      {/* PRIVACY + TERMS */}
      <section className="border-y border-white/[0.055] bg-[#0b0e13] px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/24">
              Policies
            </p>

            <h2 className="mt-6 text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
              Know how the world
              <span className="block text-white/35">
                is being built.
              </span>
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <PolicyCard
              label="Privacy"
              title="How information is approached."
              text="Read Bodolvo's current privacy approach and how the policy may evolve as more products become available."
              href="/privacy"
              action="Read Privacy"
            />

            <PolicyCard
              label="Terms"
              title="The basic rules of the space."
              text="Read the current terms that apply to the public Bodolvo website and future services that may reference them."
              href="/terms"
              action="Read Terms"
            />
          </div>
        </div>
      </section>

      {/* CONTACT / SUPPORT STATUS */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[38px] border border-white/[0.07] bg-[#0d1015] px-8 py-20 sm:px-14 lg:px-20">
            <div className="absolute right-[-10%] top-[-70%] h-[600px] w-[600px] rounded-full bg-violet-500/[0.055] blur-[140px]" />

            <div className="relative grid gap-16 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/24">
                  Support is growing too
                </p>

                <h2 className="mt-6 max-w-2xl text-4xl font-medium leading-[1.08] tracking-[-0.045em] sm:text-5xl">
                  The support system will
                  <span className="block text-white/35">
                    grow with the products.
                  </span>
                </h2>

                <p className="mt-8 max-w-xl text-[15px] leading-8 text-white/38">
                  Dedicated documentation, support channels, account help, and
                  product-specific guidance will be added as more Bodolvo
                  products move toward public release.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/products"
                    className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-white/90"
                  >
                    Explore products
                  </Link>

                  <Link
                    href="/about"
                    className="rounded-full border border-white/[0.1] bg-white/[0.025] px-7 py-3.5 text-sm text-white/65 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                  >
                    About Bodolvo
                  </Link>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/[0.065] bg-black/10 p-7">
                <p className="text-[9px] uppercase tracking-[0.18em] text-white/20">
                  Support status
                </p>

                <div className="mt-7 space-y-5">
                  <ContactItem
                    label="Product information"
                    value="Available"
                  />

                  <ContactItem
                    label="Privacy information"
                    value="Available"
                  />

                  <ContactItem
                    label="Terms"
                    value="Available"
                  />

                  <ContactItem
                    label="Documentation"
                    value="Planned"
                  />

                  <ContactItem
                    label="Direct support"
                    value="Planned"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-y border-white/[0.055] bg-[#0b0e13] px-6 py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/24">
            Keep exploring
          </p>

          <h2 className="mt-6 text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
            Find the Bodolvo space
            <span className="block text-white/35">
              that fits what you need.
            </span>
          </h2>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-white/90"
            >
              Explore products
            </Link>

            <Link
              href="/"
              className="rounded-full border border-white/[0.1] bg-white/[0.025] px-7 py-3.5 text-sm text-white/65 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
            >
              Return home
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

              <Link href="/about" className="transition hover:text-white">
                About
              </Link>

              <Link href="/support" className="text-white/60">
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

function SupportCard({
  number,
  title,
  text,
  href,
  action,
}: {
  number: string;
  title: string;
  text: string;
  href: string;
  action: string;
}) {
  return (
    <article className="group flex min-h-[330px] flex-col rounded-[30px] border border-white/[0.065] bg-white/[0.02] p-7 transition duration-500 hover:-translate-y-1 hover:border-violet-200/[0.12] hover:bg-white/[0.035]">
      <div className="flex items-center justify-between">
        <span className="text-[9px] tracking-[0.18em] text-white/15">
          {number}
        </span>

        <span className="h-1.5 w-1.5 rounded-full bg-white/10 transition group-hover:bg-violet-200/30" />
      </div>

      <div className="mt-auto pt-20">
        <h3 className="text-xl font-medium text-white/82">{title}</h3>

        <p className="mt-4 max-w-sm text-sm leading-7 text-white/30">{text}</p>

        <Link
          href={href}
          className="mt-7 inline-flex items-center gap-2 text-xs text-white/28 transition group-hover:text-white/65"
        >
          {action}

          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

function StatusRow({
  title,
  status,
  description,
}: {
  title: string;
  status: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/[0.06] bg-white/[0.018] p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-sm font-medium text-white/70">{title}</h3>

          <p className="mt-2 text-xs leading-6 text-white/26">
            {description}
          </p>
        </div>

        <span className="w-fit rounded-full border border-white/[0.065] bg-white/[0.02] px-3 py-1.5 text-[8px] uppercase tracking-[0.14em] text-white/28">
          {status}
        </span>
      </div>
    </div>
  );
}

function FaqCard({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <article className="rounded-[28px] border border-white/[0.065] bg-white/[0.018] p-7 sm:p-8">
      <h3 className="text-[17px] font-medium tracking-[-0.02em] text-white/78">
        {question}
      </h3>

      <p className="mt-5 text-sm leading-7 text-white/30">
        {answer}
      </p>
    </article>
  );
}

function PolicyCard({
  label,
  title,
  text,
  href,
  action,
}: {
  label: string;
  title: string;
  text: string;
  href: string;
  action: string;
}) {
  return (
    <article className="group relative overflow-hidden rounded-[30px] border border-white/[0.065] bg-white/[0.018] p-8 sm:p-10">
      <div className="absolute right-[-20%] top-[-40%] h-64 w-64 rounded-full bg-violet-500/[0.04] blur-[90px]" />

      <div className="relative">
        <p className="text-[9px] uppercase tracking-[0.2em] text-white/20">
          {label}
        </p>

        <h3 className="mt-5 text-2xl font-medium tracking-[-0.03em] text-white/78">
          {title}
        </h3>

        <p className="mt-5 max-w-xl text-sm leading-7 text-white/30">
          {text}
        </p>

        <Link
          href={href}
          className="mt-8 inline-flex items-center gap-2 text-xs text-white/30 transition group-hover:text-white/65"
        >
          {action}

          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

function ContactItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-8 border-b border-white/[0.05] pb-4 last:border-none last:pb-0">
      <span className="text-xs text-white/28">{label}</span>

      <span className="max-w-[190px] text-right text-xs text-white/45">
        {value}
      </span>
    </div>
  );
}