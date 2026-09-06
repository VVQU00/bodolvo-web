import Link from "next/link";

export default function TermsPage() {
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
              Terms of Use
            </p>

            <h1 className="mt-7 text-5xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[82px]">
              Clear expectations.
              <span className="block bg-gradient-to-r from-white/50 via-white/35 to-violet-200/35 bg-clip-text text-transparent">
                Simple rules.
              </span>
            </h1>

            <p className="mt-9 max-w-3xl text-[17px] leading-8 text-white/42">
              These terms explain the basic rules for using the Bodolvo website
              and future public services as the ecosystem continues to grow.
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
              Before you use Bodolvo
            </p>

            <h2 className="mt-6 max-w-lg text-4xl font-medium leading-[1.06] tracking-[-0.045em] sm:text-5xl">
              Use the world
              <span className="block text-white/35">with care.</span>
            </h2>
          </div>

          <div className="max-w-2xl space-y-6 text-[15px] leading-8 text-white/38">
            <p>
              By accessing or using the Bodolvo website or any future Bodolvo
              service that links to these terms, you agree to follow these
              terms and any product-specific rules that may apply.
            </p>

            <p>
              Bodolvo is still in development. Some products, features,
              concepts, and previews shown on this website may not yet be
              publicly available.
            </p>
          </div>
        </div>
      </section>

      {/* TERMS CONTENT */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[260px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-[110px] rounded-[26px] border border-white/[0.06] bg-white/[0.018] p-6">
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/18">
                  On this page
                </p>

                <div className="mt-6 space-y-4 text-xs text-white/30">
                  <a href="#eligibility" className="block hover:text-white">
                    Eligibility
                  </a>

                  <a href="#accounts" className="block hover:text-white">
                    Accounts
                  </a>

                  <a href="#acceptable-use" className="block hover:text-white">
                    Acceptable use
                  </a>

                  <a href="#content" className="block hover:text-white">
                    User content
                  </a>

                  <a href="#ownership" className="block hover:text-white">
                    Ownership
                  </a>

                  <a href="#development" className="block hover:text-white">
                    Development status
                  </a>

                  <a href="#third-party" className="block hover:text-white">
                    Third-party services
                  </a>

                  <a href="#disclaimers" className="block hover:text-white">
                    Disclaimers
                  </a>

                  <a href="#liability" className="block hover:text-white">
                    Liability
                  </a>

                  <a href="#termination" className="block hover:text-white">
                    Suspension and termination
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

            <div className="space-y-5">
              <TermsSection
                id="eligibility"
                number="01"
                title="Eligibility"
              >
                <p>
                  You may use the current public Bodolvo website if you are
                  legally able to enter into these terms under the laws that
                  apply to you.
                </p>

                <p>
                  Future Bodolvo products may have additional age, account,
                  identity, geographic, or eligibility requirements. Those
                  requirements may be presented separately when a product
                  becomes available.
                </p>
              </TermsSection>

              <TermsSection
                id="accounts"
                number="02"
                title="Accounts and access"
              >
                <p>
                  Some future Bodolvo services may require an account. If you
                  create one, you are responsible for keeping your login
                  information secure and for activity that occurs through your
                  account.
                </p>

                <p>
                  You should provide accurate information where required and
                  should not attempt to impersonate another person, access
                  another user&apos;s account, or bypass account protections.
                </p>
              </TermsSection>

              <TermsSection
                id="acceptable-use"
                number="03"
                title="Acceptable use"
              >
                <p>
                  You may not use Bodolvo to interfere with the service, damage
                  systems, distribute malicious software, exploit security
                  weaknesses, access systems without authorization, or disrupt
                  other users.
                </p>

                <p>
                  Future social or community products may include additional
                  rules covering harassment, abuse, illegal activity, fraud,
                  impersonation, spam, harmful content, and other misuse.
                </p>

                <p>
                  Product-specific community guidelines may be introduced
                  before services such as Bodolvo Live become publicly
                  available.
                </p>
              </TermsSection>

              <TermsSection id="content" number="04" title="User content">
                <p>
                  Future Bodolvo products may allow users to create, upload,
                  stream, post, store, or share content.
                </p>

                <p>
                  You remain responsible for content you provide and for making
                  sure you have the rights and permissions necessary to use that
                  content.
                </p>

                <p>
                  Additional content licenses, moderation rules, reporting
                  systems, and removal procedures may apply to products that
                  support public posting or livestreaming.
                </p>
              </TermsSection>

              <TermsSection
                id="ownership"
                number="05"
                title="Bodolvo ownership"
              >
                <p>
                  Bodolvo branding, website design, product names, software,
                  interfaces, graphics, text, and other materials created by or
                  for Bodolvo may be protected by intellectual property laws.
                </p>

                <p>
                  These terms do not transfer ownership of Bodolvo technology
                  or brand assets to users.
                </p>

                <p>
                  You may not copy, sell, redistribute, reverse engineer, or
                  commercially exploit protected Bodolvo materials except where
                  permission is granted or applicable law allows it.
                </p>
              </TermsSection>

              <TermsSection
                id="development"
                number="06"
                title="Products in development"
              >
                <p>
                  Bodolvo is an evolving ecosystem. Product descriptions,
                  screenshots, mockups, concept interfaces, features, release
                  plans, and development statuses may change.
                </p>

                <p>
                  Nothing displayed as a concept, planned feature, development
                  preview, or unreleased product should be interpreted as a
                  promise that the feature will launch in a particular form or
                  on a particular date.
                </p>
              </TermsSection>

              <TermsSection
                id="third-party"
                number="07"
                title="Third-party services"
              >
                <p>
                  Bodolvo may rely on third-party services for hosting,
                  authentication, payments, communications, analytics,
                  infrastructure, app distribution, or other functionality.
                </p>

                <p>
                  Those services may have their own terms and privacy policies.
                  Bodolvo is not responsible for independent services that are
                  outside its control.
                </p>
              </TermsSection>

              <TermsSection
                id="disclaimers"
                number="08"
                title="Service disclaimers"
              >
                <p>
                  Bodolvo services are provided on an as-available basis to the
                  extent permitted by law.
                </p>

                <p>
                  While Bodolvo aims to create dependable products,
                  uninterrupted availability, error-free operation,
                  compatibility with every device, or permanent availability of
                  every feature cannot be guaranteed.
                </p>

                <p>
                  Early-stage, beta, preview, or development services may change
                  more frequently and may contain unfinished functionality.
                </p>
              </TermsSection>

              <TermsSection
                id="liability"
                number="09"
                title="Limitation of liability"
              >
                <p>
                  To the extent permitted by applicable law, Bodolvo will not be
                  responsible for indirect, incidental, special, consequential,
                  or similar damages resulting from use of or inability to use
                  the website or services.
                </p>

                <p>
                  Some jurisdictions do not allow certain limitations, so these
                  limitations may not apply in every situation.
                </p>
              </TermsSection>

              <TermsSection
                id="termination"
                number="10"
                title="Suspension and termination"
              >
                <p>
                  Future Bodolvo services may suspend, restrict, or terminate
                  access when reasonably necessary to protect users, systems,
                  the platform, or the public, or when these terms or
                  product-specific rules are violated.
                </p>

                <p>
                  Additional procedures may be created for account appeals,
                  moderation decisions, or restoration of access as relevant
                  products are launched.
                </p>
              </TermsSection>

              <TermsSection
                id="changes"
                number="11"
                title="Changes to these terms"
              >
                <p>
                  These terms may be updated as Bodolvo develops new products,
                  features, policies, and business operations.
                </p>

                <p>
                  When the terms are revised, the updated version and revision
                  date may be published on this page. Where appropriate,
                  additional notice may be provided for significant changes.
                </p>
              </TermsSection>

              <TermsSection id="contact" number="12" title="Questions">
                <p>
                  Dedicated legal and support contact channels may be added as
                  Bodolvo moves toward broader public availability.
                </p>

                <p>
                  For current general information, you can visit the Bodolvo
                  Support page.
                </p>

                <Link
                  href="/support"
                  className="mt-3 inline-flex items-center gap-2 text-xs text-white/45 transition hover:text-white"
                >
                  Visit Bodolvo Support
                  <span>→</span>
                </Link>
              </TermsSection>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="border-y border-white/[0.055] bg-[#0b0e13] px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 lg:grid-cols-2">
            <RelatedCard
              label="Privacy"
              title="Understand how information is approached."
              text="Read Bodolvo's current privacy approach for the public website and future products."
              href="/privacy"
              action="Read Privacy"
            />

            <RelatedCard
              label="Support"
              title="Need more context?"
              text="See current product availability, development information, and general Bodolvo guidance."
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
                Early-stage terms
              </p>

              <h2 className="mt-6 text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
                These terms should evolve before major product launches.
              </h2>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/34">
                Before Bodolvo launches services involving accounts,
                livestreaming, user-generated content, payments, subscriptions,
                virtual goods, minors, moderation, or other higher-risk
                features, the relevant terms should be reviewed and expanded to
                match how those products actually operate.
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

              <Link href="/privacy" className="transition hover:text-white">
                Privacy
              </Link>

              <Link href="/terms" className="text-white/60">
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

function TermsSection({
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

function RelatedCard({
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