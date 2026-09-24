"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Camera,
  Check,
  Copy,
  Globe2,
  Link2,
  Music2,
  Play,
  Share2,
  Sparkles,
  Video,
} from "lucide-react";

const creatorLinks = [
  {
    title: "Explore Bodolvo",
    subtitle: "Apps, tools, and digital products",
    icon: Globe2,
  },
  {
    title: "Latest Release",
    subtitle: "See what we just launched",
    icon: Sparkles,
  },
  {
    title: "Watch Our Videos",
    subtitle: "See our latest content",
    icon: Video,
  },
];

const stats = [
  { value: "24.8K", label: "Profile views" },
  { value: "8.2K", label: "Link clicks" },
  { value: "33.1%", label: "Click rate" },
];

export default function LinkHubLandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f0e8] text-[#131313]">
      <header className="relative z-50">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-6 lg:px-10">
          <Link
            href="/"
            className="flex items-center gap-3 text-sm font-semibold tracking-tight"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#131313] text-white">
              B
            </div>

            <div className="leading-tight">
              <div>Bodolvo</div>
              <div className="text-[11px] font-medium text-black/40">
                Link Hub
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-black/60 md:flex">
            <a href="#features" className="transition hover:text-black">
              Features
            </a>

            <a href="#customize" className="transition hover:text-black">
              Customize
            </a>

            <a href="#analytics" className="transition hover:text-black">
              Analytics
            </a>
          </nav>

          <Link
            href="/apps/link-hub/create"
            className="group inline-flex items-center gap-2 rounded-full bg-[#131313] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:scale-[1.02]"
          >
            Create yours

            <ArrowRight
              size={16}
              className="transition duration-300 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </header>

      <section className="relative">
        <div className="absolute left-[7%] top-[10%] h-32 w-32 rounded-full bg-[#d6ff5f]" />

        <div className="absolute right-[9%] top-[8%] h-16 w-16 rotate-12 rounded-[18px] bg-[#ff7b55]" />

        <div className="absolute right-[17%] top-[40%] h-12 w-12 rounded-full border-[12px] border-[#6657ff]" />

        <div className="mx-auto grid min-h-[850px] max-w-[1500px] items-center gap-16 px-6 pb-24 pt-14 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:pt-10">
          <div className="relative z-10 max-w-[760px]">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/50 px-4 py-2 text-sm font-semibold backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#6657ff]" />
              Your internet, finally organized.
            </div>

            <h1 className="text-[64px] font-semibold leading-[0.9] tracking-[-0.065em] sm:text-[82px] lg:text-[104px]">
              One link.

              <span className="block font-serif italic text-[#6657ff]">
                Every side
              </span>

              <span className="block">of you.</span>
            </h1>

            <p className="mt-9 max-w-xl text-lg leading-8 text-black/55 sm:text-xl">
              Build a beautifully designed home for everything you do online.
              Your content, business, music, socials, projects, and personality
              — all in one place.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/apps/link-hub/create"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#6657ff] px-7 py-4 text-base font-semibold text-white shadow-[0_20px_50px_rgba(102,87,255,0.25)] transition duration-300 hover:-translate-y-1"
              >
                Build your Link Hub

                <ArrowRight
                  size={18}
                  className="transition duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/apps/link-hub/demo"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-black/10 bg-white/60 px-7 py-4 text-base font-semibold backdrop-blur transition hover:bg-white"
              >
                <Play size={16} fill="currentColor" />
                See it live
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-black/45">
              {["Free to start", "No ads", "Fully customizable"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check size={15} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[650px]">
            <div className="absolute -left-14 top-24 hidden w-[220px] rotate-[-8deg] rounded-[28px] border border-black/10 bg-[#d6ff5f] p-5 shadow-xl lg:block">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
                Your link
              </div>

              <div className="mt-3 flex items-center justify-between rounded-2xl bg-black/10 px-3 py-3">
                <span className="truncate text-sm font-semibold">
                  bodolvo.online/u/gp
                </span>

                <Copy size={15} />
              </div>

              <div className="mt-5 text-4xl font-semibold tracking-[-0.05em]">
                Yours.
              </div>

              <p className="mt-2 text-sm leading-5 text-black/55">
                A single home for your entire digital identity.
              </p>
            </div>

            <div className="absolute -right-10 bottom-28 z-20 hidden w-[240px] rotate-[7deg] rounded-[28px] bg-[#131313] p-5 text-white shadow-2xl lg:block">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                  Live performance
                </div>

                <BarChart3 size={17} className="text-[#d6ff5f]" />
              </div>

              <div className="mt-6 text-5xl font-semibold tracking-[-0.06em]">
                8.2K
              </div>

              <div className="mt-1 text-sm text-white/45">link clicks</div>

              <div className="mt-6 flex h-20 items-end gap-1.5">
                {[34, 50, 42, 68, 55, 80, 62, 95, 78, 88].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-full bg-[#6657ff]"
                      style={{ height: `${height}%` }}
                    />
                  )
                )}
              </div>
            </div>

            <div className="relative mx-auto w-[340px] rounded-[52px] border-[8px] border-[#131313] bg-[#131313] p-2 shadow-[0_50px_100px_rgba(0,0,0,0.22)] sm:w-[375px]">
              <div className="overflow-hidden rounded-[40px] bg-gradient-to-b from-[#e2ddff] via-[#f7f4ee] to-[#f4f0e8]">
                <div className="flex justify-center pt-3">
                  <div className="h-7 w-28 rounded-full bg-[#131313]" />
                </div>

                <div className="px-5 pb-7 pt-7">
                  <div className="flex items-start justify-between">
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[24px] bg-[#6657ff] text-3xl font-semibold text-white">
                      B
                    </div>

                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 backdrop-blur transition hover:bg-white"
                    >
                      <Share2 size={17} />
                    </button>
                  </div>

                  <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">
                    Bodolvo
                  </h2>

                  <div className="mt-1 text-sm font-medium text-black/45">
                    @bodolvo
                  </div>

                  <p className="mt-4 text-sm leading-6 text-black/60">
                    Software, tools, experiments, and ideas built for everyday
                    life.
                  </p>

                  <div className="mt-5 flex gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                      <Camera size={16} />
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                      <Video size={16} />
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                      <Music2 size={16} />
                    </div>
                  </div>

                  <div className="mt-7 space-y-3">
                    {creatorLinks.map(
                      ({ title, subtitle, icon: Icon }, index) => (
                        <button
                          key={title}
                          type="button"
                          className={`group flex w-full items-center gap-4 rounded-[22px] p-4 text-left transition duration-300 hover:-translate-y-0.5 ${
                            index === 0
                              ? "bg-[#6657ff] text-white"
                              : "border border-black/10 bg-white/60 text-black backdrop-blur"
                          }`}
                        >
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                              index === 0
                                ? "bg-white/15"
                                : "bg-[#131313] text-white"
                            }`}
                          >
                            <Icon size={18} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="font-semibold">{title}</div>

                            <div
                              className={`mt-0.5 truncate text-xs ${
                                index === 0
                                  ? "text-white/60"
                                  : "text-black/40"
                              }`}
                            >
                              {subtitle}
                            </div>
                          </div>

                          <ArrowRight
                            size={17}
                            className="transition duration-300 group-hover:translate-x-1"
                          />
                        </button>
                      )
                    )}
                  </div>

                  <div className="mt-8 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/30">
                    <Link2 size={12} />
                    Made with Bodolvo
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 left-1/2 -z-10 h-32 w-[420px] -translate-x-1/2 rounded-[100%] bg-black/15 blur-3xl" />
          </div>
        </div>
      </section>

      <section
        id="features"
        className="relative overflow-hidden bg-[#131313] text-white"
      >
        <div className="mx-auto max-w-[1500px] px-6 py-28 lg:px-10 lg:py-36">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d6ff5f]">
                Built differently
              </div>

              <h2 className="mt-6 max-w-md text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-6xl">
                Your page shouldn&apos;t look like everyone else&apos;s.
              </h2>
            </div>

            <div className="grid gap-px overflow-hidden rounded-[36px] bg-white/10 md:grid-cols-2">
              {[
                {
                  number: "01",
                  title: "Flexible layouts",
                  description:
                    "Choose how your content flows instead of being forced into one stack of identical buttons.",
                },
                {
                  number: "02",
                  title: "Real customization",
                  description:
                    "Control typography, backgrounds, cards, spacing, colors, media, and the overall personality of your page.",
                },
                {
                  number: "03",
                  title: "Content blocks",
                  description:
                    "Add links, featured content, videos, music, products, downloads, contact information, and more.",
                },
                {
                  number: "04",
                  title: "Your identity",
                  description:
                    "Build something that feels like your own miniature website instead of a template someone else owns.",
                },
              ].map((feature) => (
                <div
                  key={feature.number}
                  className="min-h-[280px] bg-[#131313] p-8 sm:p-10"
                >
                  <div className="text-sm font-medium text-white/25">
                    {feature.number}
                  </div>

                  <h3 className="mt-16 text-2xl font-semibold tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="mt-4 max-w-sm text-sm leading-7 text-white/45">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="customize"
        className="relative overflow-hidden bg-[#6657ff] text-white"
      >
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full border-[70px] border-white/10" />

        <div className="mx-auto grid max-w-[1500px] gap-20 px-6 py-28 lg:grid-cols-2 lg:px-10 lg:py-36">
          <div className="relative flex min-h-[570px] items-center justify-center">
            <div className="absolute left-[5%] top-[8%] rotate-[-7deg] rounded-[26px] bg-[#d6ff5f] px-6 py-5 text-black shadow-xl">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-black/45">
                Background
              </div>

              <div className="mt-4 flex gap-2">
                {["#D6FF5F", "#FF7B55", "#131313", "#F4F0E8"].map(
                  (color) => (
                    <div
                      key={color}
                      className="h-8 w-8 rounded-full border border-black/10"
                      style={{ backgroundColor: color }}
                    />
                  )
                )}
              </div>
            </div>

            <div className="relative z-10 w-[320px] rotate-[4deg] rounded-[34px] bg-[#f4f0e8] p-5 text-black shadow-2xl">
              <div className="h-56 rounded-[26px] bg-[#ff7b55] p-5">
                <div className="h-14 w-14 rounded-full bg-black" />

                <div className="mt-12 text-3xl font-semibold tracking-tight">
                  Make it
                  <br />
                  feel like you.
                </div>
              </div>

              <div className="mt-4 rounded-[24px] border border-black/10 p-4">
                <div className="flex gap-2">
                  <div className="h-10 flex-1 rounded-full bg-black" />
                  <div className="h-10 flex-1 rounded-full border border-black/10" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-[5%] right-[3%] rotate-[-6deg] rounded-[26px] bg-white p-6 text-black shadow-xl">
              <div className="text-xs font-semibold uppercase tracking-[0.15em] text-black/40">
                Style
              </div>

              <div className="mt-4 space-y-2">
                <div className="h-10 w-40 rounded-full bg-black" />
                <div className="h-10 w-40 rounded-xl border border-black/10" />
                <div className="h-10 w-40 border-b-2 border-black" />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
                Customize everything
              </div>

              <h2 className="mt-6 max-w-xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                Templates are a starting point.

                <span className="block font-serif italic text-[#d6ff5f]">
                  Not a cage.
                </span>
              </h2>

              <p className="mt-7 max-w-lg text-lg leading-8 text-white/65">
                Change the entire mood of your page. Build something clean,
                loud, minimal, colorful, professional, artistic, or completely
                your own.
              </p>

              <Link
                href="/apps/link-hub/create"
                className="mt-9 inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 font-semibold text-black transition duration-300 hover:scale-[1.02]"
              >
                Open the designer
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="analytics" className="bg-[#f4f0e8]">
        <div className="mx-auto max-w-[1500px] px-6 py-28 lg:px-10 lg:py-36">
          <div className="grid items-center gap-20 lg:grid-cols-2">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6657ff]">
                Know what works
              </div>

              <h2 className="mt-6 max-w-xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-6xl">
                Your audience leaves clues.
              </h2>

              <p className="mt-7 max-w-lg text-lg leading-8 text-black/50">
                See what people actually care about with simple, useful
                analytics that show views, clicks, and link performance without
                turning your dashboard into a spreadsheet.
              </p>
            </div>

            <div className="rounded-[38px] bg-[#131313] p-6 text-white shadow-2xl sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/40">Last 30 days</div>

                  <div className="mt-1 text-xl font-semibold">
                    Profile performance
                  </div>
                </div>

                <div className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/60">
                  Live
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="text-2xl font-semibold tracking-tight sm:text-3xl">
                      {stat.value}
                    </div>

                    <div className="mt-2 text-xs text-white/35">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[26px] bg-white/[0.04] p-5">
                <div className="flex h-48 items-end gap-2">
                  {[
                    25, 34, 30, 48, 41, 55, 64, 58, 72, 67, 83, 76, 92, 88,
                  ].map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-full bg-[#d6ff5f]"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#131313] px-6 py-24 text-white lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="relative overflow-hidden rounded-[42px] bg-[#d6ff5f] px-7 py-16 text-black sm:px-12 lg:px-16 lg:py-20">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[60px] border-black/10" />

            <div className="relative z-10 grid items-end gap-10 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-black/45">
                  Bodolvo Link Hub
                </div>

                <h2 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                  Give everything you do
                  <span className="font-serif italic">
                    {" "}
                    one beautiful home.
                  </span>
                </h2>
              </div>

              <Link
                href="/apps/link-hub/create"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-black px-7 py-4 font-semibold text-white transition duration-300 hover:scale-[1.03]"
              >
                Create your page
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-5 pb-2 pt-10 text-sm text-white/35 sm:flex-row sm:items-center sm:justify-between">
            <div>© 2026 Bodolvo</div>
            <div>One link. Your whole world.</div>
          </div>
        </div>
      </section>
    </main>
  );
}