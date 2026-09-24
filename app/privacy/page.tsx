import Link from "next/link";

export default function PrivacyPage() {
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
      <section className="relative px-6 pb-24 pt-[190px]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[18%] top-[10%] h-[620px] w-[620px] rounded-full bg-violet-500/[0.055] blur-[180px]" />
          <div className="absolute right-[5%] top-[15%] h-[450px] w-[450px] rounded-full bg-blue-500/[0.03] blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/25">
              Privacy
            </p>

            <h1 className="mt-7 text-5xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[82px]">
              Privacy should feel
              <span className="block bg-gradient-to-r from-white/50 via-white/35 to-violet-200/35 bg-clip-text text-transparent">
                understandable.
              </span>
            </h1>

            <p className="mt-9 max-w-3xl text-[17px] leading-8 text-white/42">
              This page explains the current privacy approach for the Bodolvo
              website and how information may be handled as the ecosystem grows.
            </p>

            <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/[0.07] bg-white/[0.025] px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-300/50" />

              <span className="text-[9px] uppercase tracking-[0.17em] text-white/28">
                Last updated September 2026
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="border-y border-white/[0.055] bg-[#0b0e13] px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/24">
              Our approach
            </p>

            <h2 className="mt-6 max-w-lg text-4xl font-medium leading-[1.06] tracking-[-0.045em] sm:text-5xl">
              Clear first.
              <span className="block text-white/35">Complicated never.</span>
            </h2>
          </div>

          <div className="max-w-2xl space-y-6 text-[15px] leading-8 text-white/38">
            <p>
              Bodolvo is still in development, and many parts of the ecosystem
              are not yet publicly available. This privacy policy describes the
              current public website and the general principles intended to
              guide future Bodolvo products.
            </p>

            <p>
              As products become available and begin collecting different kinds
              of information, product-specific privacy notices may be added or
              this policy may be updated.
            </p>
          </div>
        </div>
      </section>

      {/* POLICY CONTENT */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[260px_1fr]">
            {/* SIDE NAV */}
            <aside className="hidden lg:block">
              <div className="sticky top-[110px] rounded-[26px] border border-white/[0.06] bg-white/[0.018] p-6">
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/18">
                  On this page
                </p>

                <div className="mt-6 space-y-4 text-xs text-white/30">
                  <a href="#information" className="block hover:text-white">
                    Information we collect
                  </a>

                  <a href="#usage" className="block hover:text-white">
                    How information is used
                  </a>

                  <a href="#cookies" className="block hover:text-white">
                    Cookies and analytics
                  </a>

                  <a href="#sharing" className="block hover:text-white">
                    Information sharing
                  </a>

                  <a href="#security" className="block hover:text-white">
                    Security
                  </a>

                  <a href="#retention" className="block hover:text-white">
                    Data retention
                  </a>

                  <a href="#rights" className="block hover:text-white">
                    Your choices
                  </a>

                  <a href="#children" className="block hover:text-white">
                    Children
                  </a>

                  <a href="#changes" className="block hover:text-white">
                    Changes
                  </a>

                  <a href="#contact" className="block hover:text-white">
                    Contact
                  </a>
                </div>
              </div>
            </aside>

            {/* CONTENT */}
            <div className="space-y-5">
              <PolicySection
                id="information"
                number="01"
                title="Information we collect"
              >
                <p>
                  The current Bodolvo website may receive limited information
                  that is automatically provided when someone visits a website,
                  such as browser type, device information, approximate region,
                  referring pages, and basic usage information.
                </p>

                <p>
                  If Bodolvo later introduces forms, accounts, waitlists,
                  support requests, or other interactive features, information
                  may also be provided directly by users, such as a name, email
                  address, account details, or information included in a
                  message.
                </p>
              </PolicySection>

              <PolicySection
                id="usage"
                number="02"
                title="How information may be used"
              >
                <p>
                  Information may be used to operate and improve Bodolvo,
                  understand how public pages are being used, maintain security,
                  respond to requests, troubleshoot problems, and develop new
                  products or features.
                </p>

                <p>
                  Bodolvo does not need to collect information simply because it
                  is technically possible to do so. Future products are intended
                  to follow the same principle of collecting information for a
                  clear product or operational purpose.
                </p>
              </PolicySection>

              <PolicySection
                id="cookies"
                number="03"
                title="Cookies and analytics"
              >
                <p>
                  The website may use cookies or similar technologies when they
                  are needed for essential site functionality, preferences,
                  security, or analytics.
                </p>

                <p>
                  If analytics services are introduced, they may process
                  technical information about visits and interactions. Bodolvo
                  may update this policy with additional detail as those
                  services are implemented.
                </p>
              </PolicySection>

              <PolicySection
                id="sharing"
                number="04"
                title="How information may be shared"
              >
                <p>
                  Information may be shared with service providers when they
                  are needed to operate the website or provide Bodolvo services,
                  such as hosting, infrastructure, analytics, communications,
                  authentication, or security providers.
                </p>

                <p>
                  Information may also be disclosed when reasonably necessary
                  to comply with law, protect users or the public, investigate
                  misuse, or protect Bodolvo systems and services.
                </p>

                <p>
                  Bodolvo does not intend to sell personal information as a
                  standalone business model.
                </p>
              </PolicySection>

              <PolicySection id="security" number="05" title="Security">
                <p>
                  Bodolvo aims to use reasonable technical and organizational
                  measures to protect information from unauthorized access,
                  misuse, alteration, or loss.
                </p>

                <p>
                  No digital system can guarantee absolute security. As Bodolvo
                  products become more advanced and begin handling additional
                  categories of information, security practices will need to
                  evolve with them.
                </p>
              </PolicySection>

              <PolicySection
                id="retention"
                number="06"
                title="Data retention"
              >
                <p>
                  Information should be retained only for as long as reasonably
                  necessary for the purpose it was collected, to maintain
                  security and operations, or to meet legal obligations.
                </p>

                <p>
                  Retention periods may differ between future Bodolvo products
                  depending on the type of information and how the product is
                  used.
                </p>
              </PolicySection>

              <PolicySection
                id="rights"
                number="07"
                title="Your choices and privacy rights"
              >
                <p>
                  Depending on where you live and the services you use, you may
                  have rights relating to access, correction, deletion,
                  portability, objection, or restriction of certain uses of
                  personal information.
                </p>

                <p>
                  As Bodolvo introduces account-based services and dedicated
                  privacy request channels, additional instructions will be
                  provided for exercising applicable rights.
                </p>
              </PolicySection>

              <PolicySection
                id="children"
                number="08"
                title="Children's privacy"
              >
                <p>
                  The current public Bodolvo website is not designed to
                  intentionally collect personal information from children
                  through account or social features.
                </p>

                <p>
                  Future Bodolvo products, particularly social products, may
                  require additional age-related protections, moderation,
                  parental controls, or eligibility rules before public release.
                </p>
              </PolicySection>

              <PolicySection
                id="changes"
                number="09"
                title="Changes to this policy"
              >
                <p>
                  Bodolvo is still developing, so this privacy policy may change
                  as the website and products evolve.
                </p>

                <p>
                  When meaningful changes are made, the updated version and
                  revision date can be published on this page.
                </p>
              </PolicySection>

              <PolicySection
                id="contact"
                number="10"
                title="Questions about privacy"
              >
                <p>
                  A dedicated privacy contact channel has not yet been launched.
                  As Bodolvo moves closer to broader public availability,
                  appropriate contact information and privacy request methods
                  can be added here.
                </p>

                <Link
                  href="/support"
                  className="mt-3 inline-flex items-center gap-2 text-xs text-white/45 transition hover:text-white"
                >
                  Visit Bodolvo Support
                  <span>→</span>
                </Link>
              </PolicySection>
            </div>
          </div>
        </div>
      </section>

      {/* POLICY LINKS */}
      <section className="border-y border-white/[0.055] bg-[#0b0e13] px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 lg:grid-cols-2">
            <PolicyLink
              label="Terms"
              title="The basic rules of the Bodolvo space."
              text="Read the terms that apply to the public site and future Bodolvo services that reference them."
              href="/terms"
              action="Read Terms"
            />

            <PolicyLink
              label="Support"
              title="Need more context?"
              text="Visit Support for current product availability, development information, and general guidance."
              href="/support"
              action="Visit Support"
            />
          </div>
        </div>
      </section>

      {/* NOTE */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[36px] border border-white/[0.07] bg-[#0d1015] px-8 py-16 sm:px-12 lg:px-16">
            <div className="absolute right-[-10%] top-[-90%] h-[500px] w-[500px] rounded-full bg-violet-500/[0.05] blur-[130px]" />

            <div className="relative max-w-3xl">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/22">
                A growing policy
              </p>

              <h2 className="mt-6 text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
                Bodolvo&apos;s privacy practices will grow with its products.
              </h2>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/34">
                This version reflects an early-stage ecosystem. Before
                launching products that handle sensitive, account-based, social,
                financial, or other significant user information, the relevant
                privacy language should be reviewed and expanded.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-white/90"
                >
                  Explore products
                </Link>

                <Link
                  href="/"
                  className="rounded-full border border-white/[0.1] bg-white/[0.025] px-6 py-3 text-sm text-white/65 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                >
                  Return home
                </Link>
              </div>
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

              <Link href="/live" className="transition hover:text-white">
                Live
              </Link>

              <Link href="/about" className="transition hover:text-white">
                About
              </Link>

              <Link href="/support" className="transition hover:text-white">
                Support
              </Link>

              <Link href="/privacy" className="text-white/60">
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

function PolicySection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-[28px] border border-white/[0.06] bg-white/[0.018] p-7 sm:p-9"
    >
      <div className="flex gap-5">
        <span className="pt-1 text-[9px] tracking-[0.18em] text-white/15">
          {number}
        </span>

        <div className="min-w-0">
          <h2 className="text-xl font-medium tracking-[-0.025em] text-white/80">
            {title}
          </h2>

          <div className="mt-6 space-y-5 text-sm leading-7 text-white/32">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function PolicyLink({
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
      <div className="absolute right-[-20%] top-[-50%] h-64 w-64 rounded-full bg-violet-500/[0.04] blur-[90px]" />

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