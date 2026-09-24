// app/apps/qr-barcode/about/page.tsx

"use client";

import { useRouter } from "next/navigation";

type AboutIcon =
  | "back"
  | "scan"
  | "edit"
  | "flash"
  | "shield"
  | "offline"
  | "warning"
  | "cube";

const WEB_ICONS: Record<AboutIcon, string> = {
  back: "‹",
  scan: "⌗",
  edit: "✎",
  flash: "⚡",
  shield: "✓",
  offline: "☁",
  warning: "!",
  cube: "⬡",
};

function AppIcon({
  name,
  size,
  color,
}: {
  name: AboutIcon;
  size: number;
  color: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        color,
        fontSize: size,
        fontWeight: 900,
        lineHeight: `${size + 3}px`,
      }}
    >
      {WEB_ICONS[name]}
    </span>
  );
}

export default function AboutScreen() {
  const router = useRouter();

  return (
    <>
      <main className="safeArea">
        <div className="content">
          <div className="topBar">
            <button
              type="button"
              className="backButton"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <AppIcon
                name="back"
                size={24}
                color="#FFFFFF"
              />
            </button>

            <h1 className="topTitle">
              About
            </h1>

            <div className="topBarSpacer" />
          </div>

          <div className="hero">
            <div className="logoBox">
              <AppIcon
                name="scan"
                size={41}
                color="#FFFFFF"
              />
            </div>

            <p className="brandName">
              BODOLVO
            </p>

            <p className="appName">
              Scanner
            </p>

            <p className="tagline">
              Scan and create QR codes and
              barcodes from one private utility.
            </p>

            <div className="versionBadge">
              <span className="versionText">
                Version 1.0.0
              </span>
            </div>
          </div>

          <InfoCard
            icon="scan"
            title="Scan codes"
            description="Scan QR codes and common barcode formats directly with your device camera."
          />

          <InfoCard
            icon="edit"
            title="Create codes"
            description="Generate QR codes and barcodes from text, links, product codes, and other supported values."
          />

          <InfoCard
            icon="flash"
            title="Built for everyday use"
            description="Save, share, copy, favorite, and revisit your QR codes and barcodes from one place."
          />

          <InfoCard
            icon="shield"
            title="Privacy"
            description="Your generated content, history, favorites, and settings are stored locally on your device. Bodolvo Scanner does not require an account."
          />

          <InfoCard
            icon="offline"
            title="Offline generation"
            description="QR-code and barcode generation works without sending your generated content to a remote server."
          />

          <div className="noteCard">
            <div className="noteHeader">
              <AppIcon
                name="warning"
                size={20}
                color="#171717"
              />

              <span className="noteTitle">
                Scan safely
              </span>
            </div>

            <p className="noteText">
              Only scan codes from sources you
              trust. QR codes and barcodes can
              contain links or information that
              may lead outside Bodolvo Scanner.
            </p>
          </div>

          <div className="bodolvoCard">
            <div className="bodolvoIcon">
              <AppIcon
                name="cube"
                size={22}
                color="#171717"
              />
            </div>

            <div className="bodolvoText">
              <p className="bodolvoTitle">
                A Bodolvo utility
              </p>

              <p className="bodolvoDescription">
                Part of a growing collection of
                simple, reliable tools designed
                for everyday use.
              </p>
            </div>
          </div>

          <p className="credit">
            Built by Bodolvo
          </p>
        </div>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .safeArea {
          min-height: 100dvh;
          background: #ffffff;
          color: #171717;
          overflow-y: auto;
        }

        .content {
          width: 100%;
          max-width: 640px;
          margin: 0 auto;
          padding: 20px 20px 40px;
        }

        .topBar {
          display: flex;
          align-items: center;
        }

        button {
          font-family: inherit;
        }

        .backButton {
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          border: 1px solid #d9d9d9;
          border-radius: 15px;
          cursor: pointer;
        }

        .backButton:active {
          opacity: 0.72;
          transform: scale(0.97);
        }

        .topTitle {
          flex: 1;
          color: #171717;
          font-size: 20px;
          font-weight: 900;
          text-align: center;
          margin: 0;
        }

        .topBarSpacer {
          width: 46px;
        }

        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 34px;
          margin-bottom: 28px;
        }

        .logoBox {
          width: 84px;
          height: 84px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #171717;
          border-radius: 27px;
          box-shadow:
            0 9px 24px
            rgba(34, 211, 238, 0.28);
        }

        .brandName {
          color: #171717;
          font-size: 30px;
          font-weight: 900;
          letter-spacing: 2.5px;
          margin: 18px 0 0;
        }

        .appName {
          color: #555555;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin: 2px 0 0;
        }

        .tagline {
          max-width: 330px;
          color: #555555;
          font-size: 14px;
          line-height: 21px;
          text-align: center;
          margin: 12px 0 0;
        }

        .versionBadge {
          background: #ffffff;
          border: 1px solid #d9d9d9;
          border-radius: 999px;
          padding: 7px 12px;
          margin-top: 13px;
        }

        .versionText {
          color: #171717;
          font-size: 11px;
          font-weight: 800;
        }

        .noteCard {
          background: #291a04;
          border: 1px solid #854d0e;
          border-radius: 18px;
          padding: 15px;
          margin-top: 4px;
        }

        .noteHeader {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .noteTitle {
          color: #171717;
          font-size: 14px;
          font-weight: 900;
        }

        .noteText {
          color: #d6d3d1;
          font-size: 12px;
          line-height: 18px;
          margin: 7px 0 0;
        }

        .bodolvoCard {
          display: flex;
          align-items: center;
          background: #0c1017;
          border: 1px solid #202631;
          border-radius: 18px;
          padding: 15px;
          margin-top: 12px;
        }

        .bodolvoIcon {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #101c31;
          border-radius: 13px;
          margin-right: 12px;
        }

        .bodolvoText {
          flex: 1;
          min-width: 0;
        }

        .bodolvoTitle {
          color: #171717;
          font-size: 14px;
          font-weight: 800;
          margin: 0;
        }

        .bodolvoDescription {
          color: #7c8798;
          font-size: 11px;
          line-height: 17px;
          margin: 3px 0 0;
        }

        .credit {
          color: #555555;
          font-size: 11px;
          font-weight: 700;
          text-align: center;
          margin: 26px 0 0;
        }

        @media (max-width: 430px) {
          .content {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
      `}</style>
    </>
  );
}

type InfoCardProps = {
  icon: AboutIcon;
  title: string;
  description: string;
};

function InfoCard({
  icon,
  title,
  description,
}: InfoCardProps) {
  return (
    <>
      <div className="infoCard">
        <div className="infoIcon">
          <AppIcon
            name={icon}
            size={23}
            color="#171717"
          />
        </div>

        <div className="infoText">
          <p className="infoTitle">
            {title}
          </p>

          <p className="infoDescription">
            {description}
          </p>
        </div>
      </div>

      <style jsx>{`
        .infoCard {
          display: flex;
          background: #ffffff;
          border: 1px solid #d9d9d9;
          border-radius: 20px;
          padding: 15px;
          margin-bottom: 12px;
        }

        .infoIcon {
          width: 45px;
          height: 45px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #101c31;
          border-radius: 14px;
          margin-right: 13px;
        }

        .infoText {
          flex: 1;
          min-width: 0;
        }

        .infoTitle {
          color: #f8fafc;
          font-size: 15px;
          font-weight: 800;
          margin: 0;
        }

        .infoDescription {
          color: #7c8798;
          font-size: 12px;
          line-height: 18px;
          margin: 5px 0 0;
        }
      `}</style>
    </>
  );
}